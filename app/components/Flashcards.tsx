"use client";

import { useState, useEffect } from "react";
import { useDocuments } from "../contexts/DocumentContext";

interface FlashcardsProps {
  documentId: string | null;
}

interface Flashcard {
  front: string;
  back: string;
}

export default function Flashcards({ documentId }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { documents } = useDocuments();

  useEffect(() => {
    if (!documentId) return;

    const document = documents.find((doc) => doc.id === documentId);
    if (!document) return;

    const generateFlashcards = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/generate-flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: document.content }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate flashcards");
        }

        const data = await response.json();
        setFlashcards(data.flashcards);
      } catch (error) {
        console.error("Error generating flashcards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateFlashcards();
  }, [documentId, documents]);

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (!documentId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Please select a document to study</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No flashcards available</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-500">
          {currentIndex + 1} of {flashcards.length}
        </span>
        <button
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div 
        className="relative h-64 w-full"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          perspective: "1000px"
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transition: "transform 0.6s",
            transform: isFlipped ? "rotateY(180deg)" : "",
            position: "relative",
            width: "100%",
            height: "100%"
          }}
        >
          {/* Front of card */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
            }}
            className="flex items-center justify-center p-6 bg-white text-black rounded-lg shadow-lg border border-gray-200"
          >
            <p className="text-lg text-center">
              {flashcards[currentIndex].front}
            </p>
          </div>

          {/* Back of card */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="flex items-center justify-center p-6 bg-white text-black rounded-lg shadow-lg border border-gray-200"
          >
            <p className="text-lg text-center">
              {flashcards[currentIndex].back}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-center text-gray-500">
        Click the card to flip it
      </p>
    </div>
  );
}
