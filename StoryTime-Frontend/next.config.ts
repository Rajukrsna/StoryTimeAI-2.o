import { NextConfig } from "next";

const nextConfig: NextConfig = {
 
  //basePath: "/StoryTime-Frontend", 
  trailingSlash: true,
   images: {
    domains: ['storytime-user-profile-pics.s3.amazonaws.com'], // ✅ Add your S3 domain here
  },
};

export default nextConfig;
