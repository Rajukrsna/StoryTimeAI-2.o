"use client";

import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/ui/login-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaBookOpen, FaUserPlus } from "react-icons/fa";
import { Typewriter } from 'react-simple-typewriter';

export default function LoginPage() {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/signup");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex flex-col font-sans animate-fade-in transition-all duration-500">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b-2 border-gray-200/50 px-6 sm:px-12 py-4 shadow-sm backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-3 text-xl font-bold text-gray-800 tracking-wide">
          <FaBookOpen className="text-gray-700" size={24} />
          <span>StoryTime</span>
        </div>
        <Button
          onClick={handleNavigation}
          variant="ghost"
          className="text-sm text-gray-700 hover:bg-gray-100 transition duration-200 flex items-center gap-2 rounded-xl px-4 py-2"
        >
          <FaUserPlus className="text-gray-600" size={16} />
          Sign up
        </Button>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center lg:justify-between mt-12 lg:mt-24 px-6 sm:px-20 gap-12 flex-1">
        {/* Branding Section */}
        <section className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12 animate-slide-in-left">
          {/* Logo */}
          <div className="h-48 w-48 lg:h-64 lg:w-64 transition-transform duration-300 hover:scale-105 rounded-3xl bg-white shadow-xl p-4 ring-4 ring-gray-200/50">
            <Image
              src="/uploads/StoryMagic.png"
              alt="StoryTime Logo"
              width={256}
              height={256}
              className="object-contain rounded-2xl"
            />
          </div>

          {/* Text */}
          <div className="text-center lg:text-left">
            <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight text-gray-900 transition-all duration-300 mb-2">
              Story
            </h1>
            <h1 className="text-6xl lg:text-8xl font-extrabold leading-tight text-gray-900 mb-4">
              Time
            </h1>
            <h2 className="text-lg lg:text-2xl font-semibold leading-tight text-gray-700 transition-all duration-300">
              <Typewriter
                words={['Create your own story', 'Let your imagination fly', 'Time to make your own story']}
                loop={true}
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </h2>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="w-full lg:w-auto flex justify-center lg:justify-start animate-slide-in-right">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}