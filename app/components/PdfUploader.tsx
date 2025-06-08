"use client";

import { useState, useRef } from "react";
import { FiUpload, FiX } from "react-icons/fi";
import * as pdfjsLib from "pdfjs-dist";
import { useDocuments } from "../contexts/DocumentContext";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDocument } = useDocuments();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load the PDF file
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      // Extract text from all pages
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += pageText + "\n";
      }

      // Create a new document
      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: "pdf" as const,
        tags: [],
        createdAt: new Date(),
        folderId: null,
        content: fullText,
      };

      addDocument(newDocument);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError("Error processing PDF file. Please try again.");
      console.error("PDF processing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="pdf-upload"
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
            ${
              isLoading
                ? "bg-gray-50 border-gray-300"
                : "hover:bg-gray-50 border-gray-300 hover:border-gray-400"
            }
          `}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isLoading ? (
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
            ) : (
              <>
                <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">PDF files only</p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center justify-between">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-800 hover:text-red-900"
          >
            <FiX />
          </button>
        </div>
      )}
    </div>
  );
}
