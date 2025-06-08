"use client";

import { useState } from "react";
import DocumentSelector from "../components/DocumentSelector";
import Summary from "../components/Summary";

export default function SummariesPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Document Summaries
        </h1>

        <div className="space-y-6">
          <DocumentSelector
            selectedDocument={selectedDocument}
            onDocumentSelect={setSelectedDocument}
          />

          {selectedDocument && (
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <Summary documentId={selectedDocument} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
