// Leaderboard.tsx - Fixed with Gray Theme
"use client";

import { useEffect, useState } from "react";
import { getLeaderBoard } from "@/api/storyApi";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Trophy, Medal, Award, UserPlus, Search, Star, Crown } from "lucide-react";
import { followUser, unfollowUser, getMyProfile } from "@/api/profile";
import { toast } from "sonner";
import { motion } from "framer-motion";

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
          getMyProfile(),
        ]);
        setLeaderboard(leaderboardData);
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

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 1:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case 2:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      default:
        return <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />;
    }
  };

  const getRankGradient = (index: number) => {
    switch (index) {
      case 0:
        return "from-gray-500 to-gray-700"; // Champion - Darker gray
      case 1:
        return "from-gray-400 to-gray-600"; // Runner-up - Medium gray
      case 2:
        return "from-gray-300 to-gray-500"; // Third - Lighter gray
      default:
        return "from-gray-600 to-gray-800"; // Default - Standard gray
    }
  };

  const getRankBadgeText = (index: number) => {
    switch (index) {
      case 0:
        return "👑 Champion";
      case 1:
        return "🥈 Runner-up";
      case 2:
        return "🥉 Third Place";
      default:
        return "Contributor";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 overflow-hidden">
      {/* Header Section - Gray Theme */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-8 px-4"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-2.5 sm:p-3 rounded-full shadow-lg">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent text-center">
            Contributor Leaderboard
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
          Top contributors to {title} ranked by their amazing contributions
        </p>
      </motion.div>

      {/* Leaderboard Content */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4"
      >
        {leaderboard.length === 0 ? (
          /* Empty State - Gray Theme */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-md border border-white/30 p-6 sm:p-10 rounded-3xl shadow-xl"
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No contributors yet!</h3>
            <p className="text-gray-600 mb-6 max-w-md text-sm sm:text-base leading-relaxed">
              The leaderboard is currently empty. Be the first to share your stories and climb to the top!
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleNavAuthor} 
                className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Contributing
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          /* Leaderboard Entries - Gray Theme */
          <div className="space-y-4 sm:space-y-6">
            {leaderboard.map((entry, index) => (
              <motion.div
                key={entry.userId}
                variants={itemVariants}
                transition={{ 
                  duration: 0.4,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
                  {/* Background Pattern - Gray Theme */}
                  <div className="absolute inset-0 opacity-5">
                  <div className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(index)}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl z-0`}></div>
                    {index < 3 && (
                      <div className="absolute top-4 right-4">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${getRankGradient(index)} opacity-20`}></div>
                      </div>
                    )}
                  </div>

                  <div className="relative p-4 sm:p-6 z-10">
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      
                      {/* Rank & Avatar Section */}
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        {/* Rank Badge - Gray Theme */}
                        <div className={`relative flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${getRankGradient(index)} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                          <div className="flex flex-col items-center">
                            {getRankIcon(index)}
                            <span className="text-white font-bold text-xs sm:text-sm mt-1">
                              #{index + 1}
                            </span>
                          </div>
                          
                          {/* Special Badge for #1 */}
                          {index === 0 && (
                            <div className="absolute -top-2 -right-1 w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Profile Picture - Gray Theme */}
                        <div className="relative">
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${getRankGradient(index)} p-0.5 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                              <Image
                                src={entry.profilePicture || "/default-user.png"}
                                alt={entry.name}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          
                          {/* Status Dot - Gray Theme */}
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gray-600 rounded-full border-2 border-white shadow-lg"></div>
                        </div>

                        {/* User Info - Mobile Layout */}
                        <div className="flex-1 min-w-0 sm:hidden">
                          <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                            {entry.name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-gray-500 fill-gray-500" />
                            <span className="font-medium">{entry.totalScore} Contribution{entry.totalScore !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>

                      {/* Desktop User Info */}
                      <div className="hidden sm:block flex-1 min-w-0">
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                          {entry.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-gray-500 fill-gray-500" />
                            <span className="text-lg font-semibold text-gray-700">
                              {entry.totalScore}
                            </span>
                            <span className="text-gray-600">
                              Contribution{entry.totalScore !== 1 ? "s" : ""}
                            </span>
                          </div>
                          
                          {/* Achievement Badge - Gray Theme */}
                          {index < 3 && (
                            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRankGradient(index)} text-white text-xs font-bold shadow-md`}>
                              {getRankBadgeText(index)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Gray Theme */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {/* Follow Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFollowToggle(entry.userId)}
                          disabled={entry.userId === currentUserId}
                          className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            currentUserFollowing.includes(entry.userId)
                              ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                              : "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
                          }`}
                        >
                          <UserPlus className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            {currentUserFollowing.includes(entry.userId) ? "Following" : "Follow"}
                          </span>
                        </motion.button>

                        {/* Profile Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleNavAuthor}
                          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl text-sm font-medium"
                        >
                          <Search className="w-4 h-4" />
                          <span className="hidden sm:inline">Profile</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Mobile Score Display */}
                    <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-800">{entry.totalScore}</div>
                          <div className="text-xs text-gray-600">Contributions</div>
                        </div>
                        {index < 3 && (
                          <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getRankGradient(index)} text-white text-xs font-bold`}>
                            {getRankBadgeText(index).replace("👑 ", "").replace("🥈 ", "").replace("🥉 ", "")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Glow Effect - Gray Theme */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getRankGradient(index)}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl sm:rounded-3xl`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Summary Footer - Gray Theme */}
      {leaderboard.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 sm:mt-12 text-center px-4"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-white/30 shadow-xl">
            <div className="grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-center sm:gap-8">
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-gray-700">{leaderboard.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Contributors</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-3xl font-bold text-gray-800">
                  {leaderboard.reduce((acc, entry) => acc + entry.totalScore, 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Total Contributions</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}