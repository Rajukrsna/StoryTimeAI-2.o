"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHorizontal } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, Heart, Pencil, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getStory } from "@/api/storyApi"
import {getLeaderBoard} from "@/api/storyApi"
import React, { Suspense } from 'react';
import {updateStory} from "@/api/storyApi"
import { FaBookOpen, FaUsers, FaRankingStar } from "react-icons/fa6"
import { MdCreate } from "react-icons/md"
import { HiOutlineSearch } from "react-icons/hi"
import {  ArrowRight } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { FaMedal, FaUserPlus, FaSearch } from "react-icons/fa";
import { HiOutlineStar } from "react-icons/hi";
import type { Story, User, Chapter } from "@/types"; // Adjust the path as needed



export default function ContentComponent({ id, story , title}: { id: string, story: Chapter[], title: string }) {
    const [activeTab, setActiveTab] = useState<"read" | "collab" | "leaderboard">("read");
    const router = useRouter();
   const chapters = story.map((chapter, index) => ({
    id: index ,
    title: chapter.title,
    content: chapter.content,
    createdBy: chapter.createdBy,
    createdAt: chapter.createdAt,
    summary: chapter.summary|| "No summary available",
    likes: chapter.likes,    
    liked: false, // Default or fetched separately
  }));
    

    const handleNavCollab = () => {
        router.push(`/collab?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}`)
    }

   return (
    <main className="min-h-screen px-6 py-6 bg-white font-sans">
      {/* Navigation */}
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        {/* Left: Title + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            Contents <span className="text-primary text-2xl">•</span>
          </h1>
          <ToggleGroup
            type="single"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "read" | "collab" | "leaderboard")
            }
            className="flex gap-2"
          >
            <ToggleGroupItem value="read" className="flex items-center gap-2">
              <FaBookOpen /> Read
            </ToggleGroupItem>
            <ToggleGroupItem
              value="collab"
              className="flex items-center gap-2"
            >
              <FaUsers /> Collab
            </ToggleGroupItem>
            <ToggleGroupItem
              value="leaderboard"
              className="flex items-center gap-2"
            >
              <FaRankingStar /> Leaderboard
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Right: Search + Buttons */}
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Input
              placeholder="Search"
              className="pl-10"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button variant="outline" size="icon" className="hover:bg-gray-100">
            <Filter size={18} />
          </Button>
          {activeTab === "collab" && (
            <Button
              onClick={handleNavCollab}
              className="flex items-center gap-2 bg-primary text-white hover:bg-primary/90 transition"
            >
              <MdCreate size={18} />
              Create Chapter
            </Button>
          )}
        </div>
      </nav>

      {/* Tab Content */}
      <section className="mt-8">
        <Suspense fallback={<div>Loading Chapters...</div>}>
          {activeTab === "read" && (
            <ChapterList title={title} chapters={chapters} id={id} />
          )}
        </Suspense>

        <Suspense fallback={<div>Loading Collaboration...</div>}>
          {activeTab === "collab" && <CollabList id={id} />}
        </Suspense>

        <Suspense fallback={<div>Loading Leaderboard...</div>}>
          {activeTab === "leaderboard" && <LeaderboardList title={title} />}
        </Suspense>
      </section>
    </main>
  )
}

function ChapterList({title,chapters:initialChapters,id }: {title: string, chapters: { id: number; title: string; content: string; summary: string, createdBy: string | User; createdAt: string ; likes: number; liked: boolean }[], id: string }) {
    const router = useRouter();
   const [chapters, setChapters] = useState(initialChapters); // keep local state

const handleNavRead = (chapId: number) => {
    router.push(
      `/read?id=${encodeURIComponent(id)}&title=${encodeURIComponent(title)}&chapId=${encodeURIComponent(chapId)}`
    );
  };
 const handleToggleLike = async (chapId: number) => {
    const updatedChapters = chapters.map((ch) => {
      if (ch.id === chapId ) {
        return {
          ...ch,
          likes: ch.liked ? ch.likes - 1 : ch.likes + 1,
          liked: !ch.liked
        };
      }
      return ch;
    });

    setChapters(updatedChapters); // update local state immediately

    try {
      await updateStory(id, {
        _id: id,
        title,
        content: updatedChapters,
        pendingChapters: [], 
        author: { id: "", name: "", bio: "", profileImage: "" }, 
        votes: 0,
        imageUrl: ""
      },
      {title: "",
        content: "",
        summary: "",  
        likes: 0,
        createdBy:"",
        createdAt: "",}
    );
    } catch (err) {
      console.error("Failed to update likes:", err);
    }
  };

 return (
  <div className="grid gap-6">
    {chapters.map((chapter) => (
      <CardHorizontal
        onClick={() => handleNavRead(chapter.id)}
        key={chapter.id}
        className="p-4 flex items-center justify-between rounded-xl border hover:shadow-md transition-all duration-300 group hover:-translate-y-[2px] cursor-pointer bg-white"
      >
        {/* Icon Box */}
        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-blue-100">
          <BookOpen className="w-[50%] h-[50%]  group-hover:scale-110 transition-transform" />
        </div>

        {/* Chapter Info */}
        <div className="flex-1 px-4">
          <h2 className="text-lg font-semibold group-hover:text-blue-600 transition-colors duration-300">
            {chapter.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Created By —{" "}
            {typeof chapter.createdBy === "string"
              ? chapter.createdBy
              : chapter.createdBy.name}
          </p>
        </div>

        {/* Like Section */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{chapter.likes}</span>
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              chapter.liked
                ? "text-red-500 fill-red-500"
                : "text-gray-400 hover:text-red-400"
            } hover:scale-110 active:scale-95`}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleLike(chapter.id);
            }}
          />
        </div>
      </CardHorizontal>
    ))}
  </div>
)
}

function CollabList({ id}: { id: string}) {
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

  if (!story) return <p>Loading...</p>;

 return (
  <div className="grid gap-6">
    {story.content.map((content) => (
      <CardHorizontal
        key={content._id}
        className="p-4 flex items-center justify-between gap-4 cursor-pointer rounded-xl border hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-white group"
      >
        {/* Left Icon Avatar */}
        <div className="w-16 h-16  rounded-full overflow-hidden flex items-center justify-center shadow-sm group-hover:bg-blue-200 transition">
          <Pencil className="w-6 h-6 group-hover:rotate-6 transition-transform" />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-2">
          <h2 className="text-lg font-semibold  flex items-center gap-2">
            <FaUserCircle className="text-gray-500" />{" "}
            {typeof content.createdBy === "object" && content.createdBy?.name}
          </h2>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
            <MdCalendarToday className="text-gray-400" />
            Contributed on <span className="font-medium ml-1">{content.title}</span>
          </p>
        </div>

        {/* Right Arrow */}
        <ArrowRight className="text-gray-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
      </CardHorizontal>
    ))}
  </div>
);
}

interface LeaderboardEntry {
  userId: string;
  name: string;
  profilePicture?: string;
  totalScore: number;
}


  function LeaderboardList({ title }: { title: string }) {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  const handleNavAuthor = () => {
    router.push("/author");
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await getLeaderBoard(title); // GET `/leaderboard/:title`
        setLeaderboard(res);
      } catch (err) {
        console.error("Failed to fetch leaderboard", err);
      }
    };
    fetchLeaderboard();
  }, [title]);

 return (
  <div className="grid gap-6">
    {leaderboard.map((entry, index) => (
      <CardHorizontal
        key={entry.userId}
        className="p-4 flex items-center gap-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow bg-white"
      >
        {/* Rank */}
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 text-lg font-bold">
          <FaMedal className="mr-1" />
          {index + 1}
        </div>

        {/* Profile Picture */}
        <div className="w-16 h-16 rounded-full overflow-hidden relative ring-2 ring-black-500">
          <Image
            src={entry.profilePicture || "/default-user.png"}
            alt={entry.name}
            fill
            className="object-cover rounded-full"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold truncate">{entry.name}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <HiOutlineStar className="text-yellow-600" />
            {entry.totalScore} Contribution{entry.totalScore !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <FaUserPlus /> Follow
          </Button>
          <Button
            onClick={handleNavAuthor}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FaSearch /> Search
          </Button>
        </div>
      </CardHorizontal>
    ))}
  </div>
);
}
