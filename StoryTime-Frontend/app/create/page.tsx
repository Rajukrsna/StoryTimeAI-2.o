// StoryTime-Frontend/app/create/page.tsx
"use client"

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { createAIStory } from "@/api/aiApi";
import { useState, useEffect } from "react"; // Import useEffect
import { FaFeatherAlt } from "react-icons/fa";
import { X } from "lucide-react"; // Import X icon for close button

export default function CreatePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showGuide, setShowGuide] = useState(false); // New state for guide modal

    const router = useRouter();

    useEffect(() => {
        // Check if the user has seen the guide before
        const hasSeenGuide = localStorage.getItem("hasSeenCreateGuide");
        if (!hasSeenGuide) {
            setShowGuide(true);
        }
    }, []);

    const handleCloseGuide = () => {
        setShowGuide(false);
        localStorage.setItem("hasSeenCreateGuide", "true"); // Mark as seen
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_preset");

        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dneqrmfuv/image/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.secure_url) {
                console.log("Uploaded image URL:", data.secure_url);
                return data.secure_url;
            } else {
                alert("Cloudinary upload failed");
                return null;
            }
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        }
    };

    const handleCreate = async () => {
        setIsLoading(true);

        try {
            const imageUrl = await handleUpload();
          
            console.log("Uploaded image URL:", imageUrl);

            if (!imageUrl) {
                alert("Please upload a cover image!");
                setIsLoading(false);
                return;
            }
            const response = await createAIStory(title, description);
            if (response) {
                router.push(`/aiPage?summary=${encodeURIComponent(response.summary)}&story=${encodeURIComponent(response.suggestion)}&title=${encodeURIComponent(title)}&imageUrl=${encodeURIComponent(imageUrl)}`);  
            } else {
                alert("AI generation failed!");
            }
        } catch (error) {
            console.log("Error creating story:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <main className="bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen text-gray-900 font-sans">
        <Navbar />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-2xl rounded-3xl border-2 border-gray-200/50 shadow-xl p-6 sm:p-12 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl animate-scale-in">
            <CardHeader className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FaFeatherAlt className="text-3xl text-gray-700" />
                </div>
              </div>
              <CardTitle className="text-3xl lg:text-4xl font-bold mb-2 text-balance">Create Your Story</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Begin your journey as a storyteller ✨
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Title */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                  Story Title
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="A Tale of Two Worlds"
                  className="text-base"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="desc" className="text-sm font-semibold text-gray-700">
                  Description
                </Label>
                <Textarea
                  id="desc"
                  placeholder="Brief summary of your story"
                  className="h-32 text-base resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Cover */}
              <div className="space-y-3">
                <Label htmlFor="picture" className="text-sm font-semibold text-gray-700">
                  Cover Image
                </Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  className="file:border-0 file:rounded-lg file:bg-black file:text-white file:px-4 file:py-2 file:mr-4 hover:file:bg-gray-800 file:transition-colors"
                  onChange={handleFileChange}
                />
              </div>
            </CardContent>

            <CardFooter className="pt-8">
              <Button
                onClick={handleCreate}
                disabled={isLoading || !title || !description || !file}
                size="lg"
                className="w-full py-4 text-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Story"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {isLoading && (
          <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-200/50 text-center max-w-md mx-4">
              <FaFeatherAlt className="text-6xl text-black animate-spin mb-6 mx-auto" />
              <p className="text-xl font-semibold text-gray-800 animate-pulse">Generating your story...</p>
              <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
            </div>
          </div>
        )}

        {/* Onboarding Guide Modal */}
        {showGuide && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={handleCloseGuide}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Story Creation!</h2>
              <p className="text-gray-700 mb-4">
                Here's a quick guide to get started:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Story Title:</strong> Give your story a captivating name.
                </li>
                <li>
                  <strong>Description:</strong> Provide a brief summary or a starting prompt for your story. This helps the AI generate the first chapter.
                </li>
                <li>
                  <strong>Cover Image:</strong> Upload an image that represents your story. This will be its visual identity!
                </li>
              </ul>
              <Button onClick={handleCloseGuide} className="mt-6 w-full bg-black text-white hover:bg-gray-800">
                Got it! Let's create.
              </Button>
            </div>
          </div>
        )}
      </main>
    );
}
