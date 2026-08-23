import React from 'react';

interface DirectAnswerSummaryProps {
  /**
   * The text should be concise, ideally under 60 words, to be easily extracted by Generative Engines (LLMs).
   */
  text: string;
  className?: string;
  as?: React.ElementType;
}

/**
 * Renders a highly optimized summary paragraph intended for Generative Engine Optimization (GEO).
 * This component ensures the summary is accessible, semantically correct, and visually appropriate.
 */
export function DirectAnswerSummary({ text, className = "", as: Component = "p" }: DirectAnswerSummaryProps) {
  return (
    <Component
      className={`text-lg leading-relaxed text-gray-700 dark:text-gray-300 font-medium mb-6 ${className}`}
      data-geo-summary="true"
    >
      {text}
    </Component>
  );
}

