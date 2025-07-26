// CollabList.tsx - Mobile Responsive Version
"use client";

import { useEffect, useState } from "react";
import { getStory } from "@/api/storyApi";
import { Pencil, BookOpen, Clock, Users, Eye } from "lucide-react";
import { FaQuoteLeft } from "react-icons/fa";
import { MdCalendarToday, MdAutoStories } from "react-icons/md";
import type { Story } from "@/types";
import { motion } from "framer-motion";

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

  if (!story) {
    return (
      <div className="flex items-center justify-center min-h-[300px] px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-base sm:text-lg">Loading collaborations...</p>
        </div>
      </div>
    );
  }

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
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 overflow-hidden">
      {/* Header Section - Mobile Responsive */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8 px-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-2.5 sm:p-3 rounded-full">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent text-center">
            Story Collaborators
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
          Discover the talented writers who contributed to {story.title} and explore their creative chapters
        </p>
      </motion.div>

      {/* Collaboration Grid - Mobile Responsive */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-6 px-4"
      >
        {story.content.map((content, index) => (
          <motion.div
            key={content._id}
            variants={itemVariants}
            transition={{ 
              duration: 0.4,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              {/* Background Pattern - Responsive */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-gray-700/10"></div>
                <svg className="absolute bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="currentColor" className="text-gray-200" />
                </svg>
              </div>

              <div className="relative p-4 sm:p-6">
                {/* Mobile: Stack vertically, Desktop: Side by side */}
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  
                  {/* Top/Left: Author Avatar & Info Combined on Mobile */}
                  <div className="flex items-start gap-4 w-full sm:w-auto">
                    {/* Avatar & Badge */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        {/* Main Avatar - Responsive sizes */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 p-0.5 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                              <Pencil className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
                            </div>
                          </div>
                        </div>
                        
                        {/* Chapter Number Badge - Responsive */}
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-xs sm:text-sm">{index + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Author Name & Chapter Title - Mobile Layout */}
                    <div className="flex-1 min-w-0 sm:hidden">
                      {/* Author Name */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                          {typeof content.createdBy === "object" && content.createdBy?.name || "Anonymous Writer"}
                        </h3>
                        <div className="px-2 py-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs font-semibold w-fit">
                          Collaborator
                        </div>
                      </div>

                      {/* Chapter Title */}
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-gray-700 group-hover:text-gray-800 transition-colors text-sm truncate">
                            {content.title}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center: Content - Desktop Only */}
                  <div className="hidden sm:block flex-1 min-w-0">
                    {/* Author Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                        {typeof content.createdBy === "object" && content.createdBy?.name || "Anonymous Writer"}
                      </h3>
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-800 text-white text-xs font-semibold">
                        Collaborator
                      </div>
                    </div>

                    {/* Chapter Title */}
                    <div className="flex items-start gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-gray-700 group-hover:text-gray-800 transition-colors">
                          {content.title}
                        </h4>
                        {content.content && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {content.content.substring(0, 120)}...
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata - Desktop */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Chapter {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdAutoStories className="w-4 h-4" />
                        <span>{content.content?.split(' ').length || 0} words</span>
                      </div>
                      {content.createdAt && (
                        <div className="flex items-center gap-2">
                          <MdCalendarToday className="w-4 h-4" />
                          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom/Right: Action Button & Mobile Metadata */}
                  <div className="w-full sm:w-auto flex flex-col gap-4">
                    {/* Mobile Metadata */}
                    <div className="sm:hidden flex items-center gap-4 text-xs text-gray-500 overflow-x-auto">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span>Ch. {index + 1}</span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <MdAutoStories className="w-3 h-3" />
                        <span>{content.content?.split(' ').length || 0} words</span>
                      </div>
                      {content.createdAt && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <MdCalendarToday className="w-3 h-3" />
                          <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Read Button - Responsive */}
                    <div className="flex justify-end">
                      <button className="group/btn relative px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-700 hover:to-gray-900 transition-all duration-300 hover:scale-105 shadow-lg">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 transition-colors" />
                          <span className="font-medium transition-colors text-sm sm:text-base">
                            Read
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quote Preview - Desktop Only */}
                {content.content && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    whileHover={{ opacity: 1, height: "auto" }}
                    className="hidden sm:block mt-4 pt-4 border-t border-gray-200 overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <FaQuoteLeft className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                      <p className="text-sm text-gray-600 italic leading-relaxed">
                        {content.content.substring(0, 200)}...
                      </p>
                    </div>
                  </motion.div>
                )}
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
        className="mt-8 sm:mt-12 text-center px-4"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 sm:p-8 border border-white/30 shadow-lg">
          {/* Mobile: Grid, Desktop: Flex */}
          <div className="grid grid-cols-3 gap-4 sm:flex sm:items-center sm:justify-center sm:gap-8">
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-gray-700">{story.content.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Chapters</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-gray-800">
                {story.content.reduce((acc, chapter) => acc + (chapter.content?.split(' ').length || 0), 0)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-3xl font-bold text-gray-900">
                {new Set(story.content.map(c => typeof c.createdBy === "object" ? c.createdBy?._id : c.createdBy)).size}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Contributors</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}