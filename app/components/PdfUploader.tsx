"use client";

import { useState, useRef, useEffect } from "react";
import type {
  TextItem,
  TextMarkedContent,
} from "pdfjs-dist/types/src/display/api";
import * as PDFJS from "pdfjs-dist";

// Initialize pdfjsLib outside component to ensure it's available
let pdfjsLib: typeof PDFJS;

interface PdfUploaderProps {
  onTextExtracted?: (text: string) => void;
}

export default function PdfUploader({ onTextExtracted }: PdfUploaderProps) {
  const [pdfText, setPdfText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializePdfJs = async () => {
      try {
        // Import the main library
        const pdfjs = await import("pdfjs-dist");
        // Set the worker source
        pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
        // Store the library instance
        pdfjsLib = pdfjs;
        setIsInitialized(true);
      } catch (error) {
        console.error("Failed to initialize PDF.js:", error);
        setPdfText(
          "Failed to initialize PDF reader. Please try refreshing the page."
        );
      }
    };

    if (!isInitialized) {
      initializePdfJs();
    }
  }, [isInitialized]);

  const extractTextFromPdf = async (file: File) => {
    if (!isInitialized || !pdfjsLib) {
      setPdfText("PDF.js is still initializing. Please try again in a moment.");
      return;
    }

    try {
      setIsLoading(true);

      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load the PDF document using the initialized library
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      // Extract text from all pages
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: TextItem | TextMarkedContent) =>
            "str" in item ? item.str : ""
          )
          .join(" ");
        fullText += pageText + "\n\n";
      }

      const trimmedText = fullText.trim();
      setPdfText(trimmedText);
      onTextExtracted?.(trimmedText);
    } catch (error) {
      console.error("Error extracting text:", error);
      setPdfText("Error extracting text from PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      extractTextFromPdf(file);
    } else {
      setPdfText("Please select a valid PDF file");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <label htmlFor="pdf-upload" className="block text-lg font-medium mb-4">
          Upload PDF
        </label>
        <input
          ref={fileInputRef}
          id="pdf-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={!isInitialized}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {!isInitialized && (
          <p className="mt-2 text-sm text-gray-500">
            Initializing PDF reader...
          </p>
        )}
      </div>

      {isLoading && (
        <div className="my-4 text-gray-600">Extracting text from PDF...</div>
      )}

      {pdfText && !isLoading && (
        <div className="mt-6">
          <h2 className="text-lg font-medium mb-3">Extracted Text:</h2>
          <div className="p-4 bg-gray-50 text-black rounded-lg whitespace-pre-wrap">
            {pdfText}
          </div>
        </div>
      )}
    </div>
  );
}
