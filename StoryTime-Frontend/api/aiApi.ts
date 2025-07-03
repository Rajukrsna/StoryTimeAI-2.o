import expressClient from './axiosInstance/expressClient';

interface AISuggestion{
    id: string;
    suggestion: string;
    summary: string;
}



export const createAIStory = async (title: string, content: string): Promise<AISuggestion> => {
    const response = await expressClient.post<AISuggestion>('/api/ai-suggestions', { title, content});
    return response.data;
};


interface PlotBotResponse {
  response: string; // match the field returned from backend
}

export const sendToPlotBot = async (
  prompt: string,
  embed: number[]
): Promise<string> => {
  const res = await expressClient.post<PlotBotResponse>(
    "/api/ai-suggestions/plot-bot",
    { prompt, embed }
  );
  return res.data.response;
};
