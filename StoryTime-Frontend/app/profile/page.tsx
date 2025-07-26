"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserStories from "@/components/userStories";
import Image from "next/image";
import { getMyProfile, updateMyProfile, updateProfileImage, fetchMyChaptersStatus } from "@/api/profile";
import type { User, ChapterStatus } from "@/types";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  Camera, 
  Edit3, 
  Save, 
  LogOut, 
  BookOpen, 
  TrendingUp, 
  Award,
  Calendar,
  User as UserIcon,
  Mail,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [preview, setPreview] = useState<string>("/profile-picture-placeholder.svg");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filepath, setSelectedFilePath] = useState<string>("");
  const [chapterStatuses, setChapterStatuses] = useState<ChapterStatus[]>([]);
  const [profileLoading, setProfileLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setProfile(response);
        if (response.profilePicture) setPreview(response.profilePicture);
        setName(response.name || "");
        setEmail(response.email || "");
        setBio(response.bio || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setProfileLoading(false);
      }
    };
    
    const fetchChapters = async () => {
      try {
        const chapters = await fetchMyChaptersStatus();
        setChapterStatuses(chapters);
      } catch (err) {
        console.error("Failed to fetch chapters", err);
      }
    };

    fetchChapters();
    fetchProfile();
  }, []);

  const AnimatedLoader = ({ text = "Loading..." }: { text?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center items-center gap-3 text-gray-500 mt-10 text-lg"
    >
      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
      <span className="animate-pulse">{text}</span>
    </motion.div>
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploadLoading(true);
        const { filePath } = await updateProfileImage(file);
        setSelectedFile(file);
        setSelectedFilePath(filePath);
        setPreview(URL.createObjectURL(file));
        toast.success("Image uploaded successfully!");
      } catch (err) {
        console.error("Upload failed", err);
        toast.error("Failed to upload image");
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const handleProfileUpdate = async () => {
    if (!profile) return;
    setUpdateLoading(true);
    try {
      const updatedProfile = await updateMyProfile({
        ...profile,
        name: name || profile.name,
        email: email || profile.email,
        bio: bio || profile.bio,
      });
      setProfile(updatedProfile);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !profile) return;
    try {
      setUploadLoading(true);
      const updated = await updateMyProfile({
        ...profile,
        profilePicture: filepath,
      });
      setProfile(updated);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile picture');
    } finally {
      setUploadLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      approved: { 
        bg: "bg-green-100", 
        text: "text-green-700", 
        icon: CheckCircle,
        label: "Approved"
      },
      pending: { 
        bg: "bg-yellow-100", 
        text: "text-yellow-700", 
        icon: Clock,
        label: "Pending"
      },
      rejected: { 
        bg: "bg-red-100", 
        text: "text-red-700", 
        icon: XCircle,
        label: "Rejected"
      }
    };
    
    const { bg, text, icon: Icon, label } = config[status as keyof typeof config] || config.pending;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </div>
    );
  };

  const stats = [
    { 
      label: "Chapters Contributed", 
      value: chapterStatuses.length, 
      icon: FileText,
      color: "from-gray-500 to-gray-700"
    },
    { 
      label: "Approved Chapters", 
      value: chapterStatuses.filter(c => c.status === 'approved').length, 
      icon: Award,
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <main className="min-h-screen pt-16 lg:pt-18 bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent mb-4">
              Profile Dashboard
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your account, stories, and track your writing journey
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Profile Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12"
        >
          {/* Profile Picture Section */}
          <div className="xl:col-span-1">
            <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-xl">
                  <Camera className="w-5 h-5" />
                  Profile Picture
                </CardTitle>
                <CardDescription>Update your profile image</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl ring-4 ring-white">
                    <Image
                      src={preview}
                      alt="Profile Picture"
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  {uploadLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                    disabled={uploadLoading}
                  />
                  
                  {selectedFile && (
                    <Button
                      onClick={handleUpload}
                      disabled={uploadLoading}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 rounded-xl"
                    >
                      {uploadLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Update Picture
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="xl:col-span-2">
            {profileLoading ? (
              <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg">
                <CardContent className="p-12">
                  <AnimatedLoader text="Loading profile..." />
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Edit3 className="w-6 h-6" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and bio
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold">
                        <UserIcon className="w-4 h-4" />
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder={profile?.name || "Your name"}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={profile?.email || "Your email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2 text-sm font-semibold">
                      <FileText className="w-4 h-4" />
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      type="text"
                      placeholder={profile?.bio || "Tell us about yourself..."}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleProfileUpdate} 
                    disabled={updateLoading}
                    className="flex-1 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 rounded-xl py-3"
                  >
                    {updateLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Update Account
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 rounded-xl py-3 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </motion.div>

        {/* Your Stories Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Your Stories</h2>
          </div>
          <UserStories />
        </motion.section>

        {/* Chapter Contributions Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Chapter Contributions</h2>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-md border border-white/30 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100/80">
                  <tr className="text-left text-sm uppercase text-gray-700 font-semibold">
                    <th className="p-6">Story Title</th>
                    <th className="p-6">Chapter Title</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {chapterStatuses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="text-gray-500">
                            <p className="font-medium mb-1">No contributions yet</p>
                            <p className="text-sm">Start contributing to stories to see your progress here.</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    chapterStatuses.map((chapter, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-t border-gray-200/50 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="p-6 font-medium text-gray-900">{chapter.storyTitle}</td>
                        <td className="p-6 text-gray-700">{chapter.chapterTitle}</td>
                        <td className="p-6">{getStatusBadge(chapter.status)}</td>
                        <td className="p-6 text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(chapter.createdAt).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}