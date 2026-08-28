/**
 * JSON-LD Structured Data components for SEO
 * These components generate Schema.org structured data for educational tools
 */

import React from "react";
import { SITE_URL, DEFAULT_LOGO, DEFAULT_OG_IMAGE } from "@/lib/site-config";

interface ToolStructuredDataProps {
  name: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
}

/**
 * Generates JSON-LD structured data for an educational software tool
 */
export function ToolStructuredData({
  name,
  description,
  url,
  datePublished = "2024-01-01",
  dateModified,
  author = "AquatechIA",
  keywords = [],
}: ToolStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Organization",
      name: author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_LOGO,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished || "2026-08-27",
    keywords: keywords.join(", "),
    inLanguage: "es",
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface ArticleStructuredDataProps {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  image?: string;
}

/**
 * Generates JSON-LD structured data for educational articles/guides
 */
export function ArticleStructuredData({
  title,
  description,
  url,
  datePublished = "2024-01-01",
  dateModified,
  author = "AquatechIA",
  image = DEFAULT_OG_IMAGE,
}: ArticleStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image,
    author: {
      "@type": "Organization",
      name: author,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_LOGO,
      },
    },
    datePublished,
    dateModified: dateModified || datePublished || "2026-08-27",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: "es",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

/**
 * Generates JSON-LD breadcrumb structured data
 */
export function BreadcrumbStructuredData({
  items,
}: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export interface FAQStructuredDataProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQStructuredData({ faqs }: FAQStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export interface HowToStructuredDataProps {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    url?: string;
    image?: string;
  }>;
}

export function HowToStructuredData({ name, description, steps }: HowToStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
      url: step.url,
      image: step.image,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
