"use client";

import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  isLoading: boolean;
}

export default function Quiz({ questions, isLoading }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (isLoading) {
    return <div className="text-center text-black">Generating quiz...</div>;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center text-black">
        No quiz available. Upload a PDF to generate a quiz.
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (quizSubmitted) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmit = () => {
    setQuizSubmitted(true);
    setShowExplanation(true);
  };

  const getScore = () => {
    return questions.reduce((score, question, index) => {
      return (
        score + (selectedAnswers[index] === question.correctAnswer ? 1 : 0)
      );
    }, 0);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 text-sm text-black">
        Question {currentQuestionIndex + 1} of {questions.length}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 text-black">{currentQuestion.question}</h3>
        <div className="space-y-2">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-3 rounded-lg border text-black ${
                selectedAnswers[currentQuestionIndex] === option
                  ? quizSubmitted
                    ? option === currentQuestion.correctAnswer
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                    : "bg-blue-100 border-blue-500"
                  : "border-gray-300 hover:border-blue-500"
              }`}
              disabled={quizSubmitted}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showExplanation && selectedAnswers[currentQuestionIndex] && (
        <div
          className={`p-4 rounded-lg mb-4 ${
            quizSubmitted &&
            selectedAnswers[currentQuestionIndex] ===
              currentQuestion.correctAnswer
              ? "bg-green-50 text-green-800"
              : "bg-blue-50 text-blue-800"
          }`}
        >
          <p className="font-medium mb-2">
            {quizSubmitted
              ? selectedAnswers[currentQuestionIndex] ===
                currentQuestion.correctAnswer
                ? "✅ Correct!"
                : `❌ Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`
              : "Explanation:"}
          </p>
          <p>{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {currentQuestionIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={quizSubmitted || selectedAnswers.includes("")}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        )}
      </div>

      {quizSubmitted && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Quiz Results</h3>
          <p className="text-black">
            You scored {getScore()} out of {questions.length} (
            {Math.round((getScore() / questions.length) * 100)}%)
          </p>
        </div>
      )}
    </div>
  );
}
