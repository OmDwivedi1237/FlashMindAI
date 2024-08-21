import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/supabase"; // Import Supabase client

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAI({ apiKey });

const parseFlashcards = (text: string | null) => {
  if (!text) return [];

  const flashcards = text.split('\n\n').filter(card => card.trim() !== '');

  return flashcards.map(card => {
    const [frontPart, backPart] = card.split('Back:').map(part => part.trim());

    const front = frontPart.replace(/^Front:/, '').trim();
    const back = backPart?.trim() || '';

    return { front, back };
  });
};

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Invalid input text" }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a Flash Card maker that analyzes text and converts it into multiple flashcards. Each flashcard should feature a clear question or key term on one side and a concise answer or explanation on the other. Ensure the flashcards cover the essential information from the input text. Your output should be labeled Front: The question, term, or prompt. Back: The answer, definition, or explanation. Separate each flashcard with two newlines and use '|' to separate the front and back."
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const flashcardsText = response.choices[0]?.message?.content || "";
    const flashcards = parseFlashcards(flashcardsText);

    // Insert new flashcards
    const { data, error } = await supabase.from('flashcards').insert(flashcards);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Flashcards saved successfully", flashcards });
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
