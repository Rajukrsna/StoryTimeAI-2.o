"use client";

import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/ui/login-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from 'react-simple-typewriter';
import DemoVideoShowcase from "@/components/DemoVideoShowcase"; // Add this import

import { 
  FaBookOpen, 
  FaUserPlus, 
  FaMagic, 
  FaUsers, 
  FaRocket,
 
  FaHeart,
  FaStar,
 
  FaQuoteLeft
} from "react-icons/fa";
import { 
  Sparkles, 

  ChevronDown,
  Play,
  ArrowRight
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showDemo, setShowDemo] = useState(false); // Add this state

  const handleNavigation = () => {
    router.push("/signup");
  };

  const features = [
    {
      icon: FaMagic,
      title: "AI-Powered Creation",
      description: "Let artificial intelligence spark your imagination and help craft compelling narratives",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: FaUsers,
      title: "Collaborative Writing",
      description: "Join forces with other writers to create epic stories together",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FaRocket,
      title: "Instant Publishing",
      description: "Share your stories with the world instantly and build your audience",
      color: "from-green-500 to-green-600"
    }
  ];

  const testimonials = [
    {
      text: "StoryTime.AI transformed my writing process. The AI suggestions are incredible!",
      author: "Sarah Chen",
      role: "Fantasy Author"
    },
    {
      text: "The collaborative features helped me connect with amazing writers worldwide.",
      author: "Marcus Rodriguez",
      role: "Sci-Fi Writer"
    },
    {
      text: "From idea to published story in minutes. This platform is revolutionary!",
      author: "Emma Thompson",
      role: "Romance Novelist"
    }
  ];
  const handleShowDemo = () => {
    setShowDemo(true);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
  };
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

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
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-gray-200/20 to-gray-300/20 rounded-full blur-3xl"
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
            className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white rounded-2xl px-6 py-3 font-semibold transition-all duration-300 shadow-lg"
          >
            <FaUserPlus className="mr-2" size={16} />
            Get Started Free
          </Button>
        </motion.div>
      </motion.nav>

      {/* Hero Section - Fixed spacing */}
      <div className="relative z-10 container mx-auto px-6 sm:px-12 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-120px)]">
          
          {/* Left Side - Hero Content - Removed extra spacing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full text-sm font-semibold text-gray-700 w-fit"
            >
              <Sparkles className="w-4 h-4" />
              AI-Powered Creative Writing
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight"
              >
                <span className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                  Story
                </span>
                <br />
                <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
                  Time.AI
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg sm:text-xl lg:text-2xl text-gray-600 font-medium min-h-[50px] lg:min-h-[60px]"
              >
                <Typewriter
                  words={[
                    'Create stories with AI assistance',
                    'Collaborate with writers worldwide',
                    'Publish and share instantly',
                    'Let your imagination run wild'
                  ]}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={2000}
                />
              </motion.div>
            </div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-3"
            >
              {['AI Writing Assistant', 'Real-time Collaboration', 'Instant Publishing'].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200/50"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
                  {feature}
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleNavigation}
                size="lg"
                className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-gray-800 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300 hover:scale-105"
              >
                <FaRocket className="mr-2" />
                Start Writing Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
                <Button
                onClick={handleShowDemo} // Add this onClick handler
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105"
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </motion.div>
    <AnimatePresence>
        {showDemo && (
          <DemoVideoShowcase onClose={handleCloseDemo} />
        )}
      </AnimatePresence>
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="grid grid-cols-3 gap-4 lg:gap-6 pt-4 lg:pt-6"
            >
              {[
                { number: "10K+", label: "Stories Created" },
                { number: "5K+", label: "Active Writers" },
                { number: "50+", label: "Countries" }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-gray-900">{stat.number}</div>
                  <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form & Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center space-y-6 lg:space-y-8"
          >
            {/* Logo Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative"
              >
                <div className="w-56 h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 rounded-3xl bg-gradient-to-br from-white to-gray-100 shadow-2xl p-4 lg:p-6 ring-8 ring-white/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 via-transparent to-gray-200/50"></div>
                  <Image
                    src="/uploads/StoryMagic.png"
                    alt="StoryTime Logo"
                    width={320}
                    height={320}
                    className="relative object-contain rounded-2xl w-full h-full"
                  />
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white"
                  >
                    <FaStar className="w-4 h-4" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white"
                  >
                    <FaHeart className="w-4 h-4" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Login Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md">
                <LoginForm />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Hint */}
        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
            >
              <p className="text-sm text-gray-500 mb-2">Discover more features</p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronDown className="w-6 h-6 text-gray-400 mx-auto" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 py-20 bg-gradient-to-b from-transparent to-gray-50/50"
      >
        <div className="container mx-auto px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Why Choose StoryTime.AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of creative writing with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/30 h-full transition-all duration-300 group-hover:shadow-xl">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 py-20"
      >
        <div className="container mx-auto px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              What Writers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied creators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-white/30 h-full transition-all duration-300 group-hover:shadow-xl">
                  <FaQuoteLeft className="w-8 h-8 text-gray-400 mb-4" />
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {testimonial.text}
                  </p>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 py-20 bg-gradient-to-r from-gray-800 to-gray-900"
      >
        <div className="container mx-auto px-6 sm:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Story?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of creative writers and bring your ideas to life with AI assistance
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleNavigation}
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-2xl px-8 py-4 text-lg font-semibold shadow-xl transition-all duration-300"
              >
                <Sparkles className="mr-2 w-5 h-5" />
                Get Started Free Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

    </main>
  );
}