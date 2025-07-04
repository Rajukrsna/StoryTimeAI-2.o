"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaSignInAlt } from "react-icons/fa"; // Import at the top

import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/api/signup"
import Image from "next/image"
export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [previewUrl, setPreviewUrl] = useState("/profile-picture-placeholder.svg");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0])); // Set preview URL for the image
        }
    };

    const handleUpload = async () => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset"); // from step 2

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
    const handleSignUp = async () => {
        try {
            const profileFile = await handleUpload(); // Upload file and get URL
            await signup(name, email, password, profileFile);
            router.push("/homepage");
        } catch (error) {
            console.error("Sign-up failed", error);
            setError("Sign-up failed. Please check your details and try again.");
        }
    };

    const handleNavigation = () => {
        router.push("/");
    };

    return (
<main className="min-h-screen bg-gradient-to-br from-[#fefefe] to-[#f7f9fb] font-sans text-gray-900">
  {/* Navbar */}
  <nav className="flex items-center justify-between border-b px-6 sm:px-12 py-4 shadow-sm bg-white/70 backdrop-blur">
    <div className="text-xl font-extrabold tracking-wide">StoryTime</div>
  <Button
  onClick={handleNavigation}
  variant="link"
  className="text-sm hover:underline flex items-center gap-2 text-gray-700 transition duration-200"
>
  <FaSignInAlt size={14} className="text-gray-600" />
  Login
</Button>
  </nav>

  {/* Sign Up Section */}
  <section className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-12 sm:py-20 animate-fade-in">
    <Card className="w-full rounded-2xl border border-gray-200 shadow-lg bg-white px-6 py-8 transition-all duration-300">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl sm:text-3xl font-bold">Create an Account</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your details below to sign up
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Name */}
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus:ring-2 focus:ring-black/30"
          />
        </div>

        {/* Email */}
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus:ring-2 focus:ring-black/30"
          />
        </div>

        {/* Password */}
        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus:ring-2 focus:ring-black/30"
          />
        </div>

        {/* Profile Picture Upload */}
        <div className="flex items-center gap-4 pt-4">
          <label
            htmlFor="profile-picture"
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="relative w-16 h-16 rounded-full bg-gray-200 overflow-hidden border border-gray-300 group-hover:shadow-md transition-shadow duration-300">
              <Image
                src={previewUrl}
                alt="Profile Picture"
                fill
                className="object-cover rounded-full"
              />
            </div>
            <span className="text-sm text-gray-700 group-hover:underline">Choose Profile Picture</span>
          </label>
          <input
            id="profile-picture"
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
      </CardContent>

      <CardFooter className="mt-4">
        <Button
          onClick={handleSignUp}
          className="w-full py-3 text-md font-medium bg-black text-white hover:bg-gray-800 transition-transform hover:scale-[1.02]"
        >
          Sign Up
        </Button>
      </CardFooter>
    </Card>
  </section>
</main>

    )
}