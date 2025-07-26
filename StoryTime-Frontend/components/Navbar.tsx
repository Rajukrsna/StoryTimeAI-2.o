"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaHome, FaUser, FaSignOutAlt, FaTrophy, FaBell, FaSearch } from "react-icons/fa";
import { ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavHome = () => {
        router.push("/homepage");
        setIsMobileMenuOpen(false);
    };
    const handleNavProfile = () => {
        router.push("/profile");
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };
    const handleNavBattles = () => {
        router.push("/battle");
        setIsMobileMenuOpen(false);
    };
    
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        document.cookie = "authToken=; Max-Age=0; path=/;";
        router.push("/");
        setIsMobileMenuOpen(false);
        setIsProfileDropdownOpen(false);
    };

    // Helper function to check if route is active
    const isActive = (path: string) => pathname?.startsWith(path);

    const navItems = [
        { 
            label: "Home", 
            icon: FaHome, 
            path: "/homepage", 
            onClick: handleNavHome,
            gradient: "from-gray-600 to-gray-800"
        },
        { 
            label: "Battles", 
            icon: FaTrophy, 
            path: "/battle", 
            onClick: handleNavBattles,
            gradient: "from-gray-500 to-gray-700"
        }
    ];

    return (
        <>
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled 
                        ? 'bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50' 
                        : 'bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/30'
                }`}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-18">
                        {/* Enhanced Logo */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push("/homepage")}
                            className="flex items-center gap-3 cursor-pointer group relative"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <Image
                                    src="/uploads/logo-trans.png"
                                    alt="StoryTime Logo"
                                    width={48}
                                    height={48}
                                    className="relative w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                                />
                            </div>
                            <div className="flex flex-col">
                                <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent tracking-tight group-hover:from-gray-600 group-hover:to-gray-800 transition-all duration-300">
                                    StoryTime.AI
                                </div>
                                <div className="text-xs text-gray-500 font-medium hidden sm:block">
                                    Creative Writing Platform
                                </div>
                            </div>
                        </motion.div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            {/* Main Nav Items */}
                            <div className="flex items-center gap-1 bg-gray-100/60 p-1 rounded-2xl backdrop-blur-sm">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.path);
                                    return (
                                        <motion.div
                                            key={item.path}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                onClick={item.onClick}
                                                variant="ghost"
                                                size="sm"
                                                className={`relative flex items-center gap-2 text-sm transition-all duration-300 rounded-xl px-4 py-2.5 font-medium ${
                                                    active
                                                        ? 'bg-white text-gray-900 shadow-lg shadow-gray-200/50'
                                                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/70'
                                                }`}
                                            >
                                                <Icon className={`w-4 h-4 transition-colors duration-300 ${
                                                    active ? 'text-gray-800' : 'text-gray-600'
                                                }`} />
                                                <span>{item.label}</span>
                                                {active && (
                                                    <motion.div
                                                        layoutId="activeTab"
                                                        className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-800/10 rounded-xl"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 ml-4">
                                {/* Search Button */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
                                        onClick={() => router.push("/explore")}
                                    >
                                        <FaSearch className="w-4 h-4" />
                                    </Button>
                                </motion.div>

                                {/* Notifications */}
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-300"
                                    >
                                        <FaBell className="w-4 h-4" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                    </Button>
                                </motion.div>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button
                                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                            variant="ghost"
                                            size="sm"
                                            className={`flex items-center gap-2 text-sm transition-all duration-300 rounded-xl px-3 py-2.5 ${
                                                isActive('/profile') || isProfileDropdownOpen
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                                                <FaUser className="w-3 h-3 text-white" />
                                            </div>
                                            <span className="font-medium">Profile</span>
                                            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${
                                                isProfileDropdownOpen ? 'rotate-180' : ''
                                            }`} />
                                        </Button>
                                    </motion.div>

                                    {/* Profile Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 z-[60]"
                                            >
                                                <Button
                                                    onClick={handleNavProfile}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 mx-2 rounded-xl px-3 py-2"
                                                >
                                                    <FaUser className="w-4 h-4 mr-3" />
                                                    View Profile
                                                </Button>
                                                <div className="h-px bg-gray-200 mx-2 my-1"></div>
                                                <Button
                                                    onClick={handleLogout}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 mx-2 rounded-xl px-3 py-2"
                                                >
                                                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                                                    Logout
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    variant="ghost"
                                    size="sm"
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="w-5 h-5" />
                                    ) : (
                                        <Menu className="w-5 h-5" />
                                    )}
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Mobile Menu - Moved inside nav for proper z-index hierarchy */}
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl"
                            >
                                <div className="container mx-auto px-4 py-4 space-y-2">
                                    {navItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.path);
                                        return (
                                            <motion.div
                                                key={item.path}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                            >
                                                <Button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log(`Clicking ${item.label}`); // Debug log
                                                        item.onClick();
                                                    }}
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`w-full justify-start text-sm transition-all duration-300 rounded-xl px-4 py-3 ${
                                                        active
                                                            ? 'bg-gray-100 text-gray-900 font-semibold'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4 mr-3" />
                                                    {item.label}
                                                </Button>
                                            </motion.div>
                                        );
                                    })}
                                    
                                    <div className="h-px bg-gray-200 my-2"></div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.3 }}
                                    >
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("Clicking Profile"); // Debug log
                                                handleNavProfile();
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className={`w-full justify-start text-sm transition-all duration-300 rounded-xl px-4 py-3 ${
                                                isActive('/profile')
                                                    ? 'bg-gray-100 text-gray-900 font-semibold'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            <FaUser className="w-4 h-4 mr-3" />
                                            Profile
                                        </Button>
                                    </motion.div>
                                    
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3, delay: 0.4 }}
                                    >
                                        <Button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log("Clicking Logout"); // Debug log
                                                handleLogout();
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-300 rounded-xl px-4 py-3"
                                        >
                                            <FaSignOutAlt className="w-4 h-4 mr-3" />
                                            Logout
                                        </Button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.nav>

            {/* Backdrop - Only show when dropdowns are open, not for mobile menu */}
            {isProfileDropdownOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                />
            )}
        </>
    );
}