"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { DocumentProvider } from "./contexts/DocumentContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-white">
        <div className="w-64 bg-white border-r" />
        <div className="flex-1">
          <div className="h-16 border-b" />
          <main className="flex-1" />
        </div>
      </div>
    );
  }

  return (
    <DocumentProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </DocumentProvider>
  );
}
