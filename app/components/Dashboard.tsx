"use client";

import { useState } from "react";
import PdfUploader from "./PdfUploader";
import Flashcards from "./Flashcards";
import Summary from "./Summary";
import Quiz from "./Quiz";

type Tab = "upload" | "flashcards" | "summary" | "quiz";

interface Flashcard {
  front: string;
  back: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("upload");
  const [extractedText, setExtractedText] = useState<string>("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summary, setSummary] = useState<string>("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isGeneratingFlashcards, setIsGeneratingFlashcards] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  const tabs = [
    { id: "upload" as Tab, name: "Upload PDF", icon: "📄" },
    { id: "flashcards" as Tab, name: "Flashcards", icon: "🎴" },
    { id: "summary" as Tab, name: "Summary", icon: "📝" },
    { id: "quiz" as Tab, name: "Quiz", icon: "❓" },
  ];

  const handleTextExtracted = async (text: string) => {
    setExtractedText(text);
    await Promise.all([
      generateFlashcards(text),
      generateSummary(text),
      generateQuiz(text),
    ]);
  };

  const generateFlashcards = async (text: string) => {
    setIsGeneratingFlashcards(true);
    try {
      const response = await fetch("/api/generate-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data.flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
    } finally {
      setIsGeneratingFlashcards(false);
    }
  };

  const generateSummary = async (text: string) => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const generateQuiz = async (text: string) => {
    setIsGeneratingQuiz(true);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const data = await response.json();
      setQuizQuestions(data.quiz);
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === "upload" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Your PDF</h2>
            <PdfUploader onTextExtracted={handleTextExtracted} />
          </div>
        )}

        {activeTab === "flashcards" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Flashcards</h2>
            <Flashcards cards={flashcards} />
          </div>
        )}

        {activeTab === "summary" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <Summary summary={summary} isLoading={isGeneratingSummary} />
          </div>
        )}

        {activeTab === "quiz" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Quiz</h2>
            <Quiz questions={quizQuestions} isLoading={isGeneratingQuiz} />
          </div>
        )}
      </div>
    </div>
  );
}
