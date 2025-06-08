"use client";

import { FiSearch, FiBookOpen } from "react-icons/fi";
import { useDocuments } from "../contexts/DocumentContext";

export default function Header() {
  const { documents } = useDocuments();

  const studiedToday = documents.filter((doc) => {
    const today = new Date();
    const docDate = new Date(doc.createdAt);
    return docDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
      <div className="flex items-center flex-1 max-w-2xl">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search your documents..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1.5 rounded-lg">
            <FiBookOpen className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-600">
              {studiedToday} studied today
            </span>
          </div>

          <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium text-sm">
            {documents.length}
          </div>
        </div>
      </div>
    </div>
  );
}
