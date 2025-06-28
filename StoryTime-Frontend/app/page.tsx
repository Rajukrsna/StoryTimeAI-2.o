"use client";

import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/ui/login-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaBookOpen } from "react-icons/fa";
import { Typewriter } from 'react-simple-typewriter';
import { FaUserPlus } from "react-icons/fa"; // Import at the top

export default function LoginPage() {
  const router = useRouter();
  const handleNavigation = () => {
    router.push("/signup");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#f6f8fb] flex flex-col font-sans animate-fade-in transition-all duration-500">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b px-6 sm:px-12 py-4 shadow-sm backdrop-blur-md bg-white/80">
        <div className="flex items-center gap-2 text-lg font-bold text-gray-800 tracking-wide">
          <FaBookOpen className="text-gray-700" size={22} />
          <span>StoryTime</span>
        </div>
      <Button
  onClick={handleNavigation}
  variant="link"
  className="text-sm text-gray-700 hover:underline transition duration-200 flex items-center gap-2"
>
  <FaUserPlus className="text-gray-600" size={14} />
  Sign up
</Button>

      </nav>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-12 sm:mt-24 px-6 sm:px-20 gap-12">
        {/* Branding Section */}
        <section className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-10">
          {/* Logo */}
          <div className="h-40 w-40 sm:h-52 sm:w-52 transition-transform duration-300 hover:scale-105 rounded-xl bg-white shadow-lg p-2">
            <Image
              src="/uploads/StoryMagic.png"
              alt="StoryTime Logo"
              width={208}
              height={208}
              className="object-contain rounded-xl"
            />
          </div>

          {/* Text */}
          <div className="text-center sm:text-left">
            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight text-gray-900 transition-all duration-300">
              Story
            </h1>
            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight text-gray-900">
              Time
            </h1>
              <h1 className="text-sm sm:text-xl font-extrabold leading-tight text-gray-900 transition-all duration-300">
  <Typewriter
    words={['Create your own story', 'Let your imagination fly', 'Time to make your own story ']}
    loop={true}
    cursor
    cursorStyle="|"
    typeSpeed={80}
    deleteSpeed={50}
    delaySpeed={1500}
  />
</h1>
           
          </div>
        </section>

     <section className="w-full sm:w-auto flex justify-center sm:justify-start">
  <LoginForm />
</section>
      </div>
    </main>
  );
}
