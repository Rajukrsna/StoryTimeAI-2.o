import { NextConfig } from "next";

const nextConfig: NextConfig = {
 async redirects() {
    return [
      {
        source: '/api/auth/providers',
        destination: '/api/auth/providers/',
        permanent: true,
      },
    ]
  },
  //basePath: "/StoryTime-Frontend", 
  trailingSlash: true,
   images: {
    domains: ['res.cloudinary.com', 'cdn-icons-png.flaticon.com','lh3.googleusercontent.com'],
  },
};



export default nextConfig;
