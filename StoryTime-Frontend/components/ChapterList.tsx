// ChapterList.tsx - Mobile Responsive Version
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Heart, Edit, Clock, User, Eye, ArrowRight } from "lucide-react";
import { MdAutoStories } from "react-icons/md";
import { updateChapterLikes } from "@/api/storyApi";
import { motion, AnimatePresence } from "framer-motion";
import type { User } from "@/types";

export default function ChapterList({
  title,
  chapters: initialChapters,
  id,
  onEditChapter,
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
  onEditChapter: (chapterIndex: number) => void;
}) {
  const router = useRouter();
  const [chapters, setChapters] = useState(initialChapters);
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null);

  const handleNavRead = (chapterIndex: number) => {
    router.push(`/read?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&chapId=${encodeURIComponent(chapterIndex)}`);
  };

  const handleToggleLike = async (chapterIndex: number) => {
    const currentChapter = chapters[chapterIndex];
    if (!currentChapter) return;

    const newLikedStatus = !currentChapter.liked;
    const newLikesCount = newLikedStatus ? currentChapter.likes + 1 : currentChapter.likes - 1;

    const updatedChapters = chapters.map((ch, idx) => {
      if (idx === chapterIndex) {
        return {
          ...ch,
          likes: newLikesCount,
          liked: newLikedStatus,
        };
      }
      return ch;
    });
    setChapters(updatedChapters);

    try {
      await updateChapterLikes(id, chapterIndex, newLikedStatus);
    } catch (err) {
      console.error("Failed to update likes:", err);
      setChapters(chapters);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Header - Mobile Responsive */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 px-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-3 rounded-full">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent text-center">
            Story Chapters
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base px-4">
          Explore each chapter of "{title}" and dive into the story
        </p>
      </motion.div>

      {/* Chapters Grid - Mobile Responsive */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 px-4"
      >
        {chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            variants={itemVariants}
            onHoverStart={() => setHoveredChapter(index)}
            onHoverEnd={() => setHoveredChapter(null)}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group relative cursor-pointer"
            onClick={() => handleNavRead(index)}
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-gray-700/10"></div>
                <svg className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24" viewBox="0 0 100 100">
                  <path d="M20,20 Q50,5 80,20 Q95,50 80,80 Q50,95 20,80 Q5,50 20,20" 
                        fill="currentColor" className="text-gray-200" />
                </svg>
              </div>

              <div className="relative p-4 sm:p-6">
                {/* Mobile Layout: Stack vertically */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  {/* Top/Left: Chapter Number & Title */}
                  <div className="flex items-start gap-4 w-full sm:flex-1">
                    {/* Chapter Number Circle */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <div className="text-center">
                            <div className="text-white font-bold text-sm sm:text-lg leading-none">
                              {index + 1}
                            </div>
                            <div className="text-gray-300 text-xs font-medium">
                              CH
                            </div>
                          </div>
                        </div>
                        
                        {/* Floating Book Icon */}
                        <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                          <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" />
                        </div>
                      </div>
                    </div>

                    {/* Chapter Content */}
                    <div className="flex-1 min-w-0">
                      {/* Chapter Title */}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors leading-tight pr-2">
                          {chapter.title}
                        </h3>
                        <motion.div
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ 
                            opacity: hoveredChapter === index ? 1 : 0,
                            x: hoveredChapter === index ? 0 : 10
                          }}
                          className="hidden sm:flex items-center gap-1 text-gray-500 flex-shrink-0"
                        >
                          <span className="text-sm font-medium">Read</span>
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      </div>

                      {/* Author Info - Mobile Responsive */}
                      <div className="flex flex-wrap items-center gap-2 mb-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="text-gray-600 font-medium truncate max-w-[120px] sm:max-w-none">
                            {typeof chapter.createdBy === "string" ? chapter.createdBy : chapter.createdBy.name}
                          </span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                          <span className="text-gray-500">
                            {new Date(chapter.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Summary Preview - Hide on very small screens */}
                      {chapter.summary && (
                        <p className="hidden sm:block text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                          {chapter.summary}
                        </p>
                      )}

                      {/* Chapter Stats - Mobile Responsive */}
                      <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MdAutoStories className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{chapter.content?.split(' ').length || 0} words</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Ch. {index + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom/Right: Action Buttons - Mobile Responsive */}
                  <div className="flex items-center justify-between w-full sm:w-auto sm:flex-col sm:gap-2">
                    {/* Mobile: Show read button */}
                    <button 
                      onClick={() => handleNavRead(index)}
                      className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-600 text-white text-sm font-medium"
                    >
                      <BookOpen className="w-4 h-4" />
                      Read
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Like Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLike(index);
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-200 z-10"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors duration-300 ${
                            chapter.liked ? "text-red-500 fill-red-500" : "text-gray-500"
                          }`}
                        />
                        <span className="text-sm font-medium text-gray-700">{chapter.likes}</span>
                      </motion.button>

                      {/* Edit Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditChapter(index);
                        }}
                        className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                        title="Edit Chapter"
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Hover Summary Expansion - Desktop Only */}
                <AnimatePresence>
                  {hoveredChapter === index && chapter.content && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="hidden sm:block mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                    >
                      <p className="text-sm text-gray-600 italic leading-relaxed">
                        "{chapter.content.substring(0, 150)}..."
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-600/5 to-gray-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Footer - Mobile Responsive */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center px-4"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg">
          <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:justify-center sm:gap-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-700">{chapters.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-800">
                {chapters.reduce((acc, chapter) => acc + (chapter.content?.split(' ').length || 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {chapters.reduce((acc, chapter) => acc + chapter.likes, 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Likes</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}