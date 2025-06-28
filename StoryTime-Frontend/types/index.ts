// This file defines TypeScript types and interfaces used throughout the project. 
// It may include types for API responses, authentication tokens, and any other relevant data structures.

export interface AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    status: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    // Add other user properties as needed
}