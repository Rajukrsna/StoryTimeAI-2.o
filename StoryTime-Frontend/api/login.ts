import expressClient from './axiosInstance/expressClient';

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

    const response = await expressClient.post<LoginResponse>(
      "/api/users/login",
      requestBody,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("✅ Login successful, response received.");
   console.log("Login response:", response.data);

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




// export const googleLogin = async (provider: string, options: any): Promise<LoginResult> => {  
//   try {
//     console.log("📤 Sending Google Login Data:", { provider, options });

//     const response = await expressClient.post<LoginResponse>(
//       "/api/users/google-auth",
//       { provider, options },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );

//     console.log("✅ Google login successful, response received.");
//     console.log("Google login response:", response.data);

//     const { token } = response.data;
//     localStorage.setItem("authToken", token);
//     setCookie("authToken", token, { path: "/" }); // Ensure the token is available in cookies

//     return { success: true, token, _id:response.data._id };
//   } catch (error: any) {
//     console.error("❌ Error occurred during Google login:", error);

//     let errorMessage = "An error occurred. Please try again.";

//     if (error.response) {
//       // API returned a response (error status)
//       errorMessage = error.response.data.message || "Google login failed.";
//     } else if (error.request) {
//       // No response received
//       errorMessage = "Server unreachable. Please check your internet connection.";
//     }

//     return { success: false, message: errorMessage ,_id:"notfound"};
//   }
// }
