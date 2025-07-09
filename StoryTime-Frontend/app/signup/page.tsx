"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaSignInAlt, FaBookOpen } from "react-icons/fa";
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
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
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

    const handleSignUp = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const profileFile = await handleUpload();
            await signup(name, email, password, profileFile);
            router.push("/homepage");
        } catch (error) {
            console.error("Sign-up failed", error);
            setError("Sign-up failed. Please check your details and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = () => {
        router.push("/");
    };

    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 font-sans text-gray-900">
        {/* Navbar */}
        <nav className="flex items-center justify-between border-b-2 border-gray-200/50 px-6 sm:px-12 py-4 shadow-sm bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3 text-xl font-bold tracking-wide">
            <FaBookOpen className="text-gray-700" size={24} />
            <span>StoryTime</span>
          </div>
          <Button
            onClick={handleNavigation}
            variant="ghost"
            className="text-sm hover:bg-gray-100 flex items-center gap-2 text-gray-700 transition duration-200 rounded-xl px-4 py-2"
          >
            <FaSignInAlt size={16} className="text-gray-600" />
            Sign In
          </Button>
        </nav>

        {/* Sign Up Section */}
        <section className="container mx-auto flex max-w-lg flex-col items-center justify-center px-6 py-12 sm:py-20 animate-fade-in min-h-[calc(100vh-80px)]">
          <Card className="w-full rounded-3xl border-2 border-gray-200/50 shadow-xl bg-white/80 backdrop-blur-sm px-6 py-8 transition-all duration-300 hover:shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl sm:text-4xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-gray-600 text-lg">
                Join our storytelling community
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Profile Picture Upload */}
              <div className="flex items-center gap-6 pt-4">
                <label
                  htmlFor="profile-picture"
                  className="cursor-pointer flex items-center gap-4 group"
                >
                  <div className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300 group-hover:shadow-lg transition-all duration-300 ring-2 ring-transparent group-hover:ring-gray-300">
                    <Image
                      src={previewUrl}
                      alt="Profile Picture"
                      fill
                      className="object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                      Choose Profile Picture
                    </span>
                    <p className="text-xs text-gray-500">Optional</p>
                  </div>
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
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="mt-6">
              <Button
                onClick={handleSignUp}
                disabled={isLoading || !name || !email || !password}
                size="lg"
                className="w-full py-4 text-base font-semibold bg-black text-white hover:bg-gray-800 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </CardFooter>
          </Card>
        </section>
      </main>
    )
}