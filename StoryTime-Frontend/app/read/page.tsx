"use client";

import { Navbar } from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStory } from "@/api/storyApi";
import ReactMarkdown from 'react-markdown';
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { MdMenuBook } from "react-icons/md";
import { motion } from "framer-motion";
import type { Story, User, Chapter,Author ,PendingChapter } from "@/types"; // Adjust the path as needed


export default function ReadPage() {
  const searchParams = useSearchParams();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const title = searchParams.get("title");
  const id = searchParams.get("id");
  const chapId = searchParams.get("chapId")
  console.log(chapId)
     useEffect(() => {
    if (!id || chapId === null) return;
  
          const fetchData = async () => {
              try {
                  const storyData = await getStory(id as string);
                  console.log(storyData)
                  const chapterIndex = parseInt(chapId);
                   // convert to number
                  setChapter(storyData.content[chapterIndex]);
              } catch (error) {
                  console.error("Error fetching story:", error);
              }
          };
  
          fetchData();
      }, [id,chapId]);
  const [isReading, setIsReading] = useState(false);

const handleReadOut = () => {
  if (!chapter?.content) return;

  if (isReading) {
    window.speechSynthesis.cancel();
    setIsReading(false);
  } else {
    const utterance = new SpeechSynthesisUtterance(chapter.content);
    utterance.rate = 1; // Adjust speed (0.1–10)
    utterance.pitch = 1; // Adjust pitch (0–2)
    utterance.lang = 'en-US';

    window.speechSynthesis.speak(utterance);
    setIsReading(true);

    utterance.onend = () => setIsReading(false);
  }
};


  return (
   <main
  className="min-h-screen bg-[#f9f9f6] text-gray-900 font-sans"
  style={{
    backgroundImage:
      "radial-gradient(circle at top left,rgb(211, 71, 71) 0%, #fdfdfd 60%)",
  }}
>
  <Navbar />

  {chapter ? (
    <section className="max-w-5xl mx-auto px-6 sm:px-10 py-12 relative z-10">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-snug text-black mb-2 flex items-center justify-center gap-2">
          <MdMenuBook className="text-4xl text-gray-700" />
          {title}
        </h1>
        <h2 className="text-2xl sm:text-3xl text-gray-700 font-medium">
          {chapter.title}
        </h2>

        {/* Read Out Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleReadOut}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold shadow hover:bg-gray-800 transition transform hover:scale-105"
          >
            {isReading ? <FaVolumeMute /> : <FaVolumeUp />}
            {isReading ? "Stop Reading" : "Read Out"}
          </button>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="h-1 w-24 mx-auto bg-gradient-to-r from-black via-gray-800 to-black rounded-full mb-10 animate-pulse" />

      {/* Story Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="max-h-[calc(100vh-20rem)] overflow-y-auto px-6 py-8 bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl transition-all duration-300"
      >
        <article className="prose prose-lg prose-gray max-w-none font-serif leading-relaxed tracking-wide">
          <ReactMarkdown>{chapter.content}</ReactMarkdown>
        </article>
      </motion.div>
    </section>
  ) : (
    <p className="text-center text-gray-500 text-lg mt-20">
      No chapter data available
    </p>
  )}
</main>
  );
}
