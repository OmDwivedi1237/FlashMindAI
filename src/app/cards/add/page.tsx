// page.tsx (Updated /cards/add)
"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { FileUpload } from "@/components/ui/file-upload";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function Page() {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const router = useRouter();

  const handleFileChange = async (files: File[]) => {
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
      };
      reader.readAsText(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const dataToSend = fileContent || inputText;

    if (dataToSend) {
      try {
        const response = await fetch("/api/ai-flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: dataToSend }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to generate flashcards: ${errorText}`);
        }

        // Redirect to /cards
        router.push('/cards');
      } catch (error) {
        console.error("Error generating flashcards:", error);
      }
    } else {
      console.error("No data to send");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 p-8 flex flex-col items-center justify-center">
      <FileUpload onChange={handleFileChange} />
      <h2 className="text-4xl font-bold text-neutral-700 dark:text-neutral-300 mt-12 mb-8">
        Or type instead
      </h2>
      <form onSubmit={handleFormSubmit} className="flex flex-col items-center space-y-4">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type or paste text here"
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md h-40 text-black"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
          Generate Flashcards
        </button>
      </form>
    </div>
  );
}
