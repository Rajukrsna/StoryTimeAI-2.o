"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect,useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { X, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getStory } from "@/api/storyApi";
import {updateStory} from "@/api/storyApi";
import {createAIStory} from "@/api/aiApi";
import {getMyProfile} from "@/api/profile"
import {  Users, Save, Sparkles } from "lucide-react";
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { toast } from "sonner";
import { sendToPlotBot } from "@/api/aiApi";  
import clsx from "clsx";
import {    Bold, Italic,UnderlineIcon, List, AlignLeft, AlignCenter, AlignRight, StopCircle } from 'lucide-react';
import type { Story, User, Chapter} from "@/types"; // Adjust the path as needed
import getEmbeddings  from "@/components/hooks/useEmbeddings"; // Ensure this is the correct import for your embeddings API


export default function CollabPage() {

    const [isPlotBotOpen, setIsPlotBotOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [story, setStory] = useState<Story | null>(null);
    const id = searchParams.get("id");
    const typingRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef(false); // Use ref instead of state
    const [isLoading, setIsLoading] = useState(false);
    const [botInput, setBotInput] = useState("");
    const [botResponse, setBotResponse] = useState("");
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState(""); 


    const handleSave = async () => {
    if (!editor || !story || !id) return;
  const embedding = await getEmbeddings(summary); // ✅ Await this async function
  const profile = await getMyProfile(); 

  const newChapter: Chapter = {
    title: `Chapter ${story.content.length + 1}`,
    content: editor.getHTML(),
    likes: 0,
    createdBy: profile._id,
    summary: summary,
    embedding: embedding,
    createdAt: new Date().toISOString(),
  };
 const updatedStory = {
        ...story,
        content: [...story.content, newChapter],
      };
  const isAuthor = story.author.id === profile._id;
  console.log("isAuthor", isAuthor, "profile", profile._id, "story.author.id", story.author.id)

  try {

    if (isAuthor) {
      await updateStory(id, updatedStory,newChapter);
      toast.success("Chapter added successfully!");
    } else {
        console.log("pendingchap", updatedStory, newChapter)
        await updateStory(id, updatedStory,newChapter);
        toast.success(" Chapter request sent for approval!");
    }
    router.push("/homepage");
  } catch (err) {
    console.error("Failed to save new chapter:", err);
  }
    };
   const handleAIGeneration = async () => {
  if (!story || !editor) return;

  const title = story.title;
  const previousContent = editor.getHTML();
  const summarizedContent = story.content.map(chapter=>chapter.summary).join(" ");
  const OGcontent = summarizedContent + "\n\nUser Prompt: " + previousContent;
  try {
        setIsLoading(true);         // Start loading
    editor.commands.setContent("");
    const response = await createAIStory(title, OGcontent);
    const aiText = response.suggestion || "No suggestion received.";
    setIsLoading(false);        // Stop loading
    editor.commands.setContent(""); // Clear editor
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
    setIsLoading(false); // Stop loading on error

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
    setLoading(true);
    const embeddedInput = await getEmbeddings(botInput);  
    const result = await sendToPlotBot(botInput, embeddedInput);
    setBotResponse(result);
  } catch (err) {
    console.error("PlotBot error:", err);
    setBotResponse("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


    
    useEffect(() => {
            if (!id) return;
    
            const fetchData = async () => {
                try {
                    const storyData = await getStory(id as string);
                    console.log(storyData)
                    setStory(storyData);
                } catch (error) {
                    console.error("Error fetching story:", error);
                }
            };
    
            fetchData();
        }, [id]);
    

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
  });

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
              Chapter {story.content.length + 1}
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
              <Save size={16} /> Save
            </Button>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-300 max-w-7xl mx-auto" />

      {/* Editor Section */}
      <div className={clsx("flex flex-col lg:flex-row gap-6 px-6 pt-6 pb-10 max-w-7xl mx-auto")}>
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
{isPlotBotOpen ? (
  <div className="lg:w-1/4 bg-white border rounded-xl shadow-md p-4 flex flex-col justify-between">
    <div>
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
          className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          placeholder="Enter command..."
        />
        <button
          onClick={handleBotGeneration}
          className="p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 shadow-sm"
        >
          ➤
        </button>
      </div>

      {/* Response Section */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-sm text-gray-500 animate-pulse">
            PlotBot is thinking...
          </div>
        ) : (
          botResponse && (
            <div className="bg-gray-100 p-3 rounded-md text-sm whitespace-pre-wrap">
              {botResponse}
            </div>
          )
        )}
      </div>
    </div>
  </div>
) : (
  <button
    onClick={togglePlotBot}
    className="fixed bottom-6 right-6 px-4 py-2 bg-gray-300 text-black rounded-full hover:bg-gray-400 transition shadow-lg flex items-center gap-2"
  >
    <Lightbulb size={18} /> Open PlotBot
  </button>
)}

      </div>
    </main>
       

  );

}
