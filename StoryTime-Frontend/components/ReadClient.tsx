import { Navbar } from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStory } from "@/api/storyApi";
import ReactMarkdown from 'react-markdown';

import { 
    Book, 
    Settings, 
    Volume2, 
    VolumeX, 
    ArrowLeft,
    Bookmark,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    Type,
    Moon,
    Sun,
    
    Maximize,
    Minimize
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter } from "@/types";
import { paginateContent, estimateReadingTime } from "@/utils/pagination";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ReadPage() {
    const searchParams = useSearchParams();
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [paginatedContent, setPaginatedContent] = useState<string[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [isReading, setIsReading] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [fontSize, setFontSize] = useState(16);
    const [showSettings, setShowSettings] = useState(false);
    const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [lineHeight, setLineHeight] = useState(1.6);
    const [fontFamily, setFontFamily] = useState('serif');
    
    const title = searchParams.get("title");
    const id = searchParams.get("id");
    const chapId = searchParams.get("chapId");

    useEffect(() => {
        if (!id || chapId === null) return;

        const fetchData = async () => {
            try {
                const storyData = await getStory(id as string);
                const chapterIndex = parseInt(chapId);
                const chapterData = storyData.content[chapterIndex];
                setChapter(chapterData);
                console.log("Fetched chapter data:", chapterData.content);
                const pages = paginateContent(chapterData.content, { wordsPerPage: 300 });
                console.log("paginated content:", pages);
                setPaginatedContent(pages);
                setCurrentPageIndex(0);
            } catch (error) {
                console.error("Error fetching story:", error);
            }
        };

        fetchData();
    }, [id, chapId]);
    
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                goToNextPage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPreviousPage();
            } else if (e.key === 'Escape') {
                setShowSettings(false);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentPageIndex, paginatedContent.length]);

    if (!chapter) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
                    <LoadingSpinner />
                </div>
            </>
        );
    }

    const handleReadOut = () => {
        if (!paginatedContent[currentPageIndex]) return;

        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
        } else {
            const utterance = new SpeechSynthesisUtterance(paginatedContent[currentPageIndex]);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.lang = 'en-US';

            window.speechSynthesis.speak(utterance);
            setIsReading(true);

            utterance.onend = () => setIsReading(false);
        }
    };

    const goToNextPage = () => {
        if (currentPageIndex < paginatedContent.length - 1) {
            setPageDirection('next');
            setCurrentPageIndex(prev => prev + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPageIndex > 0) {
            setPageDirection('prev');
            setCurrentPageIndex(prev => prev - 1);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const pageVariants = {
        enter: (direction: string) => ({
            x: direction === 'next' ? 300 : -300,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: string) => ({
            x: direction === 'next' ? -300 : 300,
            opacity: 0,
            scale: 0.95,
        }),
    };

    const currentContent = paginatedContent[currentPageIndex];
    const totalPages = paginatedContent.length;
    const readingTime = currentContent ? estimateReadingTime(currentContent) : 0;
    const progressPercentage = totalPages > 0 ? ((currentPageIndex + 1) / totalPages) * 100 : 0;

    const themeClasses = isDarkMode
        ? 'bg-gray-900 text-gray-100'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900';

    const cardThemeClasses = isDarkMode
        ? 'bg-gray-800 border-gray-700'
        : 'bg-white border-gray-200';

    return (
        <main className={`min-h-screen transition-all duration-500 ${themeClasses}`}>
            <Navbar />
            
            {/* Floating Back Button */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="fixed top-20 left-4 z-40"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.history.back()}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
                        isDarkMode 
                            ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/80' 
                            : 'bg-white/80 text-gray-700 hover:bg-gray-50/80'
                    } border border-white/20`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back</span>
                </motion.button>
            </motion.div>

            {/* Floating Controls */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="fixed top-20 right-4 z-40 flex flex-col gap-3"
            >
                {/* Settings Toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
                        showSettings
                            ? 'bg-gray-600 text-white'
                            : isDarkMode 
                                ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/80' 
                                : 'bg-white/80 text-gray-700 hover:bg-gray-50/80'
                    } border border-white/20`}
                >
                    <Settings className="w-5 h-5" />
                </motion.button>

                {/* Voice Control */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReadOut}
                    className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
                        isReading
                            ? 'bg-red-500 text-white'
                            : isDarkMode 
                                ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/80' 
                                : 'bg-white/80 text-gray-700 hover:bg-gray-50/80'
                    } border border-white/20`}
                >
                    {isReading ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </motion.button>

                {/* Bookmark */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
                        isBookmarked
                            ? 'bg-yellow-500 text-white'
                            : isDarkMode 
                                ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/80' 
                                : 'bg-white/80 text-gray-700 hover:bg-gray-50/80'
                    } border border-white/20`}
                >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>

                {/* Fullscreen */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullscreen}
                    className={`p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 ${
                        isDarkMode 
                            ? 'bg-gray-800/80 text-gray-200 hover:bg-gray-700/80' 
                            : 'bg-white/80 text-gray-700 hover:bg-gray-50/80'
                    } border border-white/20`}
                >
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </motion.button>
            </motion.div>

            {/* Settings Panel */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ type: "spring", damping: 20 }}
                        className="fixed top-20 right-20 z-50 w-80"
                    >
                        <div className={`p-6 rounded-3xl shadow-2xl backdrop-blur-xl border ${cardThemeClasses}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Reading Settings
                                </h3>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Theme Toggle */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 font-medium">
                                        {isDarkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                        Dark Mode
                                    </label>
                                    <button
                                        onClick={() => setIsDarkMode(!isDarkMode)}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${
                                            isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform top-0.5 ${
                                            isDarkMode ? 'translate-x-6' : 'translate-x-0.5'
                                        }`} />
                                    </button>
                                </div>

                                {/* Font Size */}
                                <div>
                                    <label className="flex items-center gap-2 font-medium mb-3">
                                        <Type className="w-4 h-4" />
                                        Font Size: {fontSize}px
                                    </label>
                                    <input
                                        type="range"
                                        min="12"
                                        max="24"
                                        value={fontSize}
                                        onChange={(e) => setFontSize(Number(e.target.value))}
                                        className="w-full accent-gray-600"
                                    />
                                </div>

                                {/* Line Height */}
                                <div>
                                    <label className="flex items-center gap-2 font-medium mb-3">
                                        <Eye className="w-4 h-4" />
                                        Line Height: {lineHeight}
                                    </label>
                                    <input
                                        type="range"
                                        min="1.2"
                                        max="2.0"
                                        step="0.1"
                                        value={lineHeight}
                                        onChange={(e) => setLineHeight(Number(e.target.value))}
                                        className="w-full accent-gray-600"
                                    />
                                </div>

                                {/* Font Family */}
                                <div>
                                    <label className="flex items-center gap-2 font-medium mb-3">
                                        <Type className="w-4 h-4" />
                                        Font Family
                                    </label>
                                    <select
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                        className={`w-full p-2 rounded-lg border ${
                                            isDarkMode 
                                                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                                                : 'bg-white border-gray-300 text-gray-900'
                                        }`}
                                    >
                                        <option value="serif">Serif</option>
                                        <option value="sans-serif">Sans Serif</option>
                                        <option value="monospace">Monospace</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-30">
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progressPercentage / 100 }}
                    transition={{ duration: 0.3 }}
                    className="h-1 bg-gradient-to-r from-gray-600 to-gray-800 origin-left"
                />
            </div>

            {chapter && paginatedContent.length > 0 ? (
                <section className="max-w-5xl mx-auto px-4 py-8 pt-24">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.3 }}
                                className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl"
                            >
                                <Book className="text-2xl text-white" />
                            </motion.div>
                            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                                {title}
                            </h1>
                        </div>
                        <h2 className={`text-xl font-medium mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {chapter.title}
                        </h2>

                        {/* Reading Stats */}
                        <div className="flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{readingTime} min read</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Book className="w-4 h-4" />
                                <span>Page {currentPageIndex + 1} of {totalPages}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye className="w-4 h-4" />
                                <span>{Math.round(progressPercentage)}% complete</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Book Container */}
                    <div className="relative max-w-4xl mx-auto">
                        {/* Page Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className={`relative shadow-2xl rounded-3xl overflow-hidden border-2 ${cardThemeClasses}`}
                            style={{ minHeight: '700px' }}
                        >
                            {/* Page Content */}
                            <div className="relative h-full">
                                <AnimatePresence mode="wait" custom={pageDirection}>
                                    <motion.div
                                        key={currentPageIndex}
                                        custom={pageDirection}
                                        variants={pageVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut"
                                        }}
                                        className="relative p-8 lg:p-12 h-full flex items-center"
                                    >
                                        <div 
                                            className="prose prose-lg max-w-none w-full"
                                            style={{
                                                fontSize: `${fontSize}px`,
                                                lineHeight: lineHeight,
                                                fontFamily: fontFamily,
                                                color: isDarkMode ? '#e5e7eb' : '#1f2937'
                                            }}
                                        >
                                            <ReactMarkdown
                                                components={{
                                                    h1: ({children}) => <h1 className="text-3xl font-bold mb-6">{children}</h1>,
                                                    h2: ({children}) => <h2 className="text-2xl font-semibold mb-4">{children}</h2>,
                                                    h3: ({children}) => <h3 className="text-xl font-medium mb-3">{children}</h3>,
                                                    p: ({children}) => <p className="mb-4 leading-relaxed">{children}</p>,
                                                    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                                                    em: ({children}) => <em className="italic">{children}</em>,
                                                }}
                                            >
                                                {currentContent}
                                            </ReactMarkdown>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Invisible Navigation Areas */}
                                {currentPageIndex > 0 && (
                                    <button
                                        onClick={goToPreviousPage}
                                        className="absolute left-0 top-0 w-1/4 h-full bg-transparent hover:bg-black/5 transition-colors duration-200 flex items-center justify-start pl-4 group"
                                        aria-label="Previous page"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="p-2 rounded-full bg-black/10 backdrop-blur-sm"
                                        >
                                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                                        </motion.div>
                                    </button>
                                )}

                                {currentPageIndex < totalPages - 1 && (
                                    <button
                                        onClick={goToNextPage}
                                        className="absolute right-0 top-0 w-1/4 h-full bg-transparent hover:bg-black/5 transition-colors duration-200 flex items-center justify-end pr-4 group"
                                        aria-label="Next page"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="p-2 rounded-full bg-black/10 backdrop-blur-sm"
                                        >
                                            <ChevronRight className="w-5 h-5 text-gray-600" />
                                        </motion.div>
                                    </button>
                                )}
                            </div>

                            {/* Page Footer */}
                            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${
                                isDarkMode 
                                    ? 'from-gray-800 to-transparent' 
                                    : 'from-white to-transparent'
                            } p-6`}>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        {readingTime} min read
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Book className="w-4 h-4" />
                                        Page {currentPageIndex + 1} of {totalPages}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Navigation Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex justify-between items-center mt-8"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToPreviousPage}
                                disabled={currentPageIndex === 0}
                                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </motion.button>

                            {/* Page Indicator */}
                            <div className="flex items-center gap-2">
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 7) {
                                        pageNum = i;
                                    } else if (currentPageIndex < 3) {
                                        pageNum = i;
                                    } else if (currentPageIndex >= totalPages - 3) {
                                        pageNum = totalPages - 7 + i;
                                    } else {
                                        pageNum = currentPageIndex - 3 + i;
                                    }

                                    return (
                                        <motion.button
                                            key={`page-${i}`}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => {
                                                setPageDirection(pageNum > currentPageIndex ? 'next' : 'prev');
                                                setCurrentPageIndex(pageNum);
                                            }}
                                            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                pageNum === currentPageIndex
                                                    ? 'bg-gradient-to-r from-gray-600 to-gray-800 text-white shadow-lg'
                                                    : isDarkMode
                                                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                        >
                                            {pageNum + 1}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={goToNextPage}
                                disabled={currentPageIndex === totalPages - 1}
                                className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-600 to-gray-800 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                            >
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Reading Instructions */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-center mt-8"
                    >
                        <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-2xl ${
                            isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                        } backdrop-blur-sm border border-white/20 text-sm`}>
                            <span>Use arrow keys or spacebar to navigate</span>
                            <span className="text-gray-400">•</span>
                            <span>Click page edges to turn pages</span>
                            <span className="text-gray-400">•</span>
                            <span>Press Esc to close settings</span>
                        </div>
                    </motion.div>
                </section>
            ) : (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 mx-auto mb-6"
                        >
                            <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                                <Book className="text-2xl text-white" />
                            </div>
                        </motion.div>
                        <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Loading chapter...
                        </p>
                    </motion.div>
                </div>
            )}
        </main>
    );
}