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
import type { Story, User, Chapter,Author, ChapterStatus } from "@/types"; // Adjust the path as needed
import { toast } from "sonner";


export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [preview, setPreview] = useState<string>("/profile-picture-placeholder.svg");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filepath, setSelectedFilePath] = useState<string>("");
  const [chapterStatuses, setChapterStatuses] = useState<ChapterStatus[]>([])
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        console.log(response)
        setProfile(response);
        if (response.profilePicture) setPreview(response.profilePicture);

      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    

     const fetchChapters = async () => {
        try {
          const  chapters  = await fetchMyChaptersStatus();
          setChapterStatuses(chapters);
        } catch (err) {
          console.error("Failed to fetch chapters", err);
        }
      };
      fetchChapters();
      fetchProfile();
  }, []);

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

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("name", profile.name);
    formData.append("email", profile.email||"No email found");
    if (profile.bio) formData.append("bio", profile.bio);

      const updated = await updateMyProfile({
        ...profile,
        profilePicture: filepath, // e.g., "/uploads/myimg.jpg"
      });
      setProfile(updated);
      toast.success('Profile picture updated successfully!')

   
      };

  return (
   <main className="min-h-screen bg-white text-black">
  <Navbar />
  <section className="px-6 sm:px-10 py-10 max-w-6xl mx-auto">
    {/* Profile Section */}
    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">

      {/* Profile Picture + Upload */}
      <div className="flex flex-col items-center text-center w-full lg:w-1/3">
        <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200 shadow-inner mb-4">
          <Image
            src={preview}
            alt="Profile Picture"
            fill
            className="object-cover rounded-full"
          />
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full max-w-xs"
        />
        <Button
          variant="link"
          onClick={handleUpload}
          className="text-sm mt-2 hover:underline"
        >
          Change Profile Picture
        </Button>
        <p className="text-xs text-gray-500 mt-1">
          Choose a picture to represent you
        </p>
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px bg-gray-200 h-64" />

      {/* Form */}
      <div className="w-full lg:w-2/3">
        <Card className="w-full max-w-xl mx-auto shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-black">User Account</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Update your name and email information
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder={profile?.name || "Your name"}
                className="text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={profile?.email || "Your email"}
                className="text-sm"
              />
            </div>
          </CardContent>

          <CardFooter className="pt-4 flex flex-col gap-4">
            <Button className="w-full py-3 text-base font-medium bg-black text-white hover:bg-gray-800 transition">
              Update Account
            </Button>
            <Button className="w-full py-3 text-base font-medium" variant="outline">
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>

    {/* Your Stories */}
    <div className="mt-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Your Stories</h1>
      <UserStories />
    </div>

    {/* ✅ New Section: Chapter Contribution Status */}
    <div className="mt-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Your Chapter Contributions</h1>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-100 text-left text-sm uppercase text-gray-600">
            <tr>
              <th className="p-4">Story Title</th>
              <th className="p-4">Chapter Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {chapterStatuses.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No chapter contributions found.
                </td>
              </tr>
            ) : (
              chapterStatuses.map((chapter, index) => (
                <tr key={index} className="border-t text-sm">
                  <td className="p-4">{chapter.storyTitle}</td>
                  <td className="p-4">{chapter.chapterTitle}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                  <td className="p-4">{new Date(chapter.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
</main>

  );
}
