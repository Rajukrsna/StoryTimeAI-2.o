"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHorizontal } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStories } from "@/api/storyApi";
import { getAuthors } from "@/api/profile";
import Image from "next/image"; 
import ReactMarkdown from 'react-markdown';
import type { Story, User } from "@/types";

export default function ExplorePage() {
    const [activeTab, setActiveTab] = useState<"stories" | "authors">("stories");
    const [stories, setStories] = useState<Story[]>([]);
    const [authors, setAuthors] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<'latest' | 'oldest' | 'top'>('latest');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (activeTab === "stories") {
                    const storiesData = await getStories(search, sort);
                    setStories(storiesData);
                } else {
                    const authorsData = await getAuthors();
                    setAuthors(authorsData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, search, sort]);

    return (
      <main className="min-h-screen px-4 py-6 md:px-6 lg:px-8">
        {/* Navigation Section */}
        <nav className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-gray-200/50">
          {/* Left: Explore and Toggle */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 animate-slide-in-left">Explore</h1>
            <ToggleGroup
              type="single"
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "stories" | "authors")}
              className="flex bg-white shadow-md rounded-2xl border-2 border-gray-200/50 overflow-hidden"
            >
              <ToggleGroupItem
                value="stories"
                className="px-6 py-3 text-base font-semibold transition-all duration-200"
              >
                Stories
              </ToggleGroupItem>
              <ToggleGroupItem
                value="authors"
                className="px-6 py-3 text-base font-semibold transition-all duration-200"
              >
                Authors
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Right: Sort, Search, Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto animate-slide-in-right">
            <ToggleGroup
              type="single"
              value={sort}
              onValueChange={(value) => setSort((value as "latest" | "oldest" | "top") || "latest")}
              className="flex bg-white shadow-md rounded-2xl border-2 border-gray-200/50 overflow-hidden"
            >
              <ToggleGroupItem value="latest" className="px-4 py-2 text-sm font-semibold">
                Latest
              </ToggleGroupItem>
              <ToggleGroupItem value="oldest" className="px-4 py-2 text-sm font-semibold">
                Oldest
              </ToggleGroupItem>
              <ToggleGroupItem value="top" className="px-4 py-2 text-sm font-semibold">
                Top
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 border-2 border-gray-200/50 shadow-md"
                />
              </div>
              <Button variant="outline" size="icon" className="border-2 border-gray-200/50 shadow-md hover:shadow-lg">
                <Filter size={20} className="text-gray-600" />
              </Button>
            </div>
          </div>
        </nav>

        {/* Content Section */}
        <section className="mt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 text-lg animate-pulse">Loading amazing content...</p>
            </div>
          ) : activeTab === "stories" ? (
            <StoriesList stories={stories} />
          ) : (
            <AuthorsList authors={authors} />
          )}
        </section>
      </main>
    );
}

function StoriesList({ stories }: { stories: Story[] }) {
    const router = useRouter();
    const handleNavBook = (id: string) => {
        router.push(`/book/${id}`);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <CardHorizontal
            key={story._id}
            className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 shadow-lg 
              hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] 
              transition-all duration-300 ease-out 
              flex flex-col gap-6 cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleNavBook(story._id)}
          >
            {/* Cover Image */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
              <Image
                src={story.imageUrl || "/uploads/cover.jpg"}
                alt={story.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Story Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-black mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                {story.title}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                by{" "}
                {story.author
                  ? typeof story.author === "string"
                    ? story.author
                    : story.author.name
                  : "Unknown"}
              </p>

              <div className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-4">
                <ReactMarkdown>
                  {story.content[0].content.substring(0, 120) + "..."}
                </ReactMarkdown>
              </div>

              <Button
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavBook(story._id);
                }}
              >
                Read Now
              </Button>
            </div>
          </CardHorizontal>
        ))}
      </div>
    );
}

function AuthorsList({ authors }: { authors: User[] }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {authors.map((author, index) => (
          <CardHorizontal
            key={author._id}
            className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200/50 shadow-lg 
              hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] 
              transition-all duration-300 ease-out 
              flex flex-col items-center text-center gap-4 cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Profile Image */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
              <Image
                src={author.profilePicture || "/default-user.png"}
                alt={author.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Author Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:text-gray-700 transition-colors">
                {author.name}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {author.bio?.substring(0, 120) || "No bio available."}
              </p>
            </div>
          </CardHorizontal>
        ))}
      </div>
    );
}