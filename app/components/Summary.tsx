"use client";

import ReactMarkdown from "react-markdown";

interface SummaryProps {
  summary: string;
  isLoading: boolean;
}

export default function Summary({ summary, isLoading }: SummaryProps) {
  if (isLoading) {
    return (
      <div className="text-center text-gray-600">Generating summary...</div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center text-gray-600">
        No summary available. Upload a PDF to generate a summary.
      </div>
    );
  }

  return (
    <div className="prose prose-blue max-w-none text-black">
      <ReactMarkdown>{summary}</ReactMarkdown>
    </div>
  );
}
