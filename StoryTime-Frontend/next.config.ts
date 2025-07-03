import { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  //basePath: "/StoryTime-Frontend", 
  trailingSlash: true,
   images: {
    domains: ['res.cloudinary.com'], // ✅ Add your S3 domain here
  },
};

export default nextConfig;
