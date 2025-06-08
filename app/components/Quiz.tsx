"use client";

import { useState, useEffect } from "react";
import { useDocuments } from "../contexts/DocumentContext";

interface QuizProps {
  documentId: string | null;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function Quiz({ documentId }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { documents } = useDocuments();

  useEffect(() => {
    if (!documentId) return;

    const document = documents.find((doc) => doc.id === documentId);
    if (!document) return;

    const generateQuiz = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/generate-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: document.content }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate quiz");
        }

        const data = await response.json();
        setQuestions(data.quiz);
      } catch (error) {
        console.error("Error generating quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuiz();
  }, [documentId, documents]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
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

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No quiz questions available</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isQuizComplete = showExplanation && isLastQuestion;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <span className="text-sm text-gray-500">
          Score: {score} / {questions.length}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-black">
          {currentQuestion.question}
        </h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !selectedAnswer && handleAnswerSelect(option)}
              disabled={!!selectedAnswer}
              className={`
                w-full p-4 text-left rounded-lg border transition-colors
                ${
                  selectedAnswer
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : option === selectedAnswer
                      ? "bg-red-100 border-red-500"
                      : "bg-white border-gray-200"
                    : "hover:bg-gray-50 border-gray-200"
                }
              `}
            >
              <span className="text-black">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {showExplanation && (
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {isQuizComplete ? (
          <button
            onClick={handleRestartQuiz}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Restart Quiz
          </button>
        ) : (
          showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Next Question
            </button>
          )
        )}
      </div>
    </div>
  );
}
