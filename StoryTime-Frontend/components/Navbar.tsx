"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaHome, FaUser, FaSignOutAlt } from "react-icons/fa";

export function Navbar() {
    const router = useRouter();

    const handleNavHome = () => router.push("/homepage");
    const handleNavProfile = () => router.push("/profile");
    const handleLogout = ()=>{
         localStorage.removeItem("authToken");
         document.cookie = "authToken=; Max-Age=0; path=/;";
         router.push("/"); 

    }

    
return (
  <nav className="flex items-center justify-between border-b border-gray-200 px-6 md:px-8 py-4 bg-white shadow-sm">
    {/* Logo */}
    <div className="text-2xl font-bold text-black tracking-tight">StoryTime</div>

    {/* Nav Links */}
    <div className="flex items-center gap-4">
      <Button
        onClick={handleNavHome}
        variant="link"
        className="flex items-center gap-2 text-sm text-black hover:underline hover:text-gray-700 transition-colors"
      >
        <FaHome className="w-4 h-4" />
        Home
      </Button>

      <Button
        onClick={handleNavProfile}
        variant="link"
        className="flex items-center gap-2 text-sm text-black hover:underline hover:text-gray-700 transition-colors"
      >
        <FaUser className="w-4 h-4" />
        Profile
      </Button>

      <Button
        onClick={handleLogout}
        variant="link"
        className="flex items-center gap-2 text-sm text-black hover:underline hover:text-red-600 transition-colors"
      >
        <FaSignOutAlt className="w-4 h-4" />
        Logout
      </Button>
    </div>
  </nav>
);
}
