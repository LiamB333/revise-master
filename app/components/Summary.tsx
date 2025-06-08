"use client";

import { useState, useEffect } from "react";
import { useDocuments } from "../contexts/DocumentContext";
import ReactMarkdown from "react-markdown";

interface SummaryProps {
  documentId: string | null;
}

export default function Summary({ documentId }: SummaryProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { documents } = useDocuments();

  useEffect(() => {
    if (!documentId) return;

    const document = documents.find((doc) => doc.id === documentId);
    if (!document) return;

    const generateSummary = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/generate-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: document.content }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate summary");
        }

        const data = await response.json();
        setSummary(data.summary);
      } catch (error) {
        console.error("Error generating summary:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
  }, [documentId, documents]);

  if (!documentId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a document to study</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No summary available</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}
