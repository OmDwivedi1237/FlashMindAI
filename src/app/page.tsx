"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <HeroHighlight className="flex flex-col items-center justify-center">
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-8xl px-2 md:text-8xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto"
      >
        With FlashMind AI, no knowledge is lost. Every card
        is a{"\n"}
        <Highlight className="text-black dark:text-white">
          gateway to effortless recall.
        </Highlight>
      </motion.h1>
      <button className="shadow-[0_0_0_3px_#000000_inset] px-6 py-2 bg-transparent border border-black dark:border-white dark:text-white text-black rounded-lg font-bold transform hover:-translate-y-3 transition duration-400 mt-8">
        Get Started
      </button>
    </HeroHighlight>
  );
}
