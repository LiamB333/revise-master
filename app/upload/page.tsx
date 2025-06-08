"use client";

import PdfUploader from "../components/PdfUploader";

export default function UploadPage() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Upload Documents
        </h1>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <PdfUploader />
        </div>
      </div>
    </div>
  );
}
