// CollabClient.tsx - Enhanced styled version
"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { X, Lightbulb, Loader2, Info, ChevronLeft, Sparkles, Users, Save, StopCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getStory } from "@/api/storyApi";
import { updateStory, sendEmail } from "@/api/storyApi";
import { createAIStory } from "@/api/aiApi";
import { getMyProfile } from "@/api/profile"
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { toast } from "sonner";
import { sendToPlotBot } from "@/api/aiApi";
import clsx from "clsx";
import { Bold, Italic, UnderlineIcon, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import type { Story, User, Chapter } from "@/types";
import getEmbeddings from "@/components/hooks/useEmbeddings";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function CollabPage() {
  const [isPlotBotOpen, setIsPlotBotOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [story, setStory] = useState<Story | null>(null);
  const id = searchParams.get("id");
  const editChapterIndex = searchParams.get("editChapterIndex");
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [botInput, setBotInput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [loadingBot, setLoadingBot] = useState(false);
  const [summary, setSummary] = useState("");
  const [isEditingExistingChapter, setIsEditingExistingChapter] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: 'Start your story here...',
    onUpdate: ({ }) => {
      if (!isTypingRef.current) {
        setSummary("");
      }
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const storyData = await getStory(id as string);
        console.log("Fetched story data:", storyData);
        setStory(storyData);

        if (editChapterIndex !== null && storyData.content[parseInt(editChapterIndex)]) {
          const chapterToEdit = storyData.content[parseInt(editChapterIndex)];
          editor?.commands.setContent(chapterToEdit.content);
          setSummary(chapterToEdit.summary || "");
          setIsEditingExistingChapter(true);
        } else {
          setIsEditingExistingChapter(false);
          editor?.commands.setContent("Start your story... Type a few lines and click 'AI Generate'.")
          setSummary("");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchData();
  }, [id, editChapterIndex, editor]);

  // [Keep all your existing functions: handleSave, handleAIGeneration, handleStopTyping, handleBotGeneration, togglePlotBot]
  const handleSave = async () => {
    if (!editor || !story) return;
    if (!id) {
      throw new Error("ID is required");
    }

    const profile = await getMyProfile();
    console.log("profile", profile, story.author._id, profile._id)
    const currentContent = editor.getHTML();
    const isAuthor = story.author._id === profile._id;
    console.log("isAuthor", isAuthor)

    if (isEditingExistingChapter && editChapterIndex !== null) {
      const chapterIndex = parseInt(editChapterIndex);
      const originalChapter = story.content[chapterIndex];
      const createdById = typeof originalChapter.createdBy === 'object' && originalChapter.createdBy !== null
        ? originalChapter.createdBy._id
        : originalChapter.createdBy;

      const chapterToUpdate: Chapter = {
        ...originalChapter,
        content: currentContent,
        summary: summary || originalChapter.summary,
        createdBy: createdById,
      };

      if (originalChapter._id) {
        chapterToUpdate._id = originalChapter._id;
      }

      if (isAuthor) {
        const updatedChapters = [...story.content];
        updatedChapters[chapterIndex] = chapterToUpdate;

        try {
          await updateStory(id, { content: updatedChapters });
          toast.success("Chapter updated successfully!");
          router.push(`/book/${id}`);
        } catch (err) {
          console.error("Failed to update chapter:", err);
          toast.error("Failed to update chapter.");
        }
      } else {
        try {
          await updateStory(id, {
            editedChapterData: chapterToUpdate,
            editedChapterIndex: chapterIndex,
          });
          const response = await sendEmail(story, chapterToUpdate, profile);
          if (response.message) {
            toast.success(response.message);
          }
          toast.success("Edit request sent for approval!");
          router.push(`/book/${id}`);
        } catch (err) {
          console.error("Failed to send edit request:", err);
          toast.error("Failed to send edit request.");
        }
      }
    } else {
      console.log("Adding new chapter");
      const embedding = await getEmbeddings( summary || currentContent );
      console.log("summary")
      const newChapter: Chapter = {
        title: `Chapter ${story.content.length + 1}`,
        content: currentContent,
        likes: 0,
        createdBy: profile._id,
        summary: summary,
        embedding: embedding,
        createdAt: new Date().toISOString(),
      };

      try {
        if (isAuthor) {
          const updatedStory = {
            ...story,
            content: [...story.content, newChapter],
          };
          await updateStory(id, { newChapter: newChapter });
          toast.success("Chapter added successfully!");
        } else {
          console.log("Sending chapter for approval");
          console.log("i am not the author")
          console.log("newChapter", newChapter)
          await updateStory(id, { newChapter: newChapter });
          const response = await sendEmail(story, newChapter, profile);
          console.log("good boy", response);
          if (response.message) {
            toast.success(response.message);
          }
          toast.success("Chapter request sent for approval!");
        }
        router.push(`/book/${id}`);
      } catch (err) {
        console.error("Failed to save new chapter:", err);
        toast.error("Failed to save new chapter.");
      }
    }
  };

  const handleAIGeneration = async () => {
    if (!story || !editor) return;

    const title = story.title;
    const previousContent = editor.getHTML();
    const summarizedContent = story.content.map(chapter => chapter.summary).join(" ");
    const OGcontent = summarizedContent + "\n\nUser Prompt: " + previousContent;
    try {
      setIsLoading(true);
      editor.commands.setContent("");
      const response = await createAIStory(title, OGcontent);
      const aiText = response.suggestion || "No suggestion received.";
      setIsLoading(false);
      editor.commands.setContent("");
      setSummary(response.summary);
      let index = 0;
      isTypingRef.current = true;

      const typeNextChar = () => {
        if (!isTypingRef.current || index >= aiText.length) return;

        editor.commands.insertContent(aiText[index]);
        index++;

        typingRef.current = setTimeout(typeNextChar, 20);
      };

      typeNextChar();
    } catch (err) {
      console.error("AI story generation failed:", err);
      setIsLoading(false);
      toast.error("AI generation failed.");
    }
  };

  const handleStopTyping = () => {
    isTypingRef.current = false;
    if (typingRef.current) {
      clearTimeout(typingRef.current);
      typingRef.current = null;
    }
  };

  const handleBotGeneration = async () => {
    if (!botInput.trim()) return;
    try {
      setLoadingBot(true);
      const embeddedInput = await getEmbeddings(botInput);
      const result = await sendToPlotBot(botInput, embeddedInput);
      setBotResponse(result);
    } catch (err) {
      console.error("PlotBot error:", err);
      setBotResponse("Something went wrong. Please try again.");
    } finally {
      setLoadingBot(false);
    }
  };

  const togglePlotBot = () => {
    setIsPlotBotOpen((prev) => !prev);
  };

  return (
    <main className="min-h-screen pt-16 lg:pt-23 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 text-gray-900">
      <Navbar />
      
      {/* Enhanced Back Button */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 pt-6"
      >
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/30 text-gray-700 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Story
        </button>
      </motion.div>

      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-6 pt-8 pb-6"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Story Info */}
            {story && (
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      {story.title}
                    </h1>
                    <h2 className="text-lg text-gray-600 font-medium">
                      {isEditingExistingChapter ? `Editing Chapter ${parseInt(editChapterIndex || '0') + 1}` : `Chapter ${story.content.length + 1}`}
                    </h2>
                  </div>
                </div>
              </div>
            )}

            {/* Collaborators & Actions */}
            <div className="flex flex-col items-end gap-4">
              {/* Collaborators */}
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">Collaborators</span>
                </div>
                <div className="flex gap-2 mb-4">
                  {[...new Map(
                    story?.content
                      .filter(ch => typeof ch.createdBy !== "string")
                      .map(ch => [(ch.createdBy as User)._id, ch.createdBy as User])
                  ).values()].slice(0, 4).map((user, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-800 p-0.5 shadow-lg">
                        <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-gray-600 to-gray-800">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {user.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Save className="w-4 h-4" />
                  {isEditingExistingChapter ? "Update Chapter" : "Save New Chapter"}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Editor Section */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className={clsx(
          "flex flex-col lg:flex-row gap-6 transition-all duration-300",
          isPlotBotOpen ? "lg:space-x-6" : ""
        )}>
          {/* Main Editor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={clsx(
              "bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl overflow-hidden transition-all duration-300",
              isPlotBotOpen ? "lg:w-3/4" : "w-full"
            )}
          >
            {/* Enhanced Toolbar */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { icon: Bold, action: () => editor?.chain().focus().toggleBold().run(), label: "Bold" },
                    { icon: Italic, action: () => editor?.chain().focus().toggleItalic().run(), label: "Italic" },
                    { icon: UnderlineIcon, action: () => editor?.chain().focus().toggleUnderline().run(), label: "Underline" },
                    { icon: List, action: () => editor?.chain().focus().toggleBulletList().run(), label: "List" },
                    { icon: AlignLeft, action: () => editor?.chain().focus().setTextAlign("left").run(), label: "Align Left" },
                    { icon: AlignCenter, action: () => editor?.chain().focus().setTextAlign("center").run(), label: "Align Center" },
                    { icon: AlignRight, action: () => editor?.chain().focus().setTextAlign("right").run(), label: "Align Right" },
                  ].map((btn, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={btn.action}
                      className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                      title={btn.label}
                    >
                      <btn.icon size={18} />
                    </motion.button>
                  ))}
                </div>
                
                <div className="flex items-center gap-2 text-white text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Writing Mode</span>
                </div>
              </div>
            </div>

            {/* Enhanced Writing Area */}
            <div className="relative">
              <div className="min-h-[60vh] lg:min-h-[70vh] bg-gradient-to-br from-gray-900 to-black text-white p-8">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-white" />
                    </div>
                    <p className="mt-4 text-gray-400 font-medium">AI is crafting your story...</p>
                  </div>
                ) : (
                  <EditorContent
                    editor={editor}
                    className="prose prose-invert max-w-none text-white min-h-[50vh] focus:outline-none [&>div]:min-h-[50vh] [&>div]:outline-none"
                  />
                )}
              </div>

              {/* Enhanced Action Buttons */}
              <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-200">
                <div className="flex items-center gap-4 flex-wrap">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleAIGeneration}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isLoading}
                    >
                      <Sparkles className="w-5 h-5" />
                      {isLoading ? "Generating..." : "Generate with AI"}
                    </Button>
                  </motion.div>

                  {isTypingRef.current && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleStopTyping}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <StopCircle className="w-5 h-5" />
                        Stop Typing
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

        
          {/* Enhanced PlotBot Panel */}
<AnimatePresence>
  {isPlotBotOpen && (
   <motion.div
  initial={{ opacity: 0, x: 300, scale: 0.9 }}
  animate={{ opacity: 1, x: 0, scale: 1 }}
  exit={{ opacity: 0, x: 300, scale: 0.9 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="lg:w-1/4 w-full h-[calc(100vh-100px)]"
>

<div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/30 shadow-xl p-6 flex flex-col h-full">
        {/* PlotBot Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PlotBot
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlotBot}
            className="p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Quick Suggestions */}
        <div className="mb-6 flex-shrink-0">
          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Quick Questions
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              "Who is the protagonist?",
              "Summarize the story",
              "What happens next?",
              "Describe the conflict",
            ].map((q, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBotInput(q)}
                className="text-left px-3 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-gray-700 hover:text-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Response Area - ✅ Fixed: Better height management */}
        <div className="flex-1 overflow-y-auto mb-4 min-h-0">
          {loadingBot ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">PlotBot is thinking...</p>
              </div>
            </div>
          ) : botResponse ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200 shadow-sm"
            >
              <div className="prose prose-sm max-w-none text-gray-800 overflow-hidden">
                <ReactMarkdown 
                  components={{
                    p: ({ children }) => <p className="mb-3 leading-relaxed text-sm">{children}</p>,
                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2 text-gray-800">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mb-2 text-gray-800">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mb-2 text-gray-800">{children}</h3>,
                    ul: ({ children }) => <ul className="mb-3 pl-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="mb-3 pl-4 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
                    strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
                  }}
                >
                  {botResponse}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 h-32 flex items-center justify-center">
              <div>
                <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Ask PlotBot anything about your story!</p>
              </div>
            </div>
          )}
        </div>

        {/* Input Area - ✅ Fixed: Stays at bottom */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <input
            value={botInput}
            onChange={(e) => setBotInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleBotGeneration()}
            className="flex-1 p-3 border border-gray-300 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm transition-all duration-200"
            placeholder="Ask PlotBot..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBotGeneration}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loadingBot || !botInput.trim()}
          >
            {loadingBot ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="text-lg">→</span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </div>

      {/* Enhanced Floating PlotBot Button */}
      {!isPlotBotOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={togglePlotBot}
          className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 z-40"
        >
          <Lightbulb className="w-5 h-5" />
          <span className="hidden sm:inline font-medium">Open PlotBot</span>
        </motion.button>
      )}

      {/* Enhanced Instructions Button & Modal */}
      {story?.collaborationInstructions && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowInstructionsModal(true)}
          className="fixed bottom-6 left-6 p-4 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 z-40"
          title="Read Collaboration Instructions"
        >
          <Info className="w-5 h-5" />
        </motion.button>
      )}

      {/* Enhanced Instructions Modal */}
      <AnimatePresence>
        {showInstructionsModal && story?.collaborationInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-lg w-full p-8 relative border border-white/30"
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowInstructionsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Info className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Collaboration Instructions
                </h2>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-6 border border-gray-200">
                <div className="text-gray-700 leading-relaxed">
                  <p>{story.collaborationInstructions}</p>
                </div>
              </div>
              
              <Button 
                onClick={() => setShowInstructionsModal(false)} 
                className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

