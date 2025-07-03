import expressClient from './axiosInstance/expressClient';
import lambdaClient from './axiosInstance/lambdaClient';  
import type { Story, User, Contribution, Chapter,Author  } from "@/types"; // Adjust the path as needed



export const getStories = async (
  search?: string,
  sort?: "latest" | "oldest" | "top"
): Promise<Story[]> => {
  const params = new URLSearchParams();
  if (search?.trim()) params.append("search", search.trim());
  if (sort) params.append("sort", sort);

  const response = await lambdaClient.get<Story[]>(
    `/stories?${params.toString()}`
  );
  return response.data;
};


export const getStory = async (id: string): Promise<Story> => {
    const response = await expressClient.get<Story>(`/api/stories/${id}`);
    return response.data;
};

export const createStory = async (title: string,  initialContent: string 
,imageUrl: string, summary: string, embeds: number[]): Promise<Story> => {
    const response = await expressClient.post<Story>('/api/stories', { title,  chapters: [
      {
        
        content: initialContent,
      }
    ], imageUrl, summary , embeds});
    return response.data;
};

export const updateStory = async (id: string, story: Story, newChap: Chapter): Promise<Story> => {
    const response = await expressClient.put<Story>(`api/stories/${id}`,  
        { votes: story.votes, content: story.content, newChapter: newChap}
 );
    return response.data;
};

export const deleteStory = async (id: string): Promise<void> => {
    await lambdaClient.delete(`/stories/${id}`);
};

export interface LeaderboardEntry {
  userId: string;
  name: string;
  profilePicture?: string;
  totalScore: number;
}
export const getLeaderBoard = async (title: string): Promise<LeaderboardEntry[]> => {
  const response = await expressClient.get<LeaderboardEntry[]>(`/api/stories/leaderboard/${title}`);
  return response.data;
};

export const getUserStories = async():Promise<Story[]> => {
  const response = await lambdaClient.get<Story[]>("/stories/getUserStories");
  return response.data;
};

export const approveStory = async(storyId: string, chapterIndex: number): Promise<Story> =>{
  const response = await expressClient.put<Story>(`/api/stories/${storyId}/approve-chapter/${chapterIndex}`)
  return response.data;
};

export const rejectStory = async ( storyId: string , chapterIndex: number): Promise<Story>=>{
  const response = await expressClient.delete<Story>(`/api/stories/${storyId}/reject-chapter/${chapterIndex}`)
  return response.data
}

