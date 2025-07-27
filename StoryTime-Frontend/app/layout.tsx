import type { Metadata } from "next";
import { Geist, Geist_Mono ,Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';
import { Analytics } from "@vercel/analytics/react"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryTime.AI - Where AI meets human creativity",
  description: "Unleash your storytelling potential with AI-powered collaborative writing. Create, compete, and collaborate on unique stories with our vibrant community.",
  keywords: ["AI storytelling", "creative writing", "collaborative stories", "story battles", "AI writing assistant"],
  authors: [{ name: "StoryTime.AI Team" }],
  openGraph: {
    title: "StoryTime.AI - Where AI meets human creativity",
    description: "Unleash your storytelling potential with AI-powered collaborative writing. Create, compete, and collaborate on unique stories with our vibrant community.",
    type: "website",
    locale: "en_US",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       
       
      <body
      className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <Toaster position="top-center" richColors />
        {children}
         <Analytics />
      </body>
    </html>
  );
}


