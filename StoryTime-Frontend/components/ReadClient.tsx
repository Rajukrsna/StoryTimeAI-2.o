import { Navbar } from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getStory } from "@/api/storyApi";
import ReactMarkdown from 'react-markdown';
import { FaVolumeUp, FaVolumeMute, FaChevronLeft, FaChevronRight, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { MdMenuBook, MdSettings } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import type { Chapter } from "@/types";
import { paginateContent, estimateReadingTime } from "@/utils/pagination";

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
        
        // Paginate the content
        const pages = paginateContent(chapterData.content, { wordsPerPage: 300 });
        setPaginatedContent(pages);
        setCurrentPageIndex(0);
      } catch (error) {
        console.error("Error fetching story:", error);
      }
    };

    fetchData();
  }, [id, chapId]);

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

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToNextPage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToPreviousPage();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPageIndex, paginatedContent.length]);

  const pageVariants = {
    enter: (direction: string) => ({
      x: direction === 'next' ? 300 : -300,
      opacity: 0,
      rotateY: direction === 'next' ? -15 : 15,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: string) => ({
      x: direction === 'next' ? -300 : 300,
      opacity: 0,
      rotateY: direction === 'next' ? 15 : -15,
    }),
  };

  const currentContent = paginatedContent[currentPageIndex];
  const totalPages = paginatedContent.length;
  const readingTime = currentContent ? estimateReadingTime(currentContent) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 text-gray-900 font-serif">
      <Navbar />

      {chapter && paginatedContent.length > 0 ? (
        <section className="max-w-4xl mx-auto px-4 py-8 relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <MdMenuBook className="text-3xl text-amber-700" />
              <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
            <h2 className="text-xl text-gray-600 font-medium mb-4">
              {chapter.title}
            </h2>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <button
                onClick={handleReadOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium shadow hover:bg-amber-700 transition"
              >
                {isReading ? <FaVolumeMute /> : <FaVolumeUp />}
                {isReading ? "Stop" : "Listen"}
              </button>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium shadow hover:bg-gray-700 transition"
              >
                {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
                Bookmark
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 text-white text-sm font-medium shadow hover:bg-gray-700 transition"
              >
                <MdSettings />
                Settings
              </button>
            </div>

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-white rounded-lg shadow-lg border"
                >
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium">Font Size:</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm">{fontSize}px</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Book Container */}
          <div className="relative">
            {/* Page Container */}
            <div 
              className="relative bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden"
              style={{ 
                minHeight: '600px',
                maxHeight: '70vh',
                perspective: '1000px'
              }}
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
                      duration: 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 p-8 overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div 
                      className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      <article className="prose prose-gray max-w-none leading-relaxed">
                        <ReactMarkdown>{currentContent}</ReactMarkdown>
                      </article>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Overlays */}
                {currentPageIndex > 0 && (
                  <button
                    onClick={goToPreviousPage}
                    className="absolute left-0 top-0 w-1/3 h-full bg-transparent hover:bg-black/5 transition-colors duration-200 flex items-center justify-start pl-4 group"
                    aria-label="Previous page"
                  >
                    <FaChevronLeft className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                )}

                {currentPageIndex < totalPages - 1 && (
                  <button
                    onClick={goToNextPage}
                    className="absolute right-0 top-0 w-1/3 h-full bg-transparent hover:bg-black/5 transition-colors duration-200 flex items-center justify-end pr-4 group"
                    aria-label="Next page"
                  >
                    <FaChevronRight className="text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                )}
              </div>

              {/* Page Footer */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent p-4">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{readingTime} min read</span>
                  <span>
                    Page {currentPageIndex + 1} of {totalPages}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-6">
              <button
                onClick={goToPreviousPage}
                disabled={currentPageIndex === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 text-white font-medium shadow hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                <FaChevronLeft />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(currentPageIndex - 2 + i, totalPages - 5 + i));
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setPageDirection(pageNum > currentPageIndex ? 'next' : 'prev');
                        setCurrentPageIndex(pageNum);
                      }}
                      className={`w-8 h-8 rounded-full text-sm font-medium transition ${
                        pageNum === currentPageIndex
                          ? 'bg-amber-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPageIndex === totalPages - 1}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 text-white font-medium shadow hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Reading Instructions */}
          <div className="text-center mt-6 text-sm text-gray-500">
            <p>Use arrow keys or spacebar to navigate • Click on page edges to turn pages</p>
          </div>
        </section>
      ) : (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading chapter...</p>
          </div>
        </div>
      )}
    </main>
  );
}