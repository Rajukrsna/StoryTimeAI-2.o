import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CardHorizontal } from "./ui/card";
import Image from "next/image";
import { getUserStories } from "@/api/storyApi"; 
import {approveStory,rejectStory} from "@/api/storyApi";
import { toast } from "sonner";
import type { Story, User, Chapter,Author ,PendingChapter } from "@/types"; // Adjust the path as needed
export default function UserStories() {
const [stories, setStories] = useState<Story[]>([]);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedChapter, setSelectedChapter] = useState<{ title: string; content: string } | null>(null);
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const storiesData = await getUserStories();
        if (storiesData) {
          setStories(storiesData);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchStories();
  }, []);
  const handleApprove = async (storyId: string, chapterIndex: number, title: string) => {
  try {
    await approveStory(storyId, chapterIndex);
    toast.success("Chapter Approved!");
    const updatedStories = await getUserStories();
    setStories(updatedStories);
  } catch (err) {
    console.error(err);
    alert("Error approving chapter");
  }
};


const handleReject = async (storyId: string, chapterIndex: number) => {
  try {
    await rejectStory(storyId, chapterIndex)
    toast.success("Chapter Rejected!");
    const updatedStories = await getUserStories();
    setStories(updatedStories);
  } catch (err) {
    console.error(err);
    alert("Error rejecting chapter");
  }
};

return (
  <>
    <div className="grid gap-6">
      {stories.map((story) => {
        const wordCount = story.content?.reduce(
          (acc, chapter) => acc + chapter.content.split(" ").length,
          0
        );

        return (
          <CardHorizontal
  key={story._id}
  className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-gray-200 bg-white rounded-xl shadow-sm hover:shadow-md transition"
>
  {/* Text Info */}
  <div className="flex-1 pr-0 sm:pr-4">
    <p className="text-sm text-gray-400">Genre: Unknown</p>
    <h2 className="text-2xl font-bold text-black mt-1 mb-1">{story.title}</h2>
    <p className="text-sm text-gray-600">
      {wordCount.toLocaleString()} words • {story.content.length} chapters
    </p>
    <p className="text-sm text-gray-700 mt-1">
      by <span className="font-medium">{story.author.name}</span>
    </p>

    <div className="flex flex-wrap gap-2 mt-4">
      <Button className="bg-black text-white hover:bg-gray-900">Edit</Button>
      <Button variant="destructive">Delete</Button>
    </div>

    {/* Pending Chapters Section */}
    {story.pendingChapters?.length > 0 && (
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-3">
          Pending Chapters
        </h3>
        {story.pendingChapters.map((chapter, index) => (
          <div key={chapter._id} className="mb-4 pb-3 border-b border-yellow-100">
            <h4 className="text-md font-medium text-black">{chapter.title}</h4>
            <p className="text-sm text-gray-600 mt-1 line-clamp-3">
              {chapter.content.slice(0, 150)}...
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant="secondary"
                onClick={() => handleApprove(story._id, index, story.title)}
              >
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleReject(story._id, index)}
              >
                Reject
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedChapter({
                    title: chapter.title,
                    content: chapter.content,
                  });
                  setIsModalOpen(true);
                }}
              >
                View Content
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Story Image */}
  <div className="w-full sm:w-48 h-48 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden relative">
    <Image
      src={story.imageUrl}
      alt={story.title}
      fill
      className="object-cover"
    />
  </div>
</CardHorizontal>

        );
      })}
    </div>

    {/* ✅ Modal content is now inside return */}
    {isModalOpen && selectedChapter && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
      <button
        className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
        onClick={() => setIsModalOpen(false)}
      >
        ✕
      </button>
      <h2 className="text-xl font-bold mb-4">{selectedChapter.title}</h2>
      <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
        {selectedChapter.content}
      </p>
    </div>
  </div>
)}

  </>
);

}