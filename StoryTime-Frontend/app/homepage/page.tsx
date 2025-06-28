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
    <main className="min-h-screen bg-white text-gray-900 font-sans">
      <Navbar />

      <section className="flex flex-col px-6 sm:px-12 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-10 animate-fade-in">
          <div>
           <h1 className="text-4xl sm:text-7xl font-extrabold leading-tight text-gray-900 transition-all duration-300">
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
            <p className="text-lg sm:text-2xl font-medium mt-4 text-gray-700 transition-opacity duration-300">
              Would you like to start your story?
            </p>
          </div>

          <div className="flex justify-start sm:justify-end">
            <Button
              onClick={handleNavCreate}
              className="text-lg sm:text-xl mt-6 sm:mt-0 px-6 py-3  text-white font-semibold rounded-lg shadow-md transition-transform duration-200 hover:scale-105"
            >
              Start a Book
            </Button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-300 my-12 w-full sm:w-4/5 mx-auto" />

        {/* Explore Section */}
        <div className="pt-6 animate-slide-up fade-in">
          <ExplorePage />
        </div>
      </section>
    </main>
  );

}