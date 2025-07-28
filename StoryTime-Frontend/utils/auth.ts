import {  setCookie, deleteCookie } from 'cookies-next';

const TOKEN_KEY = 'authToken';

export const getAuthToken = (): string | null => {
  const token = localStorage.getItem("authToken");
  return token;
};
export const refreshAuthToken = async (): Promise<string | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL2}/api/users/refresh`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        setCookie(TOKEN_KEY, data.token);
        return data.token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
};

export const logoutUser = (): void => {
    deleteCookie(TOKEN_KEY);
};