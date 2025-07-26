"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, BookOpen, Users } from "lucide-react";
import { getStories } from "@/api/storyApi";
import { getAuthors } from "@/api/profile";
import type { Story, User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaFilter } from "react-icons/fa";
import StoriesList from "./StoriesList";
import AuthorsList from "./AuthorsList";

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState<"stories" | "authors">("stories");
    const [stories, setStories] = useState<Story[]>([]);
    const [authors, setAuthors] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'latest' | 'oldest' | 'top'>('latest');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (activeTab === "stories") {
                    const storiesData = await getStories(search, sort);
                    setStories(storiesData);
                } else {
                    const authorsData = await getAuthors();
                    setAuthors(authorsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, search, sort]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-4 py-6 md:px-6 lg:px-8">
            {/* Enhanced Navigation Section */}
            <motion.nav 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 p-6 mb-8 shadow-xl"
            >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Title and Tab Toggle */}
                    <div className="flex flex-col md:flex-row md:items-center gap-6 w-full lg:w-auto">
                        {/* Enhanced Title */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl">
                                <Search className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                Explore
                            </h1>
                        </motion.div>

                        {/* Enhanced Tab Toggle */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-gray-100 p-1 rounded-2xl shadow-inner"
                        >
                            <div className="flex">
                                {[
                                    { key: "stories", label: "Stories", icon: BookOpen },
                                    { key: "authors", label: "Authors", icon: Users }
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveTab(tab.key as "stories" | "authors")}
                                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                                activeTab === tab.key
                                                    ? "bg-white text-gray-900 shadow-lg"
                                                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Controls */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto"
                    >
                        {/* Sort Toggle */}
                        <div className="bg-gray-100 p-1 rounded-xl shadow-inner">
                            <div className="flex">
                                {[
                                    { key: "latest", label: "Latest" },
                                    { key: "oldest", label: "Oldest" },
                                    { key: "top", label: "Top" }
                                ].map((sortOption) => (
                                    <button
                                        key={sortOption.key}
                                        onClick={() => setSort(sortOption.key as "latest" | "oldest" | "top")}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                            sort === sortOption.key
                                                ? "bg-white text-gray-900 shadow-md"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                                        }`}
                                    >
                                        {sortOption.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex-1 sm:w-80">
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <Input
                                    placeholder="Search stories and authors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-12 pr-4 py-3 border-gray-300 bg-white/80 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-gray-500 shadow-lg"
                                />
                            </div>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className="p-3 border-gray-300 bg-white/80 backdrop-blur-sm rounded-xl hover:bg-gray-50 shadow-lg"
                            >
                                <FaFilter size={16} className="text-gray-600" />
                            </Button>
                        </div>
                    </motion.div>
                    </div>
                
            </motion.nav>

            {/* Enhanced Content Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mb-6"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    {activeTab === "stories" ? (
                                        <BookOpen className="w-6 h-6 text-gray-600" />
                                    ) : (
                                        <Users className="w-6 h-6 text-gray-600" />
                                    )}
                                </div>
                            </div>
                            <p className="text-gray-600 text-lg font-medium">
                                Discovering amazing {activeTab}...
                            </p>
                        </motion.div>
                    ) : activeTab === "stories" ? (
                        <StoriesList stories={stories} />
                    ) : (
                        <AuthorsList authors={authors} />
                    )}
                </AnimatePresence>
            </motion.section>
        </main>
    );
}