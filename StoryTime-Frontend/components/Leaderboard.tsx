// LeaderboardList.tsx
"use client";

import { useEffect, useState } from "react";
import { getLeaderBoard } from "@/api/storyApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardHorizontal } from "@/components/ui/card";
import Image from "next/image";
import { FaMedal, FaUserPlus, FaSearch } from "react-icons/fa";
import { HiOutlineStar } from "react-icons/hi";

interface LeaderboardEntry {
  userId: string;
  name: string;
  profilePicture?: string;
  totalScore: number;
}

export default function LeaderboardList({ title }: { title: string }) {
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
