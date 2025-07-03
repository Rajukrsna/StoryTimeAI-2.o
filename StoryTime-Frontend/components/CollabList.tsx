// CollabList.tsx
"use client";

import { useEffect, useState } from "react";
import { getStory } from "@/api/storyApi";
import { CardHorizontal } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import type { Story } from "@/types";

export default function CollabList({ id }: { id: string }) {
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    if (!id) return;

    const getCollabs = async () => {
      try {
        const response = await getStory(id);
        setStory(response);
      } catch (err) {
        console.error("Failed to fetch story", err);
      }
    };

    getCollabs();
  }, [id]);

  if (!story) return <p>Loading...</p>;

  return (
    <div className="grid gap-6">
      {story.content.map((content) => (
        <CardHorizontal
          key={content._id}
          className="p-4 flex items-center justify-between gap-4 cursor-pointer rounded-xl border hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white group"
        >
          {/* Left Icon Avatar */}
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-sm group-hover:bg-blue-200 transition">
            <Pencil className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          </div>

          {/* Main Content */}
          <div className="flex-1 px-2">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FaUserCircle className="text-gray-500" />
              {typeof content.createdBy === "object" && content.createdBy?.name}
            </h2>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <MdCalendarToday className="text-gray-400" />
              Contributed on <span className="font-medium ml-1">{content.title}</span>
            </p>
          </div>
        </CardHorizontal>
      ))}
    </div>
  );
}
