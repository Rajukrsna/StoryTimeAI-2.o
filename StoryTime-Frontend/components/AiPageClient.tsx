"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { FaTag } from "react-icons/fa";
import { createAIStory } from "@/api/aiApi";
import { createStory } from "@/api/storyApi";
import { 
  FaMagic, 
  FaStop, 
  FaUpload, 
  FaRobot, 
  FaBook, 
  FaEdit,
  FaEye,
  FaCopy,
  FaDownload,
  FaSave,
  FaUsers
} from "react-icons/fa";
import { 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  Send, 
  Eye, 
  Edit3, 
  FileText, 
  Share2,
  Clock,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  BookOpen,
  Wand2
} from "lucide-react";
import { toast } from "sonner";
import getEmbeddings from "@/components/hooks/useEmbeddings";
import { Navbar } from "@/components/Navbar";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";

export default function AiPageClient() {
  const searchParams = useSearchParams();
  const initialStory = searchParams.get("story") || "";
  const initialSummary = searchParams.get("summary") || "";
  const title = searchParams.get("title") || "Untitled Story";
  const imageUrl = searchParams.get("imageUrl") || "";
  const collaborationInstructions = searchParams.get("collaborationInstructions") || "";
  
  const [story, setStory] = useState(initialStory);
  const [summary, setSummary] = useState(initialSummary);
  const [isUserEditing, setIsUserEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [wordCount, setWordCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setWordCount(story.split(' ').filter(word => word.length > 0).length);
  }, [story]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isUserEditing) {
        setLastSaved(new Date());
        setIsUserEditing(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [story, isUserEditing]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const response = await createAIStory(title, story);
      if (response) {
        setStory(response.suggestion);
        setSummary(response.summary);
        setIsUserEditing(false);
        toast.success("✨ Story regenerated successfully!");
      } else {
        toast.error("AI regeneration failed.");
      }
    } catch (error) {
      console.error("Regeneration failed:", error);
      toast.error("Failed to regenerate story. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const embeds = await getEmbeddings(summary);
      const response = await createStory(title, story, imageUrl, summary, embeds, collaborationInstructions);
      if (response) {
        toast.success("🎉 Story published successfully!");
        setShowPublishModal(false);
        router.push("/homepage");
      } else {
        toast.warning("⚠️ No response from the backend.");
      }
    } catch (error) {
      console.error("Publishing failed:", error);
      toast.error("❌ Publishing failed. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(story);
    toast.success("📋 Story copied to clipboard!");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([story], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("📥 Story downloaded!");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 lg:pt-18 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-gray-100/40 to-gray-200/30 rounded-full blur-2xl"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl">
                    <FaRobot className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                      AI Story Workshop
                    </h1>
                    <p className="text-gray-600 text-lg">
                      Refine and perfect your AI-generated story
                    </p>
                  </div>
                </div>

                {/* Story Info */}
                <div className="flex flex-wrap items-center gap-4">
                    <FaTag className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {title}
                  </FaTag>
                  <FaTag className="border-gray-300 text-gray-600 px-3 py-1 rounded-full">
                    <FileText className="w-4 h-4 mr-2" />
                    {wordCount} words
                  </FaTag>
                  {lastSaved && (
                    <FaTag  className="border-green-300 text-green-600 px-3 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Saved {lastSaved.toLocaleTimeString()}
                    </FaTag>
                  )}
                </div>
              </div>

              {/* Cover Image Preview */}
              {imageUrl && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-32 h-40 lg:w-40 lg:h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white"
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Editor/Preview Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Edit3 className="w-5 h-5" />
                      Story Editor
                    </CardTitle>
                    
                    {/* Tab Switcher */}
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeTab === 'edit'
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                          activeTab === 'preview'
                            ? 'bg-white text-gray-900 shadow-md'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        Preview
                      </button>
                    </div>
                  </div>
                  <CardDescription>
                    {activeTab === 'edit' 
                      ? 'Edit your story content using Markdown formatting'
                      : 'Preview how your story will appear to readers'
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  <AnimatePresence mode="wait">
                    {activeTab === 'edit' ? (
                      <motion.div
                        key="edit"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <textarea
                          ref={textareaRef}
                          className="w-full h-[500px] lg:h-[600px] text-base p-6 border-0 bg-transparent resize-none focus:outline-none focus:ring-0 transition-all duration-300 font-mono leading-relaxed"
                          value={story}
                          onChange={(e) => {
                            setStory(e.target.value);
                            setIsUserEditing(true);
                          }}
                          placeholder="Write your story here using Markdown formatting...

# Chapter 1: The Beginning

Once upon a time..."
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="h-[500px] lg:h-[600px] overflow-auto p-6 bg-gradient-to-br from-gray-50 to-white"
                      >
                        <div className="prose prose-lg max-w-none text-gray-800">
                          <ReactMarkdown>{story || "*No content to preview*"}</ReactMarkdown>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Action Panel */}
              <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wand2 className="w-5 h-5" />
                    Actions
                  </CardTitle>
                  <CardDescription>
                    Edit, regenerate, or publish your story
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-xl py-3"
                    >
                      {isRegenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <FaMagic className="w-4 h-4 mr-2" />
                      )}
                      {isRegenerating ? 'Regenerating...' : 'Regenerate with AI'}
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setShowPublishModal(true)}
                      disabled={!story.trim()}
                      variant="outline"
                      className="w-full border-2 border-green-200 text-green-700 hover:bg-green-50 rounded-xl py-3"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Publish Story
                    </Button>
                  </motion.div>

                  <div className="flex gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={handleCopyToClipboard}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl"
                      >
                        <FaCopy className="w-3 h-3 mr-2" />
                        Copy
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                      <Button
                        onClick={handleDownload}
                        variant="outline"
                        size="sm"
                        className="w-full rounded-xl"
                      >
                        <FaDownload className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => setStory("")}
                      variant="destructive"
                      className="w-full rounded-xl py-3"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Story
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>

              {/* Story Stats */}
              <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5" />
                    Story Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{wordCount}</div>
                      <div className="text-sm text-gray-600">Words</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-800">{story.split('\n').length}</div>
                      <div className="text-sm text-gray-600">Lines</div>
                    </div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-gray-800">
                      {Math.ceil(wordCount / 200)}
                    </div>
                    <div className="text-sm text-gray-600">Reading Time (min)</div>
                  </div>
                </CardContent>
              </Card>

              {/* Collaboration Info */}
              {collaborationInstructions && (
                <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FaUsers className="w-5 h-5" />
                      Collaboration Guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {collaborationInstructions}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>

        {/* Publish Confirmation Modal */}
        <AnimatePresence>
          {showPublishModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowPublishModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              >
                <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Send className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Publish Your Story</h2>
                      <p className="text-gray-200">Share your creation with the world</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <p className="text-blue-800 text-sm">
                      Once published, your story will be visible to all users and open for collaboration.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Title:</span>
                      <span className="font-medium text-gray-900">{title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Word Count:</span>
                      <span className="font-medium text-gray-900">{wordCount} words</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Collaboration:</span>
                      <span className="font-medium text-gray-900">
                        {collaborationInstructions ? 'Enabled' : 'Open'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 border-t flex gap-3">
                  <Button
                    onClick={() => setShowPublishModal(false)}
                    variant="outline"
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-xl"
                  >
                    {isPublishing ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isPublishing ? 'Publishing...' : 'Publish Now'}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isRegenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white/95 backdrop-blur-md z-40 flex items-center justify-center"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-200/50 text-center max-w-md mx-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 mx-auto mb-6"
                >
                  <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                    <FaRobot className="text-2xl text-white" />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  AI is working its magic...
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  Please wait while we regenerate your story with fresh AI insights.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}