"use client";

import { useState } from "react";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardsProps {
  cards: Flashcard[];
}

export default function Flashcards({ cards }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (cards.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No flashcards available. Upload a PDF to generate flashcards.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 text-center text-sm text-gray-600">
        Card {currentIndex + 1} of {cards.length}
      </div>

      <div
        className="relative h-64 cursor-pointer perspective-1000"
        onClick={handleFlip}
      >
        <div
          className={`absolute w-full h-full transition-transform duration-500 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of card */}
          <div className="absolute w-full h-full bg-white text-black rounded-lg shadow-lg p-6 backface-hidden">
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-xl">{cards[currentIndex].front}</p>
            </div>
          </div>

          {/* Back of card */}
          <div className="absolute w-full h-full bg-blue-50 text-black rounded-lg shadow-lg p-6 rotate-y-180 backface-hidden">
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-xl">{cards[currentIndex].back}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
