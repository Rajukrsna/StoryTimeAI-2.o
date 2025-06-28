import AuthorStories from "@/components/authorStories"
import { Navbar } from "@/components/Navbar"
import { Button } from "@/components/ui/button"
import Image from "next/image"; 

export default function AuthorPage() {

    const previewUrl = "/profile-picture-placeholder.svg"

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="flex-col items-center p-10">
                <div className="flex items-center pb-10">

                    <div className="flex flex-col items-center text-center w-1/3">
                        <div className="relative h-100 w-100 overflow-hidden rounded-full bg-gray-300 mb-4">
                           
<Image
  src={previewUrl}
alt="Profile Picture"   
  className="object-cover rounded-full"
/>
                        </div>
                        <Button variant="default" className="mb-2 w-[50%]">Follow</Button>
                    </div>

                    <div className="w-2/3 flex justify-right ">
                        <div className="w-full max-w-4xl p-6 flex flex-col ">
                            <div className="mb-4">
                                <h1 className="text-6xl font-bold pb-5">Author</h1>
                                <h2 className="text-2xl ">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-px bg-gray-300 w-full my-4" />
                <div className="p-10">
                    <h1 className="text-4xl font-bold pt-10 pb-4">Author Stories</h1>
                    <AuthorStories />
                </div>

            </div>
        </main>
    )
} 