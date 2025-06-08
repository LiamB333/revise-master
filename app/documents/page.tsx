"use client";

import { useDocuments } from "../contexts/DocumentContext";
import { FiFile, FiTrash2, FiBookOpen } from "react-icons/fi";
import Link from "next/link";

export default function DocumentsPage() {
  const { documents, deleteDocument } = useDocuments();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              My Documents
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your uploaded documents
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload New Document
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
            <div className="flex flex-col items-center">
              <FiFile className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No documents yet
              </h3>
              <p className="text-gray-500">
                Upload your first document to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <li key={doc.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0 flex-1">
                      <FiFile className="w-5 h-5 text-gray-400 mr-3" />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded{" "}
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/flashcards?document=${doc.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600"
                        title="Study with flashcards"
                      >
                        <FiBookOpen className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                        title="Delete document"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
