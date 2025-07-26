"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { CardHorizontal } from "./ui/card";
import Image from "next/image";
import { getUserStories, deleteStory, approveStory, rejectStory } from "@/api/storyApi";
import { toast } from "sonner";
import type { Story } from "@/types";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Edit3, 
  Trash2, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  User,
  FileText,
  TrendingUp,
  MoreVertical,
  X
} from "lucide-react";
import { FaBook, FaEye, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UserStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<{ title: string; content: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        const storiesData = await getUserStories();
        if (storiesData) {
          setStories(storiesData);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
        toast.error("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleDeleteStory = async (storyId: string) => {
    if (window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      try {
        setActionLoading(prev => ({ ...prev, [`delete-${storyId}`]: true }));
        await deleteStory(storyId);
        toast.success("Story deleted successfully!");
        const updatedStories = await getUserStories();
        setStories(updatedStories);
      } catch (error) {
        console.error("Error deleting story:", error);
        toast.error("Failed to delete story.");
      } finally {
        setActionLoading(prev => ({ ...prev, [`delete-${storyId}`]: false }));
      }
    }
  };

  const handleEditStory = (storyId: string) => {
    router.push(`/book/${storyId}`);
  };

  const handleApprove = async (storyId: string, chapterIndex: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [`approve-${storyId}-${chapterIndex}`]: true }));
      await approveStory(storyId, chapterIndex);
      toast.success("Chapter approved successfully!");
      const updatedStories = await getUserStories();
      setStories(updatedStories);
    } catch (err) {
      console.error(err);
      toast.error("Error approving chapter");
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve-${storyId}-${chapterIndex}`]: false }));
    }
  };

  const handleReject = async (storyId: string, chapterIndex: number) => {
    try {
      setActionLoading(prev => ({ ...prev, [`reject-${storyId}-${chapterIndex}`]: true }));
      await rejectStory(storyId, chapterIndex);
      toast.success("Chapter rejected successfully!");
      const updatedStories = await getUserStories();
      setStories(updatedStories);
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting chapter");
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject-${storyId}-${chapterIndex}`]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FaClock className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6"
          >
            <div className="animate-pulse">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-10 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md border border-white/30 p-12 rounded-3xl shadow-xl text-center"
      >
        <div className="w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
          <FaBook className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No stories yet</h3>
        <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
          Start your writing journey by creating your first story and sharing it with the community.
        </p>
        <Button
          onClick={() => router.push('/create')}
          className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Create Your First Story
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {stories.map((story, index) => {
          const wordCount = story.content?.reduce(
            (acc, chapter) => acc + chapter.content.split(" ").length,
            0
          );

          return (
            <motion.div
              key={story._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <CardHorizontal className="bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  {/* Content Section */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          <span>Story</span>
                          <span>•</span>
                          <span>Genre: Unknown</span>
                        </div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                          {story.title}
                        </h2>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{wordCount?.toLocaleString()} words</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{story.content?.length} chapters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>by {typeof story.author === 'string' ? story.author : story.author.name}</span>
                      </div>
                      {story.content[0].createdAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(story.content[0].createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={() => handleEditStory(story._id)} 
                        className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-xl transition-all duration-300 hover:scale-105"
                        size="sm"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        onClick={() => handleDeleteStory(story._id)} 
                        variant="destructive"
                        size="sm"
                        disabled={actionLoading[`delete-${story._id}`]}
                        className="rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        {actionLoading[`delete-${story._id}`] ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>

                    {/* Pending Chapters Section */}
                    {story.pendingChapters?.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4 space-y-4"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-yellow-500 rounded-lg">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <h3 className="font-semibold text-yellow-800">
                            Pending Chapters ({story.pendingChapters.length})
                          </h3>
                        </div>
                        
                        <div className="space-y-4">
                          {story.pendingChapters.map((chapter, chapterIndex) => (
                            <motion.div 
                              key={chapter._id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: chapterIndex * 0.1 }}
                              className="bg-white/70 backdrop-blur-sm border border-yellow-200/50 rounded-xl p-4 space-y-3"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 mb-2">{chapter.title}</h4>
                                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                    {chapter.content.slice(0, 150)}...
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(story._id, chapterIndex)}
                                  disabled={actionLoading[`approve-${story._id}-${chapterIndex}`]}
                                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 rounded-lg transition-all duration-300"
                                >
                                  {actionLoading[`approve-${story._id}-${chapterIndex}`] ? (
                                    <div className="w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                                  ) : (
                                    <CheckCircle className="w-3 h-3 mr-2" />
                                  )}
                                  Approve
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleReject(story._id, chapterIndex)}
                                  disabled={actionLoading[`reject-${story._id}-${chapterIndex}`]}
                                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 rounded-lg transition-all duration-300"
                                >
                                  {actionLoading[`reject-${story._id}-${chapterIndex}`] ? (
                                    <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                                  ) : (
                                    <XCircle className="w-3 h-3 mr-2" />
                                  )}
                                  Reject
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedChapter({
                                      title: chapter.title,
                                      content: chapter.content,
                                    });
                                    setIsModalOpen(true);
                                  }}
                                  className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-300"
                                >
                                  <Eye className="w-3 h-3 mr-2" />
                                  View Content
                                </Button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Story Image */}
                  <div className="w-full lg:w-48 h-48 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={story.imageUrl || "/uploads/cover.jpg"}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              </CardHorizontal>
            </motion.div>
          );
        })}
      </div>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {isModalOpen && selectedChapter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">{selectedChapter.title}</h2>
                  <button
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedChapter.content}
                  </p>
                </div>
              </div>
              
              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}