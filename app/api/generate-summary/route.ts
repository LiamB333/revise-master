import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const prompt = `
      Create a comprehensive summary of the following text. The summary should:
      1. Start with a brief overview
      2. Include main key points in bullet points
      3. Highlight important concepts or terms
      4. End with a brief conclusion
      
      Format the response in markdown.

      Text to summarize:
      ${text}
    `;

    const { text: generatedText } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: prompt,
    });

    return NextResponse.json({ summary: generatedText });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
