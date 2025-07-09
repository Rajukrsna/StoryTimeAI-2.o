"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserStories from "@/components/userStories";
import Image from "next/image";
import { getMyProfile } from "@/api/profile";
import { updateMyProfile } from "@/api/profile";
import {updateProfileImage} from "@/api/profile";
import { fetchMyChaptersStatus } from "@/api/profile"; 
import type {  User, ChapterStatus } from "@/types";
import { toast } from "sonner";

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [preview, setPreview] = useState<string>("/profile-picture-placeholder.svg");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filepath, setSelectedFilePath] = useState<string>("");
  const [chapterStatuses, setChapterStatuses] = useState<ChapterStatus[]>([])
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        console.log(response)
        setProfile(response);
        if (response.profilePicture) setPreview(response.profilePicture);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
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
    <div className="flex justify-center items-center gap-3 text-gray-500 mt-10 text-lg">
      <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      <span className="animate-pulse">{text}</span>
    </div>
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const { filePath } = await updateProfileImage(file);
        console.log("Image uploaded to:", filePath);
        setSelectedFile(file);
        setSelectedFilePath(filePath);
        setPreview(URL.createObjectURL(file));
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !profile) return;

    try {
      const updated = await updateMyProfile({
        ...profile,
        profilePicture: filepath,
      });
      setProfile(updated);
      toast.success('Profile picture updated successfully!');
    } catch (err) {
      console.error(err);
    } 
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-black">
      <Navbar />
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile Section */}
        <div className="flex flex-col xl:flex-row items-start gap-12 mb-16">
          {/* Profile Picture + Upload */}
          <div className="flex flex-col items-center text-center w-full xl:w-1/3 animate-slide-in-left">
            <div className="relative w-48 h-48 rounded-full overflow-hidden bg-gray-200 shadow-xl mb-6 ring-4 ring-white">
              <Image
                src={preview}
                alt="Profile Picture"
                fill
                className="object-cover rounded-full transition-transform duration-300 hover:scale-105"
              />
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full max-w-xs mb-4"
            />
            <Button
              variant="outline"
              onClick={handleUpload}
              className="mb-2 hover:bg-gray-50"
            >
              Change Profile Picture
            </Button>
            <p className="text-xs text-gray-500">
              Choose a picture to represent you
            </p>
          </div>

          {/* Divider */}
          <div className="hidden xl:block w-px bg-gray-200 h-80" />

          {/* Form */}
          <div className="w-full xl:w-2/3 animate-slide-in-right">
            {profileLoading ? (
              <AnimatedLoader text="Loading profile..." />
            ) : (
              <Card className="w-full max-w-2xl mx-auto shadow-lg border-2 border-gray-200/50 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-black">User Account</CardTitle>
                  <CardDescription className="text-base text-gray-600">
                    Update your name and email information
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={profile?.name || "Your name"}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={profile?.email || "Your email"}
                      className="text-base"
                    />
                  </div>
                </CardContent>

                <CardFooter className="pt-6 flex flex-col gap-4">
                  <Button size="lg" className="w-full py-4 text-base font-semibold bg-black text-white hover:bg-gray-800">
                    Update Account
                  </Button>
                  <Button size="lg" variant="outline" className="w-full py-4 text-base font-semibold">
                    Sign Out
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>

        {/* Your Stories */}
        <div className="mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center xl:text-left">Your Stories</h1>
          <UserStories />
        </div>

        {/* Chapter Contribution Status */}
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center xl:text-left">Your Chapter Contributions</h1>
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-100/80 text-left text-sm uppercase text-gray-700 font-semibold">
                  <tr>
                    <th className="p-6">Story Title</th>
                    <th className="p-6">Chapter Title</th>
                    <th className="p-6">Status</th>
                    <th className="p-6">Submitted On</th>
                  </tr>
                </thead>
                <tbody>
                  {chapterStatuses.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 text-lg">
                        No chapter contributions found.
                      </td>
                    </tr>
                  ) : (
                    chapterStatuses.map((chapter, index) => (
                      <tr key={index} className="border-t border-gray-200/50 text-base hover:bg-gray-50/50 transition-colors">
                        <td className="p-6 font-medium">{chapter.storyTitle}</td>
                        <td className="p-6">{chapter.chapterTitle}</td>
                        <td className="p-6">
                          <span
                            className={`px-4 py-2 rounded-full text-sm font-semibold ${
                              chapter.status === "approved"
                                ? "bg-green-100 text-green-700"
                                : chapter.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {chapter.status}
                          </span>
                        </td>
                        <td className="p-6 text-gray-600">{new Date(chapter.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}