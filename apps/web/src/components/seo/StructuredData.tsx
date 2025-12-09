/**
 * JSON-LD Structured Data components for SEO
 * These components generate Schema.org structured data for educational tools
 */

import React from "react";

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
  dateModified = new Date().toISOString().split("T")[0],
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
      url: "https://aquatechia.com",
    },
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      url: "https://aquatechia.com",
      logo: {
        "@type": "ImageObject",
        url: "https://aquatechia.com/logo.png",
      },
    },
    datePublished,
    dateModified,
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
  dateModified = new Date().toISOString().split("T")[0],
  author = "AquatechIA",
  image = "https://aquatechia.com/images/og/default.jpg",
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
      url: "https://aquatechia.com",
    },
    publisher: {
      "@type": "Organization",
      name: "AquatechIA",
      url: "https://aquatechia.com",
      logo: {
        "@type": "ImageObject",
        url: "https://aquatechia.com/logo.png",
      },
    },
    datePublished,
    dateModified,
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
