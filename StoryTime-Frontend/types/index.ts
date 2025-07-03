// src/types.ts

export interface Contribution {
  title: string;
  score: number;
}

export interface User {
  _id: string;
  name: string;
  profilePicture?: string;
  email?: string;
  bio?: string;
  contributions?: Contribution[];
}

export interface Chapter {
  _id?: string;
  title: string;
  content: string;
  likes: number;
  summary: string;
  embedding?: number[];
  createdBy: string | User;
  createdAt: string;
}

export interface PendingChapter extends Chapter {
  requestedBy: string | User;
  status: "pending" | "approved" | "rejected";
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  profileImage: string;
}

export interface Story {
  _id: string;
  title: string;
  content: Chapter[];
  pendingChapters: PendingChapter[];
  author: Author;
  votes: number;
  imageUrl: string;
}
export interface ChapterStatus {
  storyTitle: string;
  chapterTitle: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

