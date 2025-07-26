"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Calendar, Heart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import type { Story } from "@/types";

interface StoriesListProps {
    stories: Story[];
}

export default function StoriesList({ stories }: StoriesListProps) {
    const router = useRouter();
    
    const handleNavBook = (id: string) => {
        router.push(`/book/${id}`);
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

    if (stories.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center bg-white/80 backdrop-blur-md border border-white/30 p-12 rounded-3xl shadow-xl"
            >
                <div className="w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No stories found</h3>
                <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                    Try adjusting your search terms or explore different categories.
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
            {stories.map((story) => (
                <motion.div
                    key={story._id}
                    variants={itemVariants}
                    whileHover={{ 
                        y: -8, 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                    }}
                    className="group cursor-pointer"
                    onClick={() => handleNavBook(story._id)}
                >
                    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                        {/* Cover Image */}
                        <div className="relative w-full h-48 lg:h-56 overflow-hidden">
                            <Image
                                src={story.imageUrl || "/uploads/cover.jpg"}
                                alt={story.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Floating Stats */}
                            <div className="absolute top-4 right-4 flex items-center gap-2">
                                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                        <Eye className="w-3 h-3" />
                                        <span>{story.votes || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Title */}
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-gray-900 transition-colors">
                                {story.title}
                            </h2>

                            {/* Author */}
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                        {(story.author
                                            ? typeof story.author === "string"
                                                ? story.author
                                                : story.author.name
                                            : "Unknown").charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {story.author
                                            ? typeof story.author === "string"
                                                ? story.author
                                                : story.author.name
                                            : "Unknown"}
                                    </p>
                                    <p className="text-xs text-gray-500">Author</p>
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="text-sm text-gray-600 leading-relaxed line-clamp-3 mb-4">
                                <ReactMarkdown
                                    components={{
                                        p: ({ children }) => <p className="inline">{children}</p>,
                                        h1: ({ children }) => <span className="font-bold">{children}</span>,
                                        h2: ({ children }) => <span className="font-bold">{children}</span>,
                                        h3: ({ children }) => <span className="font-bold">{children}</span>,
                                    }}
                                >
                                    {story.content && story.content[0]?.content?.substring(0, 150) + "..." || "No preview available"}
                                </ReactMarkdown>
                            </div>

                            {/* Metadata */}
                            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <BookOpen className="w-3 h-3" />
                                        <span>{story.content?.length || 0} chapters</span>
                                    </div>
                                    {story.content[0].createdAt && (
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(story.content[0].createdAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{story.votes || 0}</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Button
                                className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleNavBook(story._id);
                                }}
                            >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Story
                            </Button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    );
}