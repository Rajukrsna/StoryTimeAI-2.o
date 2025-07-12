"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaHome, FaUser, FaSignOutAlt, FaBookOpen } from "react-icons/fa";
import Image from "next/image";

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
     <div
  onClick={() => router.push("/homepage")}
  className="flex items-center gap-3 cursor-pointer group"
>
  <Image
    src="/uploads/logo-trans.png"
    alt="StoryTime Logo"
    width={48}
    height={48}
    className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
  />
  <div className="text-xl sm:text-2xl font-bold text-black tracking-tight group-hover:text-primary transition-colors duration-300">
    StoryTime.AI
  </div>
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