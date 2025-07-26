"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, Users, UserPlus } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getMyProfile, followUser, unfollowUser } from "@/api/profile";
import { toast } from "sonner";
import type { User } from "@/types";

interface AuthorsListProps {
    authors: User[];
}

export default function AuthorsList({ authors }: AuthorsListProps) {
    const router = useRouter();
    const [currentUserFollowing, setCurrentUserFollowing] = useState<string[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboardAndProfile = async () => {
            try {
                const myProfileData = await getMyProfile();
                setCurrentUserFollowing(myProfileData.following?.map(id => id.toString()) || []);
                setCurrentUserId(myProfileData._id);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            }
        };
        fetchLeaderboardAndProfile();
    }, []);
    
    const handleViewProfile = (authorId: string) => {
        router.push(`/profile/${authorId}`);
    };

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
                toast.success(`Unfollowed ${authors.find(a => a._id === authorId)?.name}`);
            } else {
                await followUser(authorId);
                setCurrentUserFollowing(prev => [...prev, authorId]);
                toast.success(`Following ${authors.find(a => a._id === authorId)?.name}`);
            }
        } catch (error) {
            console.error("Error toggling follow status:", error);
            toast.error("Failed to update follow status.");
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
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        visible: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    if (authors.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-md border border-white/30 p-12 rounded-3xl shadow-xl"
            >
                <div className="w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                    <Users className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No authors found</h3>
                <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                    Try adjusting your search terms to discover amazing writers.
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8"
        >
            {authors.map((author, index) => (
                <motion.div
                    key={author._id}
                    variants={itemVariants}
                    whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                    className="group"
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 p-6 text-center">
                        {/* Profile Image */}
                        <div className="relative w-24 h-24 mx-auto mb-4">
                            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-0.5 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                                    <Image
                                        src={author.profilePicture || "/default-user.png"}
                                        alt={author.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                            
                            {/* Status Badge */}
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full border-2 border-white shadow-lg"></div>
                        </div>

                        {/* Author Info */}
                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                            {author.name}
                        </h2>
                        
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4 min-h-[4rem]">
                            {author.bio || "Passionate storyteller sharing amazing narratives."}
                        </p>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-gray-800">
                                    {author.contributions ? author.contributions.reduce((sum, c) => sum + c.score, 0) : 0}
                                </div>
                                <div className="text-xs text-gray-600">Contributions</div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-3">
                                <div className="text-lg font-bold text-gray-800">
                                    {author.followers ? author.followers.length : 0}
                                </div>
                                <div className="text-xs text-gray-600">Followers</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => handleViewProfile(author._id)}
                                className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Profile
                            </Button>
                            
                            <Button
                                size="sm"
                                onClick={() => handleFollowToggle(author._id)}
                                disabled={author._id === currentUserId}
                                className={`w-full font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                                    currentUserFollowing.includes(author._id)
                                        ? "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
                                        : "bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white"
                                }`}
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                {currentUserFollowing.includes(author._id) ? "Following" : "Follow"}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}