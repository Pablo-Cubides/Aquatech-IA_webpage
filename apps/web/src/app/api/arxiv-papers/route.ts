import { NextRequest, NextResponse } from 'next/server';
import { ArxivPaper, ArxivApiResponse, BLOG_TO_ARXIV_CATEGORIES } from '../../(portals)/ia/(marketing)/herramientas/papers-ia/types/arxiv';

// Cache for storing results (simple in-memory cache)
const cache = new Map<string, { data: ArxivApiResponse; timestamp: number }>();
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 hours
const RATE_LIMIT_DELAY = 4000; // Increased to 4 seconds to be safe

let lastRequestTime = 0;
// Queue to serialize requests to avoid hitting rate limits
let requestQueue = Promise.resolve();

/**
 * Parse ArXiv XML response to JSON
 */
function parseArxivXML(xmlText: string): ArxivPaper[] {
  const papers: ArxivPaper[] = [];
  
  // Extract entries using regex (more reliable than DOMParser in edge runtime)
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entryXml = match[1];
    
    // Extract fields
    const id = extractTag(entryXml, 'id');
    const title = extractTag(entryXml, 'title')?.replace(/\s+/g, ' ').trim();
    const abstract = extractTag(entryXml, 'summary')?.replace(/\s+/g, ' ').trim();
    const published = extractTag(entryXml, 'published');
    const updated = extractTag(entryXml, 'updated');
    
    // Extract authors
    const authors: string[] = [];
    const authorRegex = /<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g;
    let authorMatch;
    while ((authorMatch = authorRegex.exec(entryXml)) !== null) {
      authors.push(authorMatch[1].trim());
    }
    
    // Extract categories
    const categories: string[] = [];
    const categoryRegex = /<category[^>]*term="([^"]+)"/g;
    let catMatch;
    while ((catMatch = categoryRegex.exec(entryXml)) !== null) {
      categories.push(catMatch[1]);
    }
    
    // Extract links
    let pdfUrl = '';
    let arxivUrl = '';
    const linkRegex = /<link[^>]*href="([^"]+)"[^>]*(?:title="([^"]*)")?[^>]*type="([^"]*)"?[^>]*>/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(entryXml)) !== null) {
      const href = linkMatch[1];
      const title = linkMatch[2] || '';
      if (title === 'pdf' || href.includes('/pdf/')) {
        pdfUrl = href;
      } else if (href.includes('arxiv.org/abs/')) {
        arxivUrl = href;
      }
    }
    
    // Fallback for PDF URL
    if (!pdfUrl && id) {
      const arxivId = id.replace('http://arxiv.org/abs/', '');
      pdfUrl = `https://arxiv.org/pdf/${arxivId}.pdf`;
    }
    
    // Fallback for arxiv URL
    if (!arxivUrl && id) {
      arxivUrl = id.replace('http://', 'https://');
    }
    
    // Extract DOI if present
    const doiMatch = entryXml.match(/<arxiv:doi[^>]*>([\s\S]*?)<\/arxiv:doi>/);
    const doi = doiMatch ? doiMatch[1].trim() : undefined;
    
    if (id && title) {
      papers.push({
        id: id.replace('http://arxiv.org/abs/', ''),
        title,
        authors,
        abstract: abstract || '',
        published: published || '',
        updated: updated || '',
        categories,
        pdfUrl,
        arxivUrl,
        doi,
      });
    }
  }
  
  return papers;
}

function extractTag(xml: string, tagName: string): string | undefined {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1] : undefined;
}

function extractTotalResults(xmlText: string): number {
  const match = xmlText.match(/<opensearch:totalResults[^>]*>(\d+)<\/opensearch:totalResults>/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Build ArXiv API query URL using URLSearchParams for correct encoding
 */
function buildArxivUrl(params: {
  categories: string[];
  search?: string;
  start: number;
  maxResults: number;
  sortBy: string;
}): string {
  const { categories, search, start, maxResults, sortBy } = params;
  
  let searchQuery = '';
  
  // Add category filter
  if (categories.length > 0) {
    // Join with +OR+ but don't encode the operators yet, we'll handle construction carefully
    // cat:cs.AI OR cat:cs.LG
    searchQuery = categories.map(c => `cat:${c}`).join(' OR ');
  }
  
  // Add text search
  if (search) {
    // all:search term
    const textQuery = `all:${search}`;
    searchQuery = searchQuery ? `(${searchQuery}) AND ${textQuery}` : textQuery;
  }
  
  // Default to AI papers if no query
  if (!searchQuery) {
    // cat:cs.AI OR cat:cs.LG OR cat:cs.CL
    searchQuery = 'cat:cs.AI OR cat:cs.LG OR cat:cs.CL';
  }
  
  const sortOrder = sortBy === 'relevance' ? 'relevance' : 'submittedDate';
  
  // We construct the URL manually to ensure ArXiv compatible query string
  // ArXiv expects: search_query=cat:subject+AND+all:electron
  // We can use URLSearchParams to encode the value of search_query
  
  const queryParams = new URLSearchParams();
  queryParams.set('search_query', searchQuery);
  queryParams.set('start', start.toString());
  queryParams.set('max_results', maxResults.toString());
  queryParams.set('sortBy', sortOrder);
  queryParams.set('sortOrder', 'descending');

  return `https://export.arxiv.org/api/query?${queryParams.toString()}`;
}

async function fetchWithRetry(url: string, retries = 3, backoff = 5000): Promise<Response> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'AquatechIA/1.0 (https://aquatechpro.co; contact@aquatechpro.co)',
      },
      next: { revalidate: 3600 } 
    });

    if (response.status === 429 && retries > 0) {
      console.warn(`ArXiv 429 Rate Limit. Retrying in ${backoff}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }

    if (!response.ok) {
      throw new Error(`ArXiv API error: ${response.status}`);
    }

    return response;
  } catch (error) {
    if (retries > 0) {
      console.warn(`Fetch error. Retrying in ${backoff}ms...`, error);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, retries - 1, backoff * 2);
    }
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const blogCategory = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);
    const start = parseInt(searchParams.get('start') || '0', 10);
    const sortBy = searchParams.get('sortBy') || 'submittedDate';
    
    // Get ArXiv categories from blog category
    let arxivCategories: string[] = [];
    if (blogCategory && BLOG_TO_ARXIV_CATEGORIES[blogCategory]) {
      arxivCategories = BLOG_TO_ARXIV_CATEGORIES[blogCategory];
    } else if (blogCategory) {
      console.warn(`Category not found in mapping: ${blogCategory}`);
    }
    
    // Create cache key
    const cacheKey = JSON.stringify({ arxivCategories, search, limit, start, sortBy });
    
    // Check in-memory cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    // Process request in a serialized queue
    const result = await new Promise<ArxivApiResponse>((resolve, reject) => {
      requestQueue = requestQueue.then(async () => {
        try {
          // Rate limiting check
          const now = Date.now();
          const timeSinceLastRequest = now - lastRequestTime;
          if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
            await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY - timeSinceLastRequest));
          }
          
          lastRequestTime = Date.now();

          // Build ArXiv URL
          const arxivUrl = buildArxivUrl({
            categories: arxivCategories,
            search,
            start,
            maxResults: limit,
            sortBy,
          });

          console.log(`Fetching ArXiv: ${arxivUrl}`);

          // Perform fetch with retry logic
          const response = await fetchWithRetry(arxivUrl);
          const xmlText = await response.text();
          
          const papers = parseArxivXML(xmlText);
          const totalResults = extractTotalResults(xmlText);
          
          const apiResponse: ArxivApiResponse = {
            papers,
            totalResults,
            startIndex: start,
            itemsPerPage: limit,
          };

          // Store in cache
          cache.set(cacheKey, { data: apiResponse, timestamp: Date.now() });
          
          resolve(apiResponse);
        } catch (error) {
          reject(error);
        }
      }).catch(err => {
        console.error("Queue processing error", err);
      });
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('ArXiv API error:', error);
    return NextResponse.json(
      { error: error.message || 'Error fetching papers from ArXiv' },
      { status: 500 }
    );
  }
}
