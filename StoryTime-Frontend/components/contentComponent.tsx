// StoryTime-Frontend/components/contentComponent.tsx
"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MdCreate } from "react-icons/md";
import { Filter } from "lucide-react";
import { FaBookOpen, FaUsers, FaRankingStar } from "react-icons/fa6";
import { HiOutlineSearch } from "react-icons/hi";
import ChapterList from "./ChapterList";
import CollabList from "./CollabList";
import LeaderboardList from "./Leaderboard";
import type { Chapter } from "@/types";
type TabType = "read" | "collab" | "leaderboard";

export default function ContentComponent({
  id,
  story,
  title,
}: {
  id: string;
  story: Chapter[];
  title: string;
}) {
  const [activeTab, setActiveTab] = useState<"read" | "collab" | "leaderboard">("read");
  const router = useRouter();
  const chapters = story.map((chapter, index) => ({
    id: index, // Use index as a temporary ID for client-side mapping
    title: chapter.title,
    content: chapter.content,
    createdBy: chapter.createdBy,
    createdAt: chapter.createdAt,
    summary: chapter.summary || "No summary available",
    likes: chapter.likes,
    liked: false,
  }));

  const handleNavCollab = () => {
    router.push(`/collab?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`);
  };

  const handleEditChapter = (chapterIndex: number) => {
    // Navigate to the collab page with parameters to indicate editing an existing chapter
    router.push(`/collab?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&editChapterIndex=${chapterIndex}`);
  };

  return (
    <main className="min-h-screen px-6 py-6 bg-white font-sans">
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Contents <span className="text-primary text-2xl">•</span>
          </h1>
          <ToggleGroup
            type="single"
            value={activeTab} 
            onValueChange={(value: string | null) => {
              if (value) {
                setActiveTab(value as TabType);
              }
            }}
             className="flex gap-2"
          >
            <ToggleGroupItem value="read" className="flex items-center gap-2">
              <FaBookOpen /> Read
            </ToggleGroupItem>
            <ToggleGroupItem value="collab" className="flex items-center gap-2">
              <FaUsers /> Collab
            </ToggleGroupItem>
            <ToggleGroupItem value="leaderboard" className="flex items-center gap-2">
              <FaRankingStar /> Leaderboard
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Input placeholder="Search" className="pl-10" />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button variant="outline" size="icon" className="hover:bg-gray-100">
            <Filter size={18} />
          </Button>
          {activeTab === "collab" && (
            <Button onClick={handleNavCollab} className="flex items-center gap-2 bg-primary text-white">
              <MdCreate size={18} />
              Create Chapter
            </Button>
          )}
        </div>
      </nav>

      <section className="mt-8">
        <Suspense fallback={<div>Loading Chapters...</div>}>
          {activeTab === "read" && <ChapterList title={title} chapters={chapters} id={id} onEditChapter={handleEditChapter} />}
        </Suspense>

        <Suspense fallback={<div>Loading Collaboration...</div>}>
          {activeTab === "collab" && <CollabList id={id} />}
        </Suspense>

        <Suspense fallback={<div>Loading Leaderboard...</div>}>
          {activeTab === "leaderboard" && <LeaderboardList title={title} />}
        </Suspense>
      </section>
    </main>
  );
}
