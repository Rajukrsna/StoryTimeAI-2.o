"use client";
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import { X, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getStory } from "@/api/storyApi";
import {updateStory} from "@/api/storyApi";
import {createAIStory} from "@/api/aiApi";
import {getMyProfile} from "@/api/profile"

interface Contribution {
  title: string;
  score: number;
}
interface Chapter {
  _id?: string;
  title: string;
  content: string;
  likes: number,
  createdBy: string | User; // allow both types
  createdAt: string;
}
interface Author {
    id: string;
    name: string;
    bio: string;
    profileImage: string;
}
interface PendingChapter extends Chapter {
  requestedBy: string | User;
  status: "pending" | "approved" | "rejected";
}
interface Story {
    _id: string;
    title: string;
    content: Chapter[];
  pendingChapters: PendingChapter[]; // ✅ completed
    author: Author;
    votes: number;
    imageUrl: string;   
}
interface User {
  _id: string;
  name: string;
  profilePicture?: string;
  email?: string;
  bio?: string;
  contributions?: Contribution[];  // ← updated from `Number` to `Contribution[]`
}

export default function CollabPage() {
    const [isPlotBotOpen, setIsPlotBotOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [story, setStory] = useState<Story | null>(null);
    const id = searchParams.get("id");
    const title = searchParams.get("title")
    
    const handleSave = async () => {
    if (!editor || !story || !id) return;

  const profile = await getMyProfile(); 

  const newChapter: Chapter = {
    title: `Chapter ${story.content.length + 1}`,
    content: editor.getHTML(),
    likes: 0,
    createdBy: profile._id,
    createdAt: new Date().toISOString(),
  };
 const updatedStory = {
        ...story,
        content: [...story.content, newChapter],
      };
  const isAuthor = story.author.id === profile._id;
  console.log("sdfds", isAuthor)

  try {
    if (isAuthor) {
    
      await updateStory(id, updatedStory,newChapter);
      alert("Chapter added successfully!"); 
    } else {
        console.log("pendingchap", updatedStory, newChapter)
      // Send chapter as request
     await updateStory(id, updatedStory,newChapter);
      alert("Chapter request sent for approval!");
    }
    router.push("/book");
  } catch (err) {
    console.error("Failed to save new chapter:", err);
  }
  
    };

    const handleAIGeneration = async () => {
    if (!story || !editor) return;

    const title = story.title;
    const previousContent = editor.getHTML();

    try {
        const response = await createAIStory(title, previousContent);
        const aiText = response.suggestion || "No suggestion received.";

        // Clear the editor first
        editor.commands.setContent("");

        // Typing effect
        let index = 0;

        const typeNextChar = () => {
            if (index < aiText.length) {
                editor.commands.insertContent(aiText[index]);
                index++;
                setTimeout(typeNextChar, 20); 
            }
        };

        typeNextChar();
    } catch (err) {
        console.error("AI story generation failed:", err);
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
        extensions: [StarterKit, Bold, Italic, Underline, Heading],
        content: `<p>Start writing your collaborative story...</p>`,
    });

    const togglePlotBot = () => {
        setIsPlotBotOpen((prev) => !prev);
    };

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Header Section */}
            
                            <div className="flex items-center justify-between p-6">
                                {story && (
                <div className="flex flex-col">
                    <h1 className="text-5xl font-bold">{story.title}</h1>
                    <h2 className="pl-2 text-2xl text-gray-500">
                    Chapter {story.content.length + 1}
                    </h2>
                </div>
                )}

                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <h1 className="text-gray-400 text-sm mb-2">Collaborators</h1>
                        <div className="flex gap-2">
                            {Array(4).fill(0).map((_, idx) => (
                                <div key={idx} className="w-10 h-10 rounded-lg bg-gray-300 flex items-center justify-center">
                                    👤
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleSave} className="mt-2"> Save </Button>
                    </div>
                </div>
            </div>

            <div className="mt-2 h-px bg-gray-300 max-w-screen-2xl mx-auto" />

            <div className={`flex ${isPlotBotOpen ? "gap-6" : ""} p-6`}>
                <div className={`border rounded-lg bg-white shadow-lg p-6 ${isPlotBotOpen ? "w-3/4" : "w-full"}`}>
                    <div className="h-full sm:h-[calc(100vh-28rem)] md:h-[calc(100vh-24rem)] lg:h-[calc(100vh-20rem)] xl:h-[calc(100vh-19rem)] overflow-y-auto">
                        <EditorContent editor={editor} className="h-full text-md" />
                    </div>
                    <Button onClick={handleAIGeneration} className="mt-2"> Generate with AI </Button>
                </div>
                
                {isPlotBotOpen && (
                    <div className="w-1/4 bg-gray-200 p-4 rounded-lg shadow-lg flex flex-col gap-4 justify-between">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold">PlotBot</h2>
                            <X onClick={togglePlotBot} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="flex-1 p-2 border bg-gray-400 rounded-md" placeholder="Enter Command" />
                            <button className="p-2 bg-gray-500 text-white rounded-md">➤</button>
                        </div>
                    </div>
                )}

                {!isPlotBotOpen && (
                    <div
                        onClick={togglePlotBot}
                        className="fixed bottom-6 right-6 px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition shadow-md"
                    >
                        <Lightbulb />
                    </div>
                )}
            </div>

        </main>
    );
}
