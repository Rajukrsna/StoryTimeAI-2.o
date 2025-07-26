import { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  //basePath: "/StoryTime-Frontend", 
  trailingSlash: true,
   images: {
    domains: ['res.cloudinary.com', 'cdn-icons-png.flaticon.com'],
  },
};

export default nextConfig;
