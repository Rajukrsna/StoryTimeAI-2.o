// utils/axiosInstances/basicClient.ts
import axios from "axios";

const basicClient = axios.create({
  baseURL: "http://localhost:5010",
  headers: {
    "Content-Type": "application/json",
  },
    withCredentials: true,

});

export default basicClient;
