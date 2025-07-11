// StoryTime-Frontend/components/Leaderboard.tsx
"use client";

import { useEffect, useState } from "react";
import { getLeaderBoard } from "@/api/storyApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CardHorizontal } from "@/components/ui/card";
import Image from "next/image";
import { FaMedal, FaUserPlus, FaSearch } from "react-icons/fa";
import { HiOutlineStar } from "react-icons/hi";
import { followUser, unfollowUser, getMyProfile } from "@/api/profile"; // Import follow/unfollow and getMyProfile
import { toast } from "sonner";

interface LeaderboardEntry {
  userId: string;
  name: string;
  profilePicture?: string;
  totalScore: number;
}

export default function LeaderboardList({id, title }: { id:string, title: string }) {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserFollowing, setCurrentUserFollowing] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const handleNavAuthor = () => {
       router.push(`/book/${id}`);

  };

  useEffect(() => {
    const fetchLeaderboardAndProfile = async () => {
      try {
        const [leaderboardData, myProfileData] = await Promise.all([
          getLeaderBoard(title),
          getMyProfile(), // Fetch current user's profile to get following list
        ]);
        setLeaderboard(leaderboardData)
      
        console.log("Leaderboard data received in frontend:", leaderboardData.length);

        setCurrentUserFollowing(myProfileData.following?.map(id => id.toString()) || []);
        setCurrentUserId(myProfileData._id);
      } catch (err) {
        console.error("Failed to fetch leaderboard or profile", err);
      }
    };
    fetchLeaderboardAndProfile();
  }, [title]);

  const handleFollowToggle = async (authorId: string) => {
    if (!currentUserId) {
      toast.error("Please log in to follow users.");
      return;
    }
    if (authorId === currentUserId) {
      toast.info("You cannot follow yourself.");
      return;
    }

    try {
      if (currentUserFollowing.includes(authorId)) {
        await unfollowUser(authorId);
        setCurrentUserFollowing(prev => prev.filter(id => id !== authorId));
        toast.success(`Unfollowed ${leaderboard.find(a => a.userId === authorId)?.name}`);
      } else {
        await followUser(authorId);
        setCurrentUserFollowing(prev => [...prev, authorId]);
        toast.success(`Following ${leaderboard.find(a => a.userId === authorId)?.name}`);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      toast.error("Failed to update follow status.");
    }
  };


return (
  <div className="grid gap-6">
    {leaderboard.length === 0 ? (
      <div className="flex flex-col items-center justify-center text-center bg-white p-10 rounded-2xl shadow-md border border-gray-200">
        <Image
          src="/leaderboard.svg"
          alt="No contributors yet"
          width={200}
          height={200}
          className="mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No contributors yet!</h2>
        <p className="text-gray-600 mb-4 max-w-md">
          The leaderboard is currently empty. Be the first to share your stories and climb to the top!
        </p>
        <Button onClick={handleNavAuthor} className="bg-black hover:bg-gray-900 text-white">
          Start Contributing
        </Button>
      </div>
    ) : (
      leaderboard.map((entry, index) => (
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
            <Button
              size="sm"
              onClick={() => handleFollowToggle(entry.userId)}
              disabled={entry.userId === currentUserId} // Disable if it's the current user
              className={`${
                currentUserFollowing.includes(entry.userId)
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-black hover:bg-gray-900"
              } text-white flex items-center gap-2`}
            >
              <FaUserPlus /> {currentUserFollowing.includes(entry.userId) ? "Following" : "Follow"}
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

          
          {/* ...existing content... */}
        </CardHorizontal>
      ))
    )}
  </div>
);
}