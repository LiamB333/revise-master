import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
      Create a quiz based on the following text. Generate 5 multiple-choice questions.
      Format the output as a JSON array of objects with the following structure:
      {
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": "The correct option text",
        "explanation": "Brief explanation of why this is the correct answer"
      }

      Only return the JSON array, nothing else.

      Text to create quiz from:
      ${text}
    `;

    const { text: generatedText } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompt,
    });

    // Parse the response as JSON
    const quiz = JSON.parse(generatedText);

    return NextResponse.json({ quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz" },
      { status: 500 }
    );
  }
}
