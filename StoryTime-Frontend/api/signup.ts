import expressClient from './axiosInstance/expressClient';
import lambdaClient from './axiosInstance/lambdaClient'; // Ensure this is the correct import for your API client
interface SignUpResponse {
  token: string;
}

export const signup = async (
  name: string,
  email: string,
  password: string,
  profilePicture: File | null // Change File to string (URL)
): Promise<void> => {
 
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  if (profilePicture) {
    formData.append("profilePicture", profilePicture);
  }

  // 🛑 Log the request payload
  console.log("📤 Sending Signup Data:", formData);

  try {
    const response = await lambdaClient.post<SignUpResponse>(
      "/users/register", // ✅ Correct path
      formData ,
      {
        headers: {  "Content-Type": "multipart/form-data",}, // Ensure JSON headers
      }
    );

    const { token } = response.data;
    localStorage.setItem("authToken", token);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ Sign-up failed", (error as any).response?.data || error.message);
    } else {
      console.error("❌ Sign-up failed with an unknown error", error);
    }
    throw error;
  }
  
};

