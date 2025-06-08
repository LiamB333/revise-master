"use client";

import { FiFile } from "react-icons/fi";
import { useDocuments } from "../contexts/DocumentContext";

interface DocumentSelectorProps {
  selectedDocument: string | null;
  onDocumentSelect: (documentId: string) => void;
}

export default function DocumentSelector({
  selectedDocument,
  onDocumentSelect,
}: DocumentSelectorProps) {
  const { documents } = useDocuments();

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
        <div className="flex flex-col items-center">
          <FiFile className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No documents yet
          </h3>
          <p className="text-gray-500">Upload a document to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border">
      <label
        htmlFor="document"
        className="block text-sm font-medium text-gray-900 mb-2"
      >
        Select Document
      </label>
      <div className="relative">
        <select
          id="document"
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          value={selectedDocument || ""}
          onChange={(e) => onDocumentSelect(e.target.value)}
        >
          <option value="" className="text-gray-500">
            Choose a document
          </option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id} className="text-gray-900">
              {doc.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
