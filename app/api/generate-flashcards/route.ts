import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
      Create flashcards from the following text. Format the output as a JSON array of objects, 
      where each object has a "front" and "back" property. The front should be a question or concept, 
      and the back should be the answer or explanation. Make the flashcards concise but comprehensive.
      Only return the JSON array, nothing else.

      Text to process:
      ${text}
    `;

    const { text: generatedText } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompt,
    });

    // Parse the response as JSON
    const flashcards = JSON.parse(generatedText);

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
