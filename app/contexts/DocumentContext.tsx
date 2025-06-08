"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Document {
  id: string;
  name: string;
  type: "pdf";
  tags: string[];
  createdAt: Date;
  folderId: string | null;
  content?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface DocumentContextType {
  documents: Document[];
  folders: Folder[];
  addDocument: (document: Document) => void;
  addFolder: (folder: Folder) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  deleteFolder: (id: string) => void;
  moveDocument: (documentId: string, newFolderId: string | null) => void;
  moveFolder: (folderId: string, newParentId: string | null) => void;
  addTagToDocument: (documentId: string, tag: string) => void;
  removeTagFromDocument: (documentId: string, tag: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedDocuments = localStorage.getItem("documents");
    const savedFolders = localStorage.getItem("folders");

    if (savedDocuments) {
      const parsedDocs = JSON.parse(savedDocuments);
      // Convert string dates back to Date objects
      setDocuments(
        parsedDocs.map((doc: any) => ({
          ...doc,
          createdAt: new Date(doc.createdAt),
        }))
      );
    }

    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [folders]);

  const addDocument = (document: Document) => {
    setDocuments((prev) => [...prev, document]);
  };

  const addFolder = (folder: Folder) => {
    setFolders((prev) => [...prev, folder]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === id ? { ...doc, ...updates } : doc))
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const deleteFolder = (id: string) => {
    // Delete the folder and all its subfolders
    const folderIdsToDelete = new Set<string>();

    const addFolderAndChildren = (folderId: string) => {
      folderIdsToDelete.add(folderId);
      folders
        .filter((f) => f.parentId === folderId)
        .forEach((child) => addFolderAndChildren(child.id));
    };

    addFolderAndChildren(id);

    setFolders((prev) => prev.filter((f) => !folderIdsToDelete.has(f.id)));

    // Move documents from deleted folders to root
    setDocuments((prev) =>
      prev.map((doc) =>
        folderIdsToDelete.has(doc.folderId || "")
          ? { ...doc, folderId: null }
          : doc
      )
    );
  };

  const moveDocument = (documentId: string, newFolderId: string | null) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, folderId: newFolderId } : doc
      )
    );
  };

  const moveFolder = (folderId: string, newParentId: string | null) => {
    // Prevent circular references
    if (newParentId) {
      let currentParent = folders.find((f) => f.id === newParentId);
      while (currentParent) {
        if (currentParent.id === folderId) {
          console.error("Circular reference detected");
          return;
        }
        currentParent = folders.find((f) => f.id === currentParent?.parentId);
      }
    }

    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, parentId: newParentId } : folder
      )
    );
  };

  const addTagToDocument = (documentId: string, tag: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId && !doc.tags.includes(tag)
          ? { ...doc, tags: [...doc.tags, tag] }
          : doc
      )
    );
  };

  const removeTagFromDocument = (documentId: string, tag: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId
          ? { ...doc, tags: doc.tags.filter((t) => t !== tag) }
          : doc
      )
    );
  };

  const value = {
    documents,
    folders,
    addDocument,
    addFolder,
    updateDocument,
    deleteDocument,
    deleteFolder,
    moveDocument,
    moveFolder,
    addTagToDocument,
    removeTagFromDocument,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
