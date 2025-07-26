// StoryTime-Frontend/app/book/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getStory } from "@/api/storyApi";
import ContentComponent from "@/components/contentComponent";
import { Navbar } from "@/components/Navbar";
import { ArrowBigDown, ArrowBigUp, BookOpen, Heart, Share2, Eye, Clock, Users, Calendar } from "lucide-react";
import type { Story , Author} from "@/types";
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { updateStoryVotes } from "@/api/storyApi";
import { motion, AnimatePresence } from "framer-motion";
export default function BookPage() {
  const params = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const id = params?.id as string;

  const handleUpdateStory = async (vote: number) => {
    if (!story) return;

    // Optimistic UI update
    setStory(prevStory => prevStory ? { ...prevStory, votes: prevStory.votes + vote } : null);
    
    try {
      await updateStoryVotes(id, vote);
    } catch (error) {
      console.error("Failed to update story votes:", error);
      // Revert optimistic update if API call fails
      setStory(prevStory => prevStory ? { ...prevStory, votes: prevStory.votes - vote } : null);
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareMenu(false);
    // You could add a toast notification here
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const storyData = await getStory(id as string);
        setStory(storyData);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };
    fetchData();
  }, [id]);

  if (!story) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
          <LoadingSpinner message="Loading story details..." />
        </div>
      </>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner message="Loading story details..." />}>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900">
        <Navbar />

        {/* Enhanced Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full min-h-[500px] flex items-end overflow-hidden"
        >
          {/* Background Image with Parallax Effect */}
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105"
            style={{
              backgroundImage: `url(${story.imageUrl})`,
              backgroundRepeat: "no-repeat",
            }}
          />
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

          {/* Floating Elements */}
          <div className="absolute top-6 right-6 z-20">
            <div className="flex items-center gap-3">
              {/* Like Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsLiked(!isLiked)}
                className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </motion.button>

              {/* Share Button */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>

                {/* Share Menu */}
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      className="absolute top-full right-0 mt-2 bg-white/90 backdrop-blur-md border border-white/30 rounded-2xl shadow-xl p-2 min-w-[120px]"
                    >
                      <button
                        onClick={copyToClipboard}
                        className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                      >
                        Copy Link
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Main Content Container */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-12">
            <div className="flex items-end gap-8">
              {/* Enhanced Vote Box */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-3 bg-white/90 backdrop-blur-md border border-white/30 px-4 py-6 rounded-3xl shadow-xl"
              >
                <motion.button
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleUpdateStory(1)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-2xl transition-all duration-200"
                >
                  <ArrowBigUp size={32} />
                </motion.button>
                
                <motion.span
                  key={story.votes}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-bold text-gray-800 px-2"
                >
                  {story.votes}
                </motion.span>
                
                <motion.button
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleUpdateStory(-1)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
                >
                  <ArrowBigDown size={32} />
                </motion.button>
              </motion.div>

              {/* Title and Metadata */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1"
              >
                {/* Story Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-2xl">
                  {story.title}
                </h1>

                {/* Author Info */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center">
                    {story.author && typeof story.author === 'object' && story.author.profileImage ? (
                      <img
                        src={story.author.profileImage}
                        alt="Author"
                        className="w-full h-full rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white font-bold">
                        {story.author && typeof story.author === 'object' 
                          ? story.author.name.charAt(0).toUpperCase()
                          : (story.author as string)?.charAt(0).toUpperCase() || 'U'
                        }
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white/90 text-lg font-medium">
                      by {story.author
                        ? typeof story.author === "string"
                          ? story.author
                          : story.author.name
                        : "Unknown"}
                    </p>
                    <p className="text-white/70 text-sm">Author</p>
                  </div>
                </div>

                {/* Story Statistics */}
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-2 text-white/80">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm font-medium">{story.content.length} Chapters</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">
                      {new Set(story.content.map(ch => 
                        typeof ch.createdBy === 'object' ? ch.createdBy._id : ch.createdBy
                      )).size} Contributors
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Eye className="w-5 h-5" />
                    <span className="text-sm font-medium">{story.votes} Votes</span>
                  </div>
                  {story.content[0].createdAt && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {new Date(story.content[0].createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent" />
        </motion.div>

      
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white/80 backdrop-blur-md border border-white/30 rounded-3xl shadow-2xl p-8 lg:p-12">
              {/* Story Description */}
              {/* {story.description && (
                <div className="mb-8 pb-8 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Story Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {story.description}
                  </p>
                </div>
              )} */}

              {/* Content Component */}
              <ContentComponent id={id} story={story.content} title={story.title} />
            </div>
          </div>
      

        {/* Floating Action Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 z-30"
        >
          <ArrowBigUp className="w-6 h-6" />
        </motion.button>
      </main>
    </Suspense>
  );
}