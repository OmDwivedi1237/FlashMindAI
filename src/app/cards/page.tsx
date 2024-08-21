// page.tsx
"use client";

import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";
import { supabase } from "@/supabase"; // Import Supabase client

interface Flashcard {
  front: string;
  back: string;
}

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const { data, error } = await supabase.from('flashcards').select('*');

        if (error) {
          throw error;
        }

        setFlashcards(data as Flashcard[]);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashcards();
  }, []);

  const handleFlip = (index: number) => {
    setFlippedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-neutral-700 dark:text-neutral-300 mb-8">
        Flashcards
      </h1>
      {flashcards.length > 0 ? (
        <div className="space-y-4">
          {flashcards.map((card, index) => (
            <ReactCardFlip
              key={index}
              isFlipped={flippedIndices.has(index)}
              flipDirection="horizontal"
              flipSpeedBackToFront={0.6}
              flipSpeedFrontToBack={0.6}
            >
              <div onClick={() => handleFlip(index)} className="card front" style={{ padding: '20px', backgroundColor: '#000', color: '#fff', border: '1px solid #ddd', cursor: 'pointer' }}>
                <h2>{card.front}</h2>
              </div>

              <div onClick={() => handleFlip(index)} className="card back" style={{ padding: '20px', backgroundColor: '#000', color: '#fff', border: '1px solid #ddd', cursor: 'pointer' }}>
                <h2>{card.back}</h2>
              </div>
            </ReactCardFlip>
          ))}
        </div>
      ) : (
        <p>No flashcards available.</p>
      )}
    </div>
  );
};

export default FlashcardPage;
