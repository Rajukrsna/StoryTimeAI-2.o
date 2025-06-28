import apiClient from "./axiosInstance";

interface LoginResponse {
  _id:string,
  token: string;
}

interface LoginResult {
  _id: string;
  success: boolean;
  message?: string;
  token?: string;
}
import { setCookie } from "cookies-next";

export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const requestBody = { email, password };
    console.log("📤 Sending Login Data:", requestBody);

    const response = await apiClient.post<LoginResponse>(
      "/users/login",
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const { token } = response.data;
    localStorage.setItem("authToken", token);
    setCookie("authToken", token, { path: "/" }); // Ensure the token is available in cookies
    
    console.log("✅ Login successful, token stored.");

    return { success: true, token, _id:response.data._id };
  } catch (error: any) {
    console.error("❌ Error occurred during login:", error);

    let errorMessage = "An error occurred. Please try again.";

    if (error.response) {
      // API returned a response (error status)
      errorMessage = error.response.data.message || "Invalid email or password.";
    } else if (error.request) {
      // No response received
      errorMessage = "Server unreachable. Please check your internet connection.";
    }

    return { success: false, message: errorMessage ,_id:"notfound"};
  }
};


