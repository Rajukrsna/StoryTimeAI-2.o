"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardHorizontal } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { getStories } from "@/api/storyApi";
import { getAuthors } from "@/api/profile";
import Image from "next/image"; 
import ReactMarkdown from 'react-markdown';
import type { Story, User, Chapter,Author ,PendingChapter } from "@/types"; // Adjust the path as needed

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
                   // console.log("Received Stories", storiesData);
                    setStories(storiesData);
                } else {
                    const authorsData = await getAuthors();
                    //console.log("Author data", authorsData);
                    setAuthors(authorsData);
                }

                } catch (error) {
                console.error("Error fetching data:", error);
                } finally {
                setLoading(false);
                }
            };

            fetchData();
            }, [activeTab, search, sort]); // 👈 Add `search` and `sort` to the dependency array


    return (
  <main className="min-h-screen px-4 py-6 md:px-10 ">
    {/* Navigation Section */}
    <nav className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-gray-200">
      {/* Left: Explore and Toggle */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Explore •</h1>
        <ToggleGroup
          type="single"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "stories" | "authors")}
          className="flex bg-white shadow-sm rounded-md border border-gray-300 overflow-hidden"
        >
          <ToggleGroupItem
            value="stories"
            className="px-4 py-2 text-sm font-medium"
          >
            Stories
          </ToggleGroupItem>
          <ToggleGroupItem
            value="authors"
            className="px-4 py-2 text-sm font-medium"
          >
            Authors
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Right: Sort, Search, Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
        <ToggleGroup
          type="single"
          value={sort}
          onValueChange={(value) => setSort((value as "latest" | "oldest" | "top") || "latest")}
          className="flex bg-white shadow-sm rounded-md border border-gray-300 overflow-hidden"
        >
          <ToggleGroupItem value="latest" className="px-4 py-2 text-sm font-medium">
            Latest
          </ToggleGroupItem>
          <ToggleGroupItem value="oldest" className="px-4 py-2 text-sm font-medium">
            Oldest
          </ToggleGroupItem>
          <ToggleGroupItem value="top" className="px-4 py-2 text-sm font-medium">
            Top
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 border-gray-300 shadow-sm"
          />
          <Button variant="outline" size="icon" className="border-gray-300 shadow-sm">
            <Filter size={18} className="text-gray-600" />
          </Button>
        </div>
      </div>
    </nav>

    {/* Content Section */}
   {/* Content Section */}
<section className="mt-8">
  {loading ? (
    <div className="flex justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500 text-sm">Loading...</p>

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
        router.push(`/book/${id}` ); // Navigate to the selected book ID
    };

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {stories.map((story) => (
      <CardHorizontal
        key={story._id}
        className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm 
          hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] 
          transition-transform duration-300 ease-in-out 
          flex flex-col sm:flex-row gap-6"
      >
        {/* Cover Image */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border border-gray-300 shadow">
          <Image
            src={story.imageUrl || "/uploads/cover.jpg"}
            alt={story.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Story Info */}
        <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-black mb-1 flex items-start gap-2">
        
        <span className="break-words">{story.title}</span>
        </h2>

          <p className="text-sm text-gray-500 mb-1">
            by{" "}
            {story.author
              ? typeof story.author === "string"
                ? story.author
                : story.author.name
              : "Unknown"}
          </p>

          <div className="text-sm text-gray-700 mt-2 leading-relaxed line-clamp-3">
            <ReactMarkdown>
              {story.content[0].content.substring(0, 120) + "..."}
            </ReactMarkdown>
          </div>

          <div className="mt-4">
            <Button
              onClick={() => handleNavBook(story._id)}
              className="bg-black hover:bg-black/90 text-white text-sm px-4 py-2 rounded-md"
            >
              Read Now
            </Button>
          </div>
        </div>
      </CardHorizontal>
    ))}
  </div>
);
}


function AuthorsList({ authors }: { authors: User[] }) {
   return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {authors.map((author) => (
      <CardHorizontal
        key={author._id}
        className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm 
          hover:shadow-md hover:-translate-y-1 hover:scale-[1.015] 
          transition-transform duration-300 ease-in-out 
          flex flex-col sm:flex-row items-start gap-4"
      >
        {/* Profile Image */}
        <img
          src={author.profilePicture || "/default-user.png"}
          alt={author.name}
          className="w-20 h-20 rounded-full object-cover border border-gray-300 shadow-sm"
        />

        {/* Author Info */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-black mb-1">{author.name}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {author.bio?.substring(0, 120) || "No bio available."}
          </p>
        </div>
      </CardHorizontal>
    ))}
  </div>
);
}
