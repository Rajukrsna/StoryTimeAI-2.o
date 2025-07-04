// utils/axiosInstances/basicClient.ts
import axios from "axios";

const basicClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL2,
  headers: {
    "Content-Type": "application/json",
  },
    withCredentials: true,

});

export default basicClient;
