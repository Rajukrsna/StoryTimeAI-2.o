import expressClient from './axiosInstance/expressClient';

// Define the Battle interface
interface Battle {
  _id: string;
  title: string;
  description: string;
  theme: string;
  status: 'upcoming' | 'active' | 'voting' | 'completed';
  startTime: string;
  endTime: string;
  votingEndTime: string;
  participants: Array<{
     user: { _id: string; name: string; profilePicture: string ; }
     joinedAt: string;
     submission?: Submission | null;
    }>;
  maxParticipants: number;
  totalVotes?: number;
  winner?: { _id: string; name: string; profilePicture: string };
  createdBy: { _id: string; name: string; profilePicture: string };
  battleType?: string;
  prizes?: Array<{ position: number; reward: string; points: number }>;
}

interface BattleResponse {
  success: boolean;
  battles: Battle[];
  pagination: {
    totalPages: number;
    currentPage: number;
    total: number;
  };
}

interface BattleDetailResponse {
  success: boolean;
  battle: Battle;
}

interface JoinBattleResponse {
  success: boolean;
  message: string;
  user: string; // User ID of the participant
  battle: Battle; // Updated battle details after joining
}

interface CreateBattleResponse {
  success: boolean;
  battle: Battle;
}

interface Submission {
  _id: string;
  title: string;
  content: string;
  wordCount: number;
  author: { _id: string; name: string; profilePicture: string };
  submittedAt: string;
  totalVotes: number;
  ranking: number;
  votes: Array<{ user: string }>;
}

interface SubmissionsResponse {
  success: boolean;
  submissions: Submission[];
}

interface SubmitStoryResponse {
  success: boolean;
  submission: Submission;
}

interface VoteResponse {
  success: boolean;
  message: string;
  submission: Submission;
  battleTotalVotes: number; // Total votes for the battle after voting
}

// Get all battles with filters and pagination
export const getBattles = async (params: URLSearchParams): Promise<BattleResponse> => {
  const response = await expressClient.get<BattleResponse>(`/api/battles?${params}`);
  return response.data;
};

// Get single battle details
export const getBattleById = async (battleId: string): Promise<BattleDetailResponse> => {
  const response = await expressClient.get<BattleDetailResponse>(`/api/battles/${battleId}`);
  return response.data;
};

// Join a battle - FIXED: Now returns proper response type
export const joinBattle = async (battleId: string): Promise<JoinBattleResponse> => {
  const response = await expressClient.post<JoinBattleResponse>(`/api/battles/${battleId}/join`);
  return response.data;
};

// Create a new battle
export const createBattle = async (battleData: {
  title: string;
  description: string;
  theme: string;
  battleType?: string;
  startTime: string;
  duration?: number;
  votingDuration?: number;
  maxParticipants?: number;
  prizes?: Array<{ position: number; reward: string; points: number }>;
}): Promise<CreateBattleResponse> => {
  const response = await expressClient.post<CreateBattleResponse>('/api/battles', battleData);
  return response.data;
};

// Get battle submissions
export const getBattleSubmissions = async (battleId: string): Promise<SubmissionsResponse> => {
  const response = await expressClient.get<SubmissionsResponse>(`/api/battles/${battleId}/submissions`);
  return response.data;
};

// Submit story to battle
export const submitStoryToBattle = async (battleId: string, storyData: {
  title: string;
  content: string;
}): Promise<SubmitStoryResponse> => {
  const response = await expressClient.post<SubmitStoryResponse>(`/api/battles/${battleId}/submit`, storyData);
  return response.data;
};

// Vote for a submission
export const voteForSubmission = async (submissionId: string): Promise<VoteResponse> => {
  const response = await expressClient.post<VoteResponse>(`/api/battles/submissions/${submissionId}/vote`);
  return response.data;
};

// Export types for use in components
export type {
  Battle,
  BattleResponse,
  BattleDetailResponse,
  JoinBattleResponse,
  CreateBattleResponse,
  Submission,
  SubmissionsResponse,
  SubmitStoryResponse,
  VoteResponse
};