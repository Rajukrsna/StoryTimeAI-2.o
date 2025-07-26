"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signup } from "@/api/signup"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { 
    FaSignInAlt, 
    FaBookOpen, 
    FaUser, 
    FaEnvelope, 
    FaLock, 
    FaCamera,
    FaEye,
    FaEyeSlash,
    FaCheckCircle,
    FaGoogle,
    FaSpinner,
    FaUpload
} from "react-icons/fa"
import {
    Mail,
    Lock,
    User,
    AlertCircle,
    Loader2,
    UserPlus,
    ArrowRight,
    Camera,
    Upload,
    Sparkles,
    Shield,
    Heart
} from "lucide-react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

export default function SignUpPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [previewUrl, setPreviewUrl] = useState("/profile-picture-placeholder.svg");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith('image/')) {
                setFile(droppedFile);
                setPreviewUrl(URL.createObjectURL(droppedFile));
            }
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

    const isFormValid = name && email && password;
    const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak';

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ 
                        x: [0, 100, 0],
                        y: [0, -100, 0],
                        rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ 
                        x: [0, -50, 0],
                        y: [0, 100, 0],
                        rotate: [0, -180, -360]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-20 -left-20 w-60 h-60 bg-gradient-to-tr from-gray-100/40 to-gray-200/30 rounded-full blur-2xl"
                />
            </div>

            {/* Enhanced Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-50 flex items-center justify-between border-b border-gray-200/50 px-6 sm:px-12 py-6 shadow-lg backdrop-blur-xl bg-white/90"
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-4 cursor-pointer"
                >
                    <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl">
                        <FaBookOpen className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                            StoryTime.AI
                        </span>
                        <div className="text-xs text-gray-500 font-medium">
                            Creative Writing Platform
                        </div>
                    </div>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                        onClick={handleNavigation}
                        variant="outline"
                        className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-2xl px-6 py-3 font-semibold transition-all duration-300"
                    >
                        <FaSignInAlt className="mr-2" size={16} />
                        Sign In
                    </Button>
                </motion.div>
            </motion.nav>

            {/* Sign Up Section */}
            <section className="relative z-10 container mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-8 min-h-[calc(100vh-120px)]">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full"
                >
                    <Card className="relative bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-gray-50/30 to-gray-100/50 pointer-events-none" />
                        
                        {/* Decorative Elements */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-2xl" />
                        <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-gray-100/40 to-gray-200/30 rounded-full blur-xl" />
                        
                        <div className="relative z-10 p-8">
                            <CardHeader className="text-center space-y-4 pb-8">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-4"
                                >
                                    <UserPlus className="w-8 h-8 text-white" />
                                </motion.div>
                                
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                                        Join StoryTime.AI
                                    </CardTitle>
                                    <CardDescription className="text-base text-gray-600 mt-3">
                                        Start your creative writing journey today
                                    </CardDescription>
                                </motion.div>

                                {/* Benefits Pills */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-wrap justify-center gap-2 mt-4"
                                >
                                    {['AI Assistant', 'Free Forever', 'Global Community'].map((benefit, index) => (
                                        <div
                                            key={benefit}
                                            className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-700 border border-gray-200/50"
                                        >
                                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
                                            {benefit}
                                        </div>
                                    ))}
                                </motion.div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Profile Picture Upload */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex flex-col items-center space-y-4"
                                >
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Camera className="w-4 h-4" />
                                        Profile Picture
                                        <span className="text-xs font-normal text-gray-500">(Optional)</span>
                                    </Label>
                                    
                                    <div
                                        className={`relative group cursor-pointer transition-all duration-300 ${
                                            dragActive ? 'scale-105' : ''
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <label htmlFor="profile-picture" className="cursor-pointer">
                                            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden border-4 border-white shadow-xl group-hover:shadow-2xl transition-all duration-300 ring-4 ring-transparent group-hover:ring-gray-200">
                                                <Image
                                                    src={previewUrl}
                                                    alt="Profile Picture"
                                                    fill
                                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                                    <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        </label>
                                        <input
                                            id="profile-picture"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                        {file && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                                <FaCheckCircle className="text-white text-sm" />
                                            </motion.div>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 text-center">
                                        Click to upload or drag & drop an image
                                    </p>
                                </motion.div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="space-y-3"
                                    >
                                        <Label 
                                            htmlFor="name" 
                                            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                                        >
                                            <User className="w-4 h-4" />
                                            Full Name
                                        </Label>
                                        <div className="relative group">
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onFocus={() => setFocusedField('name')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`text-base h-12 pl-12 rounded-xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                                                    focusedField === 'name' 
                                                        ? 'border-gray-400 shadow-lg' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            />
                                            <FaUser className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                focusedField === 'name' ? 'text-gray-600' : 'text-gray-400'
                                            }`} />
                                            {name && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                >
                                                    <FaCheckCircle className="text-green-500" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>

                                    {/* Email Field */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 }}
                                        className="space-y-3"
                                    >
                                        <Label 
                                            htmlFor="email" 
                                            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Email Address
                                        </Label>
                                        <div className="relative group">
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onFocus={() => setFocusedField('email')}
                                                onBlur={() => setFocusedField(null)}
                                                className={`text-base h-12 pl-12 rounded-xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                                                    focusedField === 'email' 
                                                        ? 'border-gray-400 shadow-lg' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            />
                                            <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                                focusedField === 'email' ? 'text-gray-600' : 'text-gray-400'
                                            }`} />
                                            {email && email.includes('@') && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                >
                                                    <FaCheckCircle className="text-green-500" />
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Password Field */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="space-y-3"
                                >
                                    <Label 
                                        htmlFor="password" 
                                        className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                                    >
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </Label>
                                    <div className="relative group">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            className={`text-base h-12 pl-12 pr-12 rounded-xl border-2 transition-all duration-300 bg-white/70 backdrop-blur-sm ${
                                                focusedField === 'password' 
                                                    ? 'border-gray-400 shadow-lg' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        />
                                        <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                                            focusedField === 'password' ? 'text-gray-600' : 'text-gray-400'
                                        }`} />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-2"
                                        >
                                            <div className="flex gap-1">
                                                <div className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-red-300' : passwordStrength === 'medium' ? 'bg-yellow-300' : 'bg-green-300'}`} />
                                                <div className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? passwordStrength === 'medium' ? 'bg-yellow-300' : 'bg-green-300' : 'bg-gray-200'}`} />
                                                <div className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-green-300' : 'bg-gray-200'}`} />
                                            </div>
                                            <p className={`text-xs font-medium ${passwordStrength === 'weak' ? 'text-red-600' : passwordStrength === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                                                Password strength: {passwordStrength === 'weak' ? 'Weak' : passwordStrength === 'medium' ? 'Medium' : 'Strong'}
                                            </p>
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
                                        >
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <p className="text-sm text-red-600 font-medium">{error}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Terms and Privacy */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                                >
                                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <p className="text-sm text-blue-800">
                                        By creating an account, you agree to our{" "}
                                        <a href="#" className="font-semibold hover:underline">Terms of Service</a>{" "}
                                        and{" "}
                                        <a href="#" className="font-semibold hover:underline">Privacy Policy</a>
                                    </p>
                                </motion.div>
                            </CardContent>


                            <CardFooter className="flex flex-col space-y-4 pt-6">
                                {/* Create Account Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.0 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full"
                                >
                                    <Button
                                        onClick={handleSignUp}
                                        disabled={isLoading || !isFormValid}
                                        size="lg"
                                        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Creating Account...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <UserPlus className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>Create Account</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </div>
                                        )}
                                    </Button>
                                </motion.div>

                                {/* Sign In Link - Block Level */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.1 }}
                                    className="w-full text-center pt-4"
                                >
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{" "}
                                        <motion.a
                                            href="/"
                                            whileHover={{ scale: 1.05 }}
                                            className="font-semibold text-gray-800 hover:text-gray-900 hover:underline transition-colors"
                                        >
                                            Sign in here
                                        </motion.a>
                                    </p>
                                </motion.div>
                            </CardFooter>


                        </div>
                    </Card>
                </motion.div>
            </section>

            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/95 backdrop-blur-md z-50 flex items-center justify-center"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-200/50 text-center max-w-md mx-4"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 mx-auto mb-6"
                            >
                                <div className="w-full h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center">
                                    <UserPlus className="text-2xl text-white" />
                                </div>
                            </motion.div>
                            
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                Creating your account...
                            </h3>
                            
                            <p className="text-gray-600 leading-relaxed">
                                Setting up your creative writing space. This will only take a moment.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}