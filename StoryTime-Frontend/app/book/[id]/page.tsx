// StoryTime-Frontend/app/book/[id]/page.tsx
"use client";  // Mark as a Client Component

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams instead of useRouter
import { getStory } from "@/api/storyApi";
import ContentComponent from "@/components/contentComponent";
import { Navbar } from "@/components/Navbar";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import type { Story  } from "@/types"; // Adjust the path as needed
import { Suspense } from "react";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import the LoadingSpinner
import { updateStoryVotes } from "@/api/storyApi"; // Import the new API function

export default function BookPage() {
   
    const params = useParams(); // Get story ID from the URL
    const [story, setStory] = useState<Story | null>(null);
    const id = params?.id as string;
    const handleUpdateStory = async (vote: number) => {
        if (!story) return;

        // Optimistic UI update
        setStory(prevStory => prevStory ? { ...prevStory, votes: prevStory.votes + vote } : null);
        
        try {
            await updateStoryVotes(id, vote); // Call the new API function
        } catch (error) {
            console.error("Failed to update story votes:", error);
            // Revert optimistic update if API call fails
            setStory(prevStory => prevStory ? { ...prevStory, votes: prevStory.votes - vote } : null);
        }
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
    <div className="flex justify-center items-center mt-10 text-gray-500 gap-3">
      <div className="w-5 h-5 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      <p>Loading story...</p>
    </div>
  );
}
   return (
        <Suspense fallback={<LoadingSpinner message="Loading story details..." />}>

  <main className="min-h-screen bg-white text-black">
    <Navbar />

    {/* Hero Section with Votes Inside */}
    <div
      className="w-full min-h-[420px] flex items-end bg-cover bg-center relative px-4 sm:px-10"
      style={{
        backgroundImage: `url(${story.imageUrl})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

      {/* Content Container */}
      <div className="relative z-10 flex items-end gap-6 py-10 max-w-7xl w-full">
        {/* Vote Box */}
        <div className="flex flex-col items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-4 rounded-lg shadow-md">
          <ArrowBigUp
            size={28}
            className="cursor-pointer text-black hover:scale-110 transition-transform"
            onClick={() => handleUpdateStory(1)}
          />
          <span className="text-lg font-semibold">{story.votes}</span>
          <ArrowBigDown
            size={28}
            className="cursor-pointer text-black hover:scale-110 transition-transform"
            onClick={() => handleUpdateStory(-1)}
          />
        </div>

        {/* Title + Author */}
        <div className="text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">{story.title}</h1>
          <h2 className="text-lg md:text-2xl pl-1">
            by{" "}
            {story.author
              ? typeof story.author === "string"
                ? story.author
                : story.author.name
              : "Unknown"}
          </h2>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div className="mt-10 h-px bg-gray-300 my-4 max-w-screen-2xl mx-auto" />

    {/* Content stays untouched */}
    <div className="text-black p-10">
      <ContentComponent id={id} story={story.content} title={story.title} />
    </div>
  </main>
      </Suspense>

);
}

