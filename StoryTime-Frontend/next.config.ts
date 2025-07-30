import { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  //basePath: "/StoryTime-Frontend", 
  trailingSlash: true,
   images: {
    domains: ['res.cloudinary.com', 'cdn-icons-png.flaticon.com','lh3.googleusercontent.com'],
  },
};



export default nextConfig;
