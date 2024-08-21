"use client"

import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";

// Define the type for flashcards
interface Flashcard {
  front: string;
  back: string;
}

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<Set<number>>(new Set());
  const [inputText, setInputText] = useState<string>("");

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (inputText.trim() === "") {
        console.error("Input text is empty. Please provide some text.");
        return;
      }

      try {
        const response = await fetch("/api/ai-flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: inputText }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch flashcards: ${errorText}`);
        }

        const data = await response.json();
        console.log("Fetched flashcards:", data);
        setFlashcards(data);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      }
    };

    fetchFlashcards();
  }, [inputText]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Trigger useEffect to fetch flashcards based on the new input text
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-neutral-700 dark:text-neutral-300 mb-8">
        Flashcards
      </h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text for flashcards"
          className="p-2 border border-gray-300 rounded-lg"
        />
        <button type="submit" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
          Generate Flashcards
        </button>
      </form>
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
              <div className="card front" style={{ padding: '20px', backgroundColor: '#000', color: '#fff', border: '1px solid #ddd' }}>
                <h2>{card.front}</h2>
                <button onClick={() => handleFlip(index)}>Flip</button>
              </div>

              <div className="card back" style={{ padding: '20px', backgroundColor: '#000', color: '#fff', border: '1px solid #ddd' }}>
                <h2>{card.back}</h2>
                <button onClick={() => handleFlip(index)}>Flip</button>
              </div>
            </ReactCardFlip>
          ))}
        </div>
      ) : (
        <p>No flashcards available. Please enter text and submit.</p>
      )}
    </div>
  );
};

export default FlashcardPage;
