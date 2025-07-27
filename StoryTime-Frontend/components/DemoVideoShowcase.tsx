"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 

  X,
 
  BookOpen,
  Users,
  Trophy,
  Sword,
  Bot,
  PenTool,
 
  Heart,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {  FaRocket, FaYoutube } from "react-icons/fa";

interface DemoVideoShowcaseProps {
  onClose: () => void;
  youtubeVideoId?: string; // Add this prop for YouTube video ID
}

const DemoVideoShowcase: React.FC<DemoVideoShowcaseProps> = ({ 
  onClose, 
  youtubeVideoId = "YOUR_YOUTUBE_VIDEO_ID" // Replace with your actual video ID
}) => {
  const [currentSection, setCurrentSection] = useState(0);

  const [showYouTubeVideo, setShowYouTubeVideo] = useState(true);
  
  const demoSections = [
    {
      id: 0,
      title: "Complete Walkthrough",
      icon: <FaYoutube className="w-6 h-6" />,
      duration: 0, // Will be set by YouTube video
      description: "Full application demo video",
      timestamp: "0:00"
    },
    {
      id: 1,
      title: "Welcome to StoryTime.AI",
      icon: <FaRocket className="w-6 h-6" />,
      duration: 15,
      description: "Platform introduction",
      timestamp: "0:00"
    },
    {
      id: 2,
      title: "Creating Your First Story",
      icon: <PenTool className="w-6 h-6" />,
      duration: 30,
      description: "AI story generation",
      timestamp: "0:15"
    },
    {
      id: 3,
      title: "Reading & Exploring Stories",
      icon: <BookOpen className="w-6 h-6" />,
      duration: 20,
      description: "Immersive reading experience",
      timestamp: "0:45"
    },
    {
      id: 4,
      title: "Collaborative Writing",
      icon: <Users className="w-6 h-6" />,
      duration: 25,
      description: "Add chapters to stories",
      timestamp: "1:05"
    },
    {
      id: 5,
      title: "PlotBot AI Assistant",
      icon: <Bot className="w-6 h-6" />,
      duration: 20,
      description: "AI writing assistance",
      timestamp: "1:30"
    },
    {
      id: 6,
      title: "Writer Leaderboards",
      icon: <Trophy className="w-6 h-6" />,
      duration: 15,
      description: "Community rankings",
      timestamp: "1:50"
    },
    {
      id: 7,
      title: "Story Battles",
      icon: <Sword className="w-6 h-6" />,
      duration: 25,
      description: "Writing competitions",
      timestamp: "2:05"
    },
    {
      id: 8,
      title: "Community Features",
      icon: <Heart className="w-6 h-6" />,
      duration: 10,
      description: "Social interactions",
      timestamp: "2:30"
    }
  ];

  // Convert YouTube video ID to embed URL
  const getYouTubeEmbedUrl = (videoId: string, startTime?: number) => {
    let url = `https://www.youtube.com/embed/${videoId}?`;
    const params = new URLSearchParams({
      autoplay: '0',
      rel: '0',
      modestbranding: '1',
      showinfo: '0',
      controls: '1',
      enablejsapi: '1',
      origin: window.location.origin
    });
    
    if (startTime) {
      params.append('start', startTime.toString());
    }
    
    return url + params.toString();
  };

  // Function to convert timestamp to seconds
  const timestampToSeconds = (timestamp: string): number => {
    const parts = timestamp.split(':');
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return minutes * 60 + seconds;
  };

  const jumpToSection = (sectionId: number) => {
    setCurrentSection(sectionId);
    
    if (sectionId === 0) {
      setShowYouTubeVideo(true);
    } else {
      setShowYouTubeVideo(false);
      // If you want to jump to specific timestamps in the YouTube video
      // You can modify this to control the YouTube player
    }
  };

  const jumpToTimestamp = (timestamp: string) => {
    const seconds = timestampToSeconds(timestamp);
    setShowYouTubeVideo(true);
    setCurrentSection(0);
    
    // Create new iframe with timestamp
    const iframe = document.querySelector('#youtube-player') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = getYouTubeEmbedUrl(youtubeVideoId, seconds);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-7xl h-[90vh] bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 to-transparent p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-800 rounded-xl flex items-center justify-center">
                  <FaYoutube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">StoryTime.AI - Video Walkthrough</h3>
                  <p className="text-gray-300 text-sm">Complete demo of our creative writing platform</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://youtube.com/watch?v=${youtubeVideoId}`, '_blank')}
                  className="text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Watch on YouTube
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-xl transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex h-full pt-20">
            {/* Left Sidebar - Table of Contents */}
            <div className="w-80 bg-black/50 backdrop-blur-md p-6 overflow-y-auto">
              <div className="flex items-center gap-2 mb-6">
                <h4 className="text-white font-bold">Demo Sections</h4>
                <div className="px-2 py-1 bg-red-600 rounded-full text-xs text-white font-bold">
                  LIVE
                </div>
              </div>
              
              <div className="space-y-2">
                {demoSections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => {
                      if (section.id === 0) {
                        jumpToSection(0);
                      } else {
                        jumpToTimestamp(section.timestamp);
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      currentSection === section.id
                        ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        currentSection === section.id ? 'bg-white/20' : 'bg-white/10'
                      }`}>
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{section.title}</div>
                        <div className="text-xs opacity-70">{section.description}</div>
                        <div className="text-xs opacity-50 mt-1 flex items-center gap-2">
                          <Play className="w-3 h-3" />
                          {section.timestamp}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Video Info */}
              <div className="mt-8 p-4 bg-white/10 rounded-xl">
                <h5 className="text-white font-bold mb-2">About This Demo</h5>
                <p className="text-gray-300 text-sm leading-relaxed">
                  This comprehensive walkthrough showcases all features of StoryTime.AI, 
                  from story creation to community interactions. Click any section to jump 
                  to that part of the video.
                </p>
              </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 relative">
              <AnimatePresence mode="wait">
                {showYouTubeVideo ? (
                  <motion.div
                    key="youtube-video"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-6"
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                      <iframe
                        id="youtube-player"
                        width="100%"
                        height="100%"
                        src={getYouTubeEmbedUrl(youtubeVideoId)}
                        title="StoryTime.AI Demo Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    
                    {/* Video Overlay Info */}
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="bg-black/80 backdrop-blur-md rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-bold">Now Playing</h4>
                            <p className="text-gray-300 text-sm">
                              {demoSections[currentSection]?.title || "Complete Walkthrough"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 text-sm font-medium">LIVE DEMO</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="section-content"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center p-8"
                  >
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-red-600 to-red-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FaYoutube className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-white mb-4">
                        {demoSections[currentSection]?.title}
                      </h2>
                      <p className="text-xl text-gray-300 mb-8">
                        {demoSections[currentSection]?.description}
                      </p>
                      <Button
                        onClick={() => jumpToTimestamp(demoSections[currentSection]?.timestamp)}
                        className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-8 py-3 rounded-xl"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Watch This Section
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoVideoShowcase;