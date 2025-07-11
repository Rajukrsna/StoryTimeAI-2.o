import expressClient from './axiosInstance/expressClient';
import lambdaClient from './axiosInstance/lambdaClient'; 
import type { Story, User, Contribution, Chapter,Author, ChapterStatus  } from "@/types"; // Adjust the path as needed

interface ChapterResponse{
  chapters: ChapterStatus[];  
}

export const getAuthors = async (): Promise<User[]> => {
    const response = await expressClient.get<User[]>('api/users/all');
    
    return response.data;
};

//  Get current logged-in user's profile
export const getMyProfile = async (): Promise<User> => {
  const response = await expressClient.get<User>("/api/users/profile");
  return response.data;
};

//  Get user by ID (publicly accessible)
export const getUserById = async (userId: string): Promise<User> => {
  const response = await lambdaClient.get<User>(`/users${userId}`);
  return response.data;
};

// Update user profile
export const updateMyProfile = async (data: Partial<User> & { password?: string }): Promise<User> => {
  const response = await lambdaClient.put<User>("/users/profile", data);
  return response.data;
};

// export const updateContribution = async (
//   data: Partial<User> & { password?: string }
// ): Promise<User> => {
//   const response = await apiClient.put<User>("/users/updateContribution", data);
//   return response.data;
// };

interface UploadResponse {
  message: string;
  filePath: string;
}

export const updateProfileImage = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('profilePicture', file);

  const response = await expressClient.post<UploadResponse>(
    "/api/users/change-pic",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};



export const fetchMyChaptersStatus = async (
): Promise<ChapterStatus[] > => {
  const response = await expressClient.get<ChapterResponse>(`/api/users/my-chapters`);
  console.log(response)

  return response.data.chapters;
};

// New API functions for follow/unfollow
export const followUser = async (userId: string): Promise<void> => {
  await expressClient.post(`/api/users/${userId}/follow`);
};

export const unfollowUser = async (userId: string): Promise<void> => {
  await expressClient.post(`/api/users/${userId}/unfollow`);
};