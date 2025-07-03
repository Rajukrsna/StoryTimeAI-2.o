// components/AiPageClient.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { createAIStory } from "@/api/aiApi";
import { createStory } from "@/api/storyApi";
import { FaMagic, FaStop, FaUpload } from "react-icons/fa";
import { toast } from "sonner";
import getEmbeddings from "@/components/hooks/useEmbeddings";
import { Navbar } from "@/components/Navbar";

export default function AiPageClient() {
  const searchParams = useSearchParams();
  const initialStory = searchParams.get("story") || "";
  const initialSummary = searchParams.get("summary") || "";
  const title = searchParams.get("title") || "No title provided.";
  const imageUrl = searchParams.get("imageUrl") || "No image provided.";

  const [story, setStory] = useState(initialStory);
  const [displayedStory, setDisplayedStory] = useState(initialStory);
  const [isTyping, setIsTyping] = useState(false);
  const [summary, setSummary] = useState(initialSummary);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const router = useRouter();
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!story || isUserEditing) return;

    let index = 0;
    setDisplayedStory("");
    setIsTyping(true);

    typingIntervalRef.current = setInterval(() => {
      setDisplayedStory((prev) => prev + story[index]);
      index++;
      if (index === story.length) {
        clearInterval(typingIntervalRef.current as NodeJS.Timeout);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(typingIntervalRef.current as NodeJS.Timeout);
  }, [story, isUserEditing]);

  const handleRegenerate = async () => {
    setIsTyping(true);
    setIsUserEditing(false);
    const response = await createAIStory(title, story);
    if (response) {
      setStory(response.suggestion);
      setSummary(response.summary);
    } else {
      alert("AI editing failed.");
      setIsTyping(false);
    }
  };

  const handleStopTyping = () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      setIsTyping(false);
    }
  };

  const handlePublish = async () => {
    try {
      const embeds = await getEmbeddings(summary);
      const response = await createStory(title, story, imageUrl, summary, embeds);
      if (response) {
        toast.success("🎉 Story published successfully!");
        router.push("/homepage");
      } else {
        toast.warning("⚠️ No response from the backend.");
      }
    } catch (error) {
      console.error("Publishing failed:", error);
      toast.error("❌ Publishing failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#fdfdfd] px-6 py-12 max-w-5xl mx-auto text-gray-900 font-sans">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
            ✨ AI-Generated Story
          </h1>
          <p className="text-gray-600 text-sm">
            Feel free to edit or regenerate your story using AI.
          </p>
        </div>

        <textarea
          className="w-full h-72 sm:h-80 md:h-96 text-lg p-6 border border-gray-300 rounded-xl bg-white shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/30 transition"
          value={displayedStory}
          onChange={(e) => {
            handleStopTyping();
            setDisplayedStory(e.target.value);
            setStory(e.target.value);
            setIsUserEditing(true);
          }}
          placeholder="Your story appears here..."
        />

        <div className="flex flex-wrap gap-4 mt-6">
          <Button
            onClick={handleRegenerate}
            disabled={isTyping}
            className="px-6 py-2 text-base flex items-center gap-2"
          >
            <FaMagic className="text-lg" />
            {isTyping ? "Generating..." : "Regenerate with AI"}
          </Button>

          {isTyping && (
            <Button
              variant="destructive"
              onClick={handleStopTyping}
              className="px-6 py-2 text-base flex items-center gap-2"
            >
              <FaStop className="text-lg" />
              Stop Typing
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handlePublish}
            className="px-6 py-2 text-base flex items-center gap-2"
          >
            <FaUpload className="text-lg" />
            Publish
          </Button>
        </div>
      </main>
    </>
  );
}
