"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaHome, FaUser, FaSignOutAlt, FaBookOpen } from "react-icons/fa";

export function Navbar() {
    const router = useRouter();

    const handleNavHome = () => router.push("/homepage");
    const handleNavProfile = () => router.push("/profile");
    const handleLogout = () => {
         localStorage.removeItem("authToken");
         document.cookie = "authToken=; Max-Age=0; path=/;";
         router.push("/"); 
    }

    return (
      <nav className="flex items-center justify-between border-b-2 border-gray-200/50 px-6 md:px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaBookOpen className="text-2xl text-black" />
          <div className="text-2xl font-bold text-black tracking-tight">StoryTime</div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleNavHome}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm text-black hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 rounded-xl px-4 py-2"
          >
            <FaHome className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Button>

          <Button
            onClick={handleNavProfile}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm text-black hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 rounded-xl px-4 py-2"
          >
            <FaUser className="w-4 h-4" />
            <span className="hidden sm:inline">Profile</span>
          </Button>

          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-sm text-black hover:bg-red-50 hover:text-red-600 transition-all duration-200 rounded-xl px-4 py-2"
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </nav>
    );
}