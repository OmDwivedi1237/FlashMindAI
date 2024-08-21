import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAI({ apiKey });

const parseFlashcards = (text: string | null) => {
  if (!text) return [];

  return text.split('\n').filter(line => line.trim() !== '').map((card, index) => {
    const [front, back] = card.split('|').map(part => part.trim());
    return {
      front: front || `Front ${index + 1}`,
      back: back || `Back ${index + 1}`
    };
  });
};

export async function POST(req: NextRequest) {
    try {
      const { text } = await req.json();
  
      if (!text || typeof text !== 'string') {
        console.error("Invalid input text:", text);
        return NextResponse.json({ error: "Invalid input text" }, { status: 400 });
      }
  
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a Flash Card maker that analyzes text and converts it into flashcards. Each flashcard should feature a clear question or key term on one side and a concise answer or explanation on the other. Ensure the flashcards cover the essential information from the input text. Your output should be labeled Front: The question, term, or prompt. Back: The answer, definition, or explanation. Separate each flashcard with a newline and use '|' to separate the front and back."
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      const flashcardsText = response.choices[0]?.message?.content || "";
      console.log("Received flashcards text:", flashcardsText);
      const flashcards = parseFlashcards(flashcardsText);
  
      return NextResponse.json(flashcards);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
    }
  }
