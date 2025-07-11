// StoryTime-Frontend/components/CollabClient.tsx
"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { X, Lightbulb, Loader2, Info } from 'lucide-react'; // Added Info icon
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getStory } from "@/api/storyApi";
import { updateStory } from "@/api/storyApi";
import { createAIStory } from "@/api/aiApi";
import { getMyProfile } from "@/api/profile"
import { Users, Save, Sparkles } from "lucide-react";
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { toast } from "sonner";
import { sendToPlotBot } from "@/api/aiApi";
import clsx from "clsx";
import { Bold, Italic, UnderlineIcon, List, AlignLeft, AlignCenter, AlignRight, StopCircle } from 'lucide-react';
import type { Story, User, Chapter } from "@/types";
import getEmbeddings from "@/components/hooks/useEmbeddings";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence

export default function CollabPage() {

  const [isPlotBotOpen, setIsPlotBotOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [story, setStory] = useState<Story | null>(null);
  const id = searchParams.get("id");
  const editChapterIndex = searchParams.get("editChapterIndex"); // New param
  const typingRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [botInput, setBotInput] = useState("");
  const [botResponse, setBotResponse] = useState("");
  const [loadingBot, setLoadingBot] = useState(false); // Renamed to avoid conflict
  const [summary, setSummary] = useState("");
  const [isEditingExistingChapter, setIsEditingExistingChapter] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false); // ADD THIS LINE


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
      // Update summary if content changes and not in AI typing mode
      if (!isTypingRef.current) {
        // You might want to generate a summary on the fly or clear it
        // For now, let's just clear it if user edits
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
          editor?.commands.setContent('Start your story here...'); // Reset for new chapter
          setSummary("");
        }
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchData();
  }, [id, editChapterIndex, editor]); // Re-run when id or editChapterIndex changes

  const handleSave = async () => {
    if (!editor || !story) return;
    if (!id) {
      throw new Error("ID is required");
    }

    const profile = await getMyProfile();
    console.log("profile", profile, story.author._id, profile._id)
    const currentContent = editor.getHTML();
    const isAuthor = story.author._id === profile._id; // Determine author status here
    console.log("isAuthor", isAuthor)

    if (isEditingExistingChapter && editChapterIndex !== null) {
      const chapterIndex = parseInt(editChapterIndex);
      const originalChapter = story.content[chapterIndex]; // Get the original chapter object
      const createdById = typeof originalChapter.createdBy === 'object' && originalChapter.createdBy !== null
        ? originalChapter.createdBy._id
        : originalChapter.createdBy;


      const chapterToUpdate: Chapter = { // Explicitly type to Chapter
        ...originalChapter, // Spread all properties from the original chapter, including _id
        content: currentContent, // Update content
        summary: summary || originalChapter.summary, // Update summary
        createdBy: createdById, // Ensure createdBy is a string ID
        // You might want to update embedding here too if content changed significantly
        // embedding: await getEmbeddings(summary || currentContent),
      };
      // Ensure _id is explicitly set if it exists on the original chapter
      if (originalChapter._id) {
        chapterToUpdate._id = originalChapter._id;
      }

      if (isAuthor) {
        // Author editing existing chapter: Send the full updated story content
        const updatedChapters = [...story.content];
        updatedChapters[chapterIndex] = chapterToUpdate; // Replace the chapter at the specific index

        try {
          await updateStory(id, { content: updatedChapters }); // Only send content for author update
          toast.success("Chapter updated successfully!");
          router.push(`/book/${id}`);
        } catch (err) {
          console.error("Failed to update chapter:", err);
          toast.error("Failed to update chapter.");
        }
      } else {
        // Non-author proposing an edit to an existing chapter: Send only the edited chapter data
        try {
          await updateStory(id, {
            editedChapterData: chapterToUpdate,
            editedChapterIndex: chapterIndex,
          }); // Pass the specific edit data
          toast.success("Edit request sent for approval!");
          router.push(`/book/${id}`);
        } catch (err) {
          console.error("Failed to send edit request:", err);
          toast.error("Failed to send edit request.");
        }
      }

    } else {
      // Creating a new chapter (logic remains mostly the same)
      const embedding = await getEmbeddings(summary || currentContent);
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
          await updateStory(id, { content: updatedStory.content }); // Send full content for author
          toast.success("Chapter added successfully!");
        } else {
          await updateStory(id, { newChapter: newChapter }); // Send newChapter for non-author pending
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
      setLoadingBot(true); // Use loadingBot
      const embeddedInput = await getEmbeddings(botInput);
      const result = await sendToPlotBot(botInput, embeddedInput);
      setBotResponse(result);
    } catch (err) {
      console.error("PlotBot error:", err);
      setBotResponse("Something went wrong. Please try again.");
    } finally {
      setLoadingBot(false); // Use loadingBot
    }
  };

  const togglePlotBot = () => {
    setIsPlotBotOpen((prev) => !prev);
  };

  return (

    <main className="min-h-screen bg-gradient-to-br from-white via-slate-100 to-slate-200 text-gray-800">
      <Navbar />

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4 max-w-7xl mx-auto">
        {story && (
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{story.title}</h1>
            <h2 className="pl-1 pt-1 text-lg md:text-2xl text-gray-500">
              {isEditingExistingChapter ? `Editing Chapter ${parseInt(editChapterIndex || '0') + 1}` : `Chapter ${story.content.length + 1}`}
            </h2>
          </div>
        )}

        <div className="flex items-end gap-6">
          {/* Collaborators */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
              <Users size={16} />
              Collaborators
            </div>
            <div className="flex gap-2">
              {[...new Map(
                story?.content
                  .filter(ch => typeof ch.createdBy !== "string")
                  .map(ch => [(ch.createdBy as User)._id, ch.createdBy as User])
              ).values()].slice(0, 4).map((user, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow"
                  title={user.name}
                >
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold bg-gray-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={handleSave}
              className="mt-2 bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-1"
            >
              <Save size={16} /> {isEditingExistingChapter ? "Update Chapter" : "Save New Chapter"}
            </Button>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-300 max-w-7xl mx-auto" />

      {/* Editor Section */}
      <div className={clsx(
        "flex flex-col lg:flex-row gap-6 px-6 pt-6 pb-10 max-w-7xl mx-auto",
        // Add a class for editor height adjustment if needed
        isPlotBotOpen ? "lg:h-[calc(100vh-250px)]" : "lg:h-[calc(100vh-150px)]"
      )}>
        <div className={clsx(
          "border rounded-xl shadow-md p-0 bg-white flex flex-col transition-all duration-300",
          isPlotBotOpen ? "lg:w-3/4" : "w-full"
        )}>
          {/* Toolbar */}
          <div className="bg-gray-900 text-white p-3 border-b border-gray-800 flex items-center gap-2 flex-wrap">
            <button onClick={() => editor?.chain().focus().toggleBold().run()} className="toolbar-btn">
              <Bold size={18} />
            </button>
            <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="toolbar-btn">
              <Italic size={18} />
            </button>
            <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="toolbar-btn">
              <UnderlineIcon size={18} />
            </button>
            <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="toolbar-btn">
              <List size={18} />
            </button>
            <button onClick={() => editor?.chain().focus().setTextAlign("left").run()} className="toolbar-btn">
              <AlignLeft size={18} />
            </button>
            <button onClick={() => editor?.chain().focus().setTextAlign("center").run()} className="toolbar-btn">
              <AlignCenter size={18} />
            </button>
            <button onClick={() => editor?.chain().focus().setTextAlign("right").run()} className="toolbar-btn">
              <AlignRight size={18} />
            </button>
          </div>

          {/* Writing Area */}
          <div className="flex-1 overflow-y-auto bg-black text-white p-6 min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[200px]">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-3 h-3 bg-gray-700 rounded-full animate-bounce"></span>
                </div>
              </div>
            ) : (
              <EditorContent
                editor={editor}
                className="prose prose-invert max-w-none text-white min-h-[80vh] focus:outline-none"
              />
            )}

          </div>
          <div className="p-4 flex gap-4">
            <Button
              onClick={handleAIGeneration}
              className="bg-gray-800 hover:bg-gray-700 text-white flex items-center gap-2 px-4 py-2"
              disabled={isLoading}
            >
              <Sparkles size={18} /> {isLoading ? "Generating..." : "Generate with AI"}
            </Button>

            {isTypingRef.current && (
              <Button
                onClick={handleStopTyping}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 px-4 py-2"
              >
                <StopCircle size={18} /> Stop Typing
              </Button>
            )}
          </div>

        </div>

        {/* PlotBot */}
        <motion.div
          initial={{ opacity: 0, x: isPlotBotOpen ? 0 : 20 }}
          animate={{ opacity: isPlotBotOpen ? 1 : 0, x: isPlotBotOpen ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className={clsx(
            "lg:w-1/4 bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between",
            !isPlotBotOpen && "hidden lg:flex" // Hide on small screens when closed, but keep for animation on large
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">PlotBot</h2>
            <button onClick={togglePlotBot}>
              <X className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          {/* Input Section */}
          <div className="flex items-center gap-2 mb-4">
            <input
              value={botInput}
              onChange={(e) => setBotInput(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ask PlotBot a question..."
            />
            <button
              onClick={handleBotGeneration}
              className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 shadow-sm transition-colors"
              disabled={loadingBot}
            >
              {loadingBot ? <Loader2 className="animate-spin" size={20} /> : "➤"}
            </button>
          </div>

          {/* Response Section */}
          <div className="flex flex-col gap-4 flex-grow overflow-y-auto">
            {loadingBot ? (
              <div className="text-sm text-gray-500 flex items-center gap-2 animate-pulse">
                <Loader2 className="animate-spin" size={16} /> PlotBot is thinking...
              </div>
            ) : (
              botResponse && (
                <div className="bg-gray-100 p-3 rounded-md text-sm whitespace-pre-wrap border border-gray-200">
                  {botResponse}
                </div>
              )
            )}
          </div>
        </motion.div>

        {!isPlotBotOpen && (
          <button
            onClick={togglePlotBot}
            className="fixed bottom-6 right-6 px-4 py-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition shadow-lg flex items-center gap-2 z-40"
          >
            <Lightbulb size={18} /> Open PlotBot
          </button>
        )}
      </div>

      {/* Collaboration Instructions Icon */}
      {story?.collaborationInstructions && (
        <motion.button
          className="fixed bottom-6 left-6 p-4 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => setShowInstructionsModal(true)}
          title="Read Collaboration Instructions"
        >
          <Info size={24} />
        </motion.button>
      )}

      {/* Collaboration Instructions Modal */}
      <AnimatePresence>
        {showInstructionsModal && story?.collaborationInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={() => setShowInstructionsModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Collaboration Instructions</h2>
              <div className="text-gray-700 prose max-w-none overflow-y-auto max-h-[60vh]">
                <p>{story.collaborationInstructions}</p>
              </div>
              <Button onClick={() => setShowInstructionsModal(false)} className="mt-6 w-full bg-black text-white hover:bg-gray-800">
                Got it!
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

