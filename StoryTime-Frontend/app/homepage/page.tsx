"use client"

import { Button } from "@/components/ui/button"
import ExplorePage from "../../components/exploreComponent"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation";
import { Typewriter } from 'react-simple-typewriter';
import { motion } from "framer-motion";
import { BookOpen, PenTool, Sparkles, ArrowRight, Users, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNavCreate = () => router.push("/create");
    if (!mounted) {
        return (
            <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
                <Navbar />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-16 lg:pt-23 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 font-sans overflow-hidden">
            <Navbar />

            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
                {/* Enhanced Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-gray-100/40 to-gray-200/30 rounded-full blur-2xl"></div>
                    </div>

                    <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12 lg:gap-16">
                        {/* Left Content */}
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1 text-center lg:text-left"
                        >
                            {/* Title with Enhanced Styling */}
                            <div className="mb-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="flex items-center justify-center lg:justify-start gap-3 mb-4"
                                >
                                    <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl">
                                        <Sparkles className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                        Creative Writing Platform
                                    </span>
                                </motion.div>

                                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 mb-6">
                                    <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                                        <Typewriter
                                            words={['Welcome to StoryTime', 'Start Your Epic Journey', 'Let Your Words Soar', 'Create Amazing Stories']}
                                            loop={true}
                                            cursor
                                            cursorStyle="|"
                                            typeSpeed={100}
                                            deleteSpeed={60}
                                            delaySpeed={2000}
                                        />
                                    </span>
                                </h1>
                            </div>

                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed"
                            >
                                Join thousands of writers in creating collaborative stories that inspire, entertain, and connect communities worldwide.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <Button
                                    onClick={handleNavCreate}
                                    size="lg"
                                    className="group relative px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                                    <span className="relative flex items-center gap-2">
                                        <PenTool className="w-5 h-5" />
                                        Start Writing Now
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
                                    onClick={() => router.push("/explore")}
                                >
                                    <BookOpen className="w-5 h-5 mr-2" />
                                    Explore Stories
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Right Visual Element */}
                        <motion.div 
                            initial={{ opacity: 0, x: 50, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex-1 flex justify-center lg:justify-end"
                        >
                            <div className="relative">
                                {/* Main Card */}
                                <div className="relative w-80 h-96 sm:w-96 sm:h-[28rem] bg-white/80 backdrop-blur-md rounded-3xl border border-white/30 shadow-2xl p-8 overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-600 to-gray-800"></div>
                                        <svg className="absolute bottom-0 right-0 w-32 h-32" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="40" fill="currentColor" className="text-gray-200" />
                                        </svg>
                                    </div>

                                    {/* Content */}
                                    <div className="relative h-full flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl">
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600">Featured Story</span>
                                            </div>
                                            
                                            <h3 className="text-xl font-bold text-gray-800 mb-3">The Chronicles of Tomorrow</h3>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                                In a world where words hold magic, a young writer discovers their power to shape reality through storytelling...
                                            </p>
                                            
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Users className="w-3 h-3" />
                                                <span>12 Collaborators</span>
                                                <span>•</span>
                                                <Star className="w-3 h-3" />
                                                <span>4.8 Rating</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className={`h-2 bg-gray-200 rounded-full overflow-hidden`}>
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.random() * 60 + 20}%` }}
                                                        transition={{ duration: 1, delay: i * 0.2 + 1 }}
                                                        className="h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <motion.div 
                                    animate={{ y: [-10, 10, -10] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center shadow-xl"
                                >
                                    <PenTool className="w-8 h-8 text-white" />
                                </motion.div>

                                <motion.div 
                                    animate={{ y: [10, -10, 10] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                    className="absolute -bottom-6 -left-6 w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30"
                                >
                                    <Sparkles className="w-10 h-10 text-gray-700" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

               

                {/* Enhanced Explore Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2 }}
                    className="pt-6"
                >
                    <ExplorePage />
                </motion.div>
            </section>
        </main>
    );
}