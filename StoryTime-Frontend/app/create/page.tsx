"use client"

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { createAIStory } from "@/api/aiApi";
import { useState } from "react"; 
import { FaFeatherAlt } from "react-icons/fa";


export default function CreatePage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return null; // No file selected

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (data.success) {
                return data.filePath; // Return relative file path
            } else {
                alert("File upload failed!");
                return null;
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            return null;
        }
    };

    const handleCreate = async () => {
        setIsLoading(true); // Start loading

        try {
            
            const imageUrl = await handleUpload(); // Upload file and get URL
          
            console.log("Uploaded image URL:", imageUrl);

            if (!imageUrl) {
                alert("Please upload a cover image!");
                return;
            }
            const response = await createAIStory(title, description);
            if (response) {
                // Navigate to AIPage with the generated story
                router.push(`/aiPage?story=${encodeURIComponent(response.suggestion)}&title=${encodeURIComponent(title)}&imageUrl=${encodeURIComponent(imageUrl)}`);  
            } else {
                alert("AI generation failed!");
            }
        } catch (error) {
            console.log("Error creating story:", error);
        }
    };

    return (
      <main className="bg-[#fcfcfc] min-h-screen text-gray-900 font-sans">
  <Navbar />

  <div className="mx-auto max-w-4xl px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
    <Card className="w-full rounded-2xl border border-gray-200 shadow-md p-6 sm:p-12 bg-white transition-all duration-300">
      <CardHeader className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <FaFeatherAlt className="text-3xl text-gray-700" />
        </div>
        <CardTitle className="text-3xl font-bold mb-1">Create Your Story</CardTitle>
        <CardDescription className="text-gray-600">
          Begin your journey as a storyteller ✨
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Story Title
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="A Tale of Two Worlds"
            className="focus:ring-2 focus:ring-black/40"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label htmlFor="desc" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="desc"
            placeholder="Brief summary of your story"
            className="h-32 focus:ring-2 focus:ring-black/30"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Cover */}
        <div className="grid gap-2">
          <Label htmlFor="picture" className="text-sm font-medium">
            Cover Image
          </Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            className="file:border-0 file:rounded file:bg-black file:text-white hover:file:bg-gray-800"
            onChange={handleFileChange}
          />
        </div>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={handleCreate}
          className="w-full py-3 text-lg bg-black text-white hover:bg-gray-800 transition-transform hover:scale-[1.02]"
        >
          Create
        </Button>
      </CardFooter>
    </Card>
  </div>
  {isLoading && (
  <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
<FaFeatherAlt className="text-5xl text-black animate-spin mb-6" />
    <p className="text-xl font-semibold text-gray-800 animate-pulse">Generating your story...</p>
  </div>
)}
</main>

    );
}
