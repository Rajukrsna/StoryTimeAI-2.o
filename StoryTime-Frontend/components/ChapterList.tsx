// StoryTime-Frontend/components/ChapterList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Heart, Edit } from "lucide-react"; // Import Edit icon
import { updateStory } from "@/api/storyApi"; // Ensure this import is correct
import { CardHorizontal } from "@/components/ui/card";
import type { User } from "@/types";

export default function ChapterList({
  title,
  chapters: initialChapters,
  id,
  onEditChapter, // New prop for editing
}: {
  title: string;
  chapters: {
    id: number;
    title: string;
    content: string;
    summary: string;
    createdBy: string | User;
    createdAt: string;
    likes: number;
    liked: boolean;
  }[];
  id: string;
  onEditChapter: (chapterIndex: number) => void; // New prop type
}) {
  const router = useRouter();
  const [chapters, setChapters] = useState(initialChapters);

  const handleNavRead = (chapId: number) => {
    router.push(`/read?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&chapId=${encodeURIComponent(chapId)}`);
  };

  const handleToggleLike = async (chapId: number) => {
    const updatedChapters = chapters.map((ch) => {
      if (ch.id === chapId) {
        return {
          ...ch,
          likes: ch.liked ? ch.likes - 1 : ch.likes + 1,
          liked: !ch.liked,
        };
      }
      return ch;
    });

    setChapters(updatedChapters);

    try {
      // CORRECTED CALL: Pass the story ID and a payload object with 'content'
      await updateStory(id, { content: updatedChapters });
    } catch (err) {
      console.error("Failed to update likes:", err);
    }
  };

  return (
    <div className="grid gap-6">
      {chapters.map((chapter, index) => ( // Use index for chapterIndex
        <CardHorizontal
          key={chapter.id}
          className="p-4 flex items-center justify-between rounded-xl border hover:shadow-md transition-all duration-300 group hover:-translate-y-[2px] cursor-pointer bg-white"
        >
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
            <BookOpen className="w-[50%] h-[50%] group-hover:scale-110 transition-transform" />
          </div>

          <div className="flex-1 px-4" onClick={() => handleNavRead(chapter.id)}> {/* Make this clickable for read */}
            <h2 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300">
              {chapter.title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Created By — {typeof chapter.createdBy === "string" ? chapter.createdBy : chapter.createdBy.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-500">{chapter.likes}</span>
            <Heart
              className={`w-5 h-5 transition-colors duration-300 ${
                chapter.liked ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-400"
              } hover:scale-110 active:scale-95`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                handleToggleLike(chapter.id);
              }}
            />
            {/* New Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click
                onEditChapter(index); // Pass the chapter index
              }}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              title="Edit Chapter"
            >
              <Edit className="w-5 h-5 text-gray-500 hover:text-blue-600" />
            </button>
          </div>
        </CardHorizontal>
      ))}
    </div>
  );
}
