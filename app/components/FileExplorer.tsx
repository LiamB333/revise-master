"use client";

import { useState } from "react";
import {
  FiFolder,
  FiFile,
  FiChevronRight,
  FiChevronDown,
  FiPlus,
  FiTag,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { useDocuments } from "../contexts/DocumentContext";

interface Document {
  id: string;
  name: string;
  type: "pdf";
  tags: string[];
  createdAt: Date;
  folderId: string | null;
}

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface FileExplorerProps {
  onDocumentSelect: (documentId: string) => void;
}

export default function FileExplorer({ onDocumentSelect }: FileExplorerProps) {
  const {
    documents,
    folders,
    addFolder,
    deleteDocument,
    deleteFolder,
    moveDocument,
    moveFolder,
    addTagToDocument,
    removeTagFromDocument,
  } = useDocuments();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["1"])
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{
    type: "document" | "folder";
    id: string;
  } | null>(null);

  const allTags = Array.from(
    new Set(documents.flatMap((doc) => doc.tags))
  ).sort();

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        parentId: null,
      };
      addFolder(newFolder);
      setNewFolderName("");
      setShowNewFolderInput(false);
    }
  };

  const toggleTag = (tag: string) => {
    const newSelectedTags = new Set(selectedTags);
    if (newSelectedTags.has(tag)) {
      newSelectedTags.delete(tag);
    } else {
      newSelectedTags.add(tag);
    }
    setSelectedTags(newSelectedTags);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.size === 0 || doc.tags.some((tag) => selectedTags.has(tag));
    return matchesSearch && matchesTags;
  });

  const handleDragStart = (
    e: React.DragEvent,
    type: "document" | "folder",
    id: string
  ) => {
    setDraggedItem({ type, id });
    e.dataTransfer.setData("text/plain", JSON.stringify({ type, id }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { type, id } = draggedItem;

    if (type === "document") {
      moveDocument(id, targetFolderId);
    } else if (type === "folder" && id !== targetFolderId) {
      moveFolder(id, targetFolderId);
    }

    setDraggedItem(null);
  };

  const renderFolder = (folder: Folder) => {
    const isExpanded = expandedFolders.has(folder.id);
    const childFolders = folders.filter((f) => f.parentId === folder.id);
    const folderDocuments = documents.filter((d) => d.folderId === folder.id);

    return (
      <div
        key={folder.id}
        className="ml-4"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, folder.id)}
      >
        <div
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer text-black"
          onClick={() => toggleFolder(folder.id)}
          draggable
          onDragStart={(e) => handleDragStart(e, "folder", folder.id)}
        >
          {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
          <FiFolder className="text-blue-500" />
          <span>{folder.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteFolder(folder.id);
            }}
            className="ml-auto text-gray-500 hover:text-red-500"
          >
            <FiTrash2 size={16} />
          </button>
        </div>

        {isExpanded && (
          <div className="ml-4">
            {childFolders.map((childFolder) => renderFolder(childFolder))}
            {folderDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded ml-6 text-black cursor-pointer"
                draggable
                onDragStart={(e) => handleDragStart(e, "document", doc.id)}
                onClick={() => onDocumentSelect(doc.id)}
              >
                <FiFile />
                <span>{doc.name}</span>
                <div className="flex gap-1 ml-2">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTagFromDocument(doc.id, tag);
                        }}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDocument(doc.id);
                  }}
                  className="ml-auto text-gray-500 hover:text-red-500"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Left sidebar - Folder structure */}
      <div
        className="w-1/4 border-r p-4 overflow-y-auto"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, null)}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-black">Folders</h3>
          <button
            onClick={() => setShowNewFolderInput(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FiPlus />
          </button>
        </div>

        {showNewFolderInput && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-2 py-1 border rounded text-black"
            />
            <button
              onClick={handleCreateFolder}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        )}

        {folders
          .filter((folder) => folder.parentId === null)
          .map((folder) => renderFolder(folder))}
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Search and filter */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded text-black"
              />
            </div>
          </div>

          {/* Tags filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  selectedTags.has(tag)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <FiTag size={12} />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Document list */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow text-black cursor-pointer"
              draggable
              onDragStart={(e) => handleDragStart(e, "document", doc.id)}
              onClick={() => onDocumentSelect(doc.id)}
            >
              <div className="flex items-center gap-2">
                <FiFile className="text-blue-500" />
                <span className="font-medium">{doc.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDocument(doc.id);
                  }}
                  className="ml-auto text-gray-500 hover:text-red-500"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTagFromDocument(doc.id, tag);
                      }}
                      className="hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Added {doc.createdAt.toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
