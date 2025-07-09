"use client"

import { Button } from "@/components/ui/button"
import ExplorePage from "../../components/exploreComponent"
import { Navbar } from "@/components/Navbar"
import { useRouter } from "next/navigation";
import { Typewriter } from 'react-simple-typewriter';

export default function HomePage() {
    const router = useRouter();

    const handleNavCreate = () => router.push("/create");

    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 font-sans">
        <Navbar />

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12 animate-fade-in">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 transition-all duration-300 mb-4">
                <Typewriter
                  words={['Welcome', 'Start your story', 'Let your words fly']}
                  loop={true}
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-700 transition-opacity duration-300 max-w-2xl mx-auto lg:mx-0">
                Would you like to start your story?
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Button
                onClick={handleNavCreate}
                size="lg"
                className="text-lg sm:text-xl px-8 py-4 bg-black text-white font-semibold rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl animate-bounce-subtle"
              >
                Start a Book
              </Button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-12 lg:my-16 w-full max-w-4xl mx-auto" />

          {/* Explore Section */}
          <div className="pt-6 animate-slide-up">
            <ExplorePage />
          </div>
        </section>
      </main>
    );
}