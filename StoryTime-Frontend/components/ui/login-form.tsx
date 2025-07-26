import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { login } from "@/api/login";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaGoogle, 
    FaEye, 
    FaEyeSlash, 
    FaLock, 
    FaEnvelope,
    FaSpinner,
    FaCheckCircle
} from "react-icons/fa";
import { 
    Mail, 
    Lock, 
    AlertCircle, 
    Loader2,
    LogIn,
    ArrowRight
} from "lucide-react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await login(email, password);
            console.log("Login response:", response);
            if (!response.success) {
                setError("Invalid credentials. Please try again.");
                return;
            }
            localStorage.setItem("userId", response._id);
            await new Promise((res) => setTimeout(res, 100));
            router.push("/homepage");
        } catch (error) {
            console.error("Login failed", error);
            setError("Login failed. Please check your credentials and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // Placeholder for Google OAuth implementation
        console.log("Google login clicked");
    };

    const isFormValid = email && password;

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <Card className="relative p-8 w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-gray-50/30 to-gray-100/50 pointer-events-none" />
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-gray-200/30 to-gray-300/20 rounded-full blur-2xl" />
                    <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tr from-gray-100/40 to-gray-200/30 rounded-full blur-xl" />
                    
                    <div className="relative z-10">
                        <CardHeader className="text-center space-y-4 pb-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.4 }}
                                className="w-16 h-16 mx-auto bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl flex items-center justify-center mb-4"
                            >
                                <LogIn className="w-8 h-8 text-white" />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                                    Welcome Back
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600 mt-2">
                                    Sign in to continue your writing journey
                                </CardDescription>
                            </motion.div>
                        </CardHeader>
                        
                        <CardContent>
                            <form className="space-y-6">
                                {/* Email Field */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
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
                                            placeholder="Enter your email address"
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
                                        {email && (
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

                                {/* Password Field */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <Label 
                                            htmlFor="password" 
                                            className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                                        >
                                            <Lock className="w-4 h-4" />
                                            Password
                                        </Label>
                                        <motion.a 
                                            href="#" 
                                            whileHover={{ scale: 1.05 }}
                                            className="text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors"
                                        >
                                            Forgot password?
                                        </motion.a>
                                    </div>
                                    <div className="relative group">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
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

                                {/* Sign In Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button 
                                        onClick={handleLogin} 
                                        type="button" 
                                        size="lg"
                                        disabled={isLoading || !isFormValid}
                                        className="w-full h-14 text-base font-semibold bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white rounded-xl shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-3">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Signing in...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3">
                                                <LogIn className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>Sign In</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </div>
                                        )}
                                    </Button>
                                </motion.div>

                                {/* Divider */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    className="relative flex items-center"
                                >
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                    <div className="px-4 text-sm text-gray-500 bg-white/80 backdrop-blur-sm rounded-full">
                                        or continue with
                                    </div>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                                </motion.div>

                                {/* Google Button */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="lg"
                                        onClick={handleGoogleLogin}
                                        className="w-full h-14 text-base font-semibold border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-300 group bg-white/70 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FaGoogle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                                            <span>Continue with Google</span>
                                        </div>
                                    </Button>
                                </motion.div>

                                {/* Sign Up Link */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    className="text-center pt-4"
                                >
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{" "}
                                        <motion.a
                                            href="/signup"
                                            whileHover={{ scale: 1.05 }}
                                            className="font-semibold text-gray-800 hover:text-gray-900 hover:underline transition-colors"
                                        >
                                            Sign up for free
                                        </motion.a>
                                    </p>
                                </motion.div>
                            </form>
                        </CardContent>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}