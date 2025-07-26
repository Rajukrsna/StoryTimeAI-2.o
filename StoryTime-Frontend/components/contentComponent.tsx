// StoryTime-Frontend/components/contentComponent.tsx
"use client";
import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MdCreate } from "react-icons/md";
import { Filter } from "lucide-react";
import { FaBookOpen, FaUsers, FaRankingStar } from "react-icons/fa6";
import { HiOutlineSearch } from "react-icons/hi";
import ChapterList from "./ChapterList";
import CollabList from "./CollabList";
import LeaderboardList from "./Leaderboard";
import type { Chapter } from "@/types";
import { motion } from "framer-motion";

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
    id: index,
    title: chapter.title,
    content: chapter.content,
    createdBy: typeof chapter.createdBy === "string" ? chapter.createdBy : (chapter.createdBy?.name || "Unknown"),
    createdAt: chapter.createdAt,
    summary: chapter.summary || "No summary available",
    likes: chapter.likes,
    liked: false,
  }));

  const handleNavCollab = () => {
    router.push(`/collab?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`);
  };

  const handleEditChapter = (chapterIndex: number) => {
    router.push(`/collab?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&editChapterIndex=${chapterIndex}`);
  };

  const tabs = [
    { id: "read", label: "Read", icon: FaBookOpen },
    { id: "collab", label: "Collab", icon: FaUsers },
    { id: "leaderboard", label: "Leaderboard", icon: FaRankingStar },
  ];

  return (
    <main className="min-h-screen bg-transparent font-sans overflow-x-hidden">
      {/* Enhanced Header Section */}
      <div className="space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent flex items-center justify-center gap-2">
            Story Contents
          </h1>
          <p className="text-gray-600 mt-2">Explore chapters, collaborations, and rankings</p>
        </motion.div>

        {/* Mobile-First Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl p-4 shadow-lg"
        >
          {/* Custom Tab Buttons - Mobile Responsive */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Tab Buttons */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-2 bg-gray-100 p-1 rounded-xl">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`relative flex items-center justify-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        activeTab === tab.id
                          ? "bg-white text-gray-900 shadow-md"
                          : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="hidden sm:inline truncate">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Input 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 rounded-xl border-gray-300 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm"
                />
                <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>

              {/* Filter Button */}
              <Button 
                variant="outline" 
                size="sm"
                className="px-3 py-2 rounded-xl bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-gray-50 flex-shrink-0"
              >
                <Filter size={16} />
              </Button>

              {/* Create Chapter Button - Only show on collab tab */}
              {activeTab === "collab" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button 
                    onClick={handleNavCollab} 
                    className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-sm font-medium flex-shrink-0"
                  >
                    <MdCreate size={16} />
                    <span className="hidden sm:inline">Create</span>
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhanced Content Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8"
      >
        {/* Enhanced Loading States */}
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-60 text-gray-500 bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-4"></div>
                <FaBookOpen className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              </div>
              <p className="font-medium">Loading Chapters...</p>
            </div>
          }
        >
          {activeTab === "read" && (
            <ChapterList title={title} chapters={chapters} id={id} onEditChapter={handleEditChapter} />
          )}
        </Suspense>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-60 text-gray-500 bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <FaUsers className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
              </div>
              <p className="font-medium">Loading Collaboration...</p>
            </div>
          }
        >
          {activeTab === "collab" && <CollabList id={id} />}
        </Suspense>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center h-60 text-gray-500 bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mb-4"></div>
                <FaRankingStar className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-yellow-600" />
              </div>
              <p className="font-medium">Loading Leaderboard...</p>
            </div>
          }
        >
          {activeTab === "leaderboard" && <LeaderboardList id={id} title={title} />}
        </Suspense>
      </motion.section>
    </main>
  );
}