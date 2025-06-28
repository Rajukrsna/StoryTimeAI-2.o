import { Button } from "./ui/button";
import { CardHorizontal } from "./ui/card";
import Image from "next/image"; 
const stories = [
    {
        id: 1,
        title: "The Dragon Story",
        genre: "Fantasy",
        wordCount: 123000,
        chapters: 3,
        author: "John Doe",
        coverImage: "/placeholder-story.jpg",
    },
    {
        id: 2,
        title: "The Lost Kingdom",
        genre: "Adventure",
        wordCount: 98000,
        chapters: 5,
        author: "Jane Smith",
        coverImage: "/placeholder-story2.jpg",
    },
    {
        id: 3,
        title: "Cybernetic Dawn",
        genre: "Sci-Fi",
        wordCount: 150000,
        chapters: 7,
        author: "Mark Lee",
        coverImage: "/placeholder-story3.jpg",
    },
];

export default function AuthorStories() {
    return (
        <div className="grid gap-6">
            {stories.map((story) => (
                <CardHorizontal key={story.id} className="p-6 flex items-center justify-between">
                    <div className="flex-1 pr-4">
                        <p className="text-m text-gray-500">{story.genre}</p>
                        <h2 className="text-xl font-semibold">{story.title}</h2>
                        <p className="text-m text-gray-500">
                            {story.wordCount.toLocaleString()} words - {story.chapters} Chapters
                        </p>
                        <p className="text-m text-gray-700">by {story.author}</p>
                        <div className="flex gap-1.5">
                            <Button className="mt-2">Read Now</Button>
                        </div>
                    </div>
                    <div className="w-128 h-58 flex-shrink-0 bg-gray-300 rounded-lg overflow-hidden">
                        <Image
  src={story.coverImage}  alt={story.title}
  fill
  className="object-cover rounded-full"
/>
                    </div>
                </CardHorizontal>
            ))}
        </div>
    );
}