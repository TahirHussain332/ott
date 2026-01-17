import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://ec2-13-234-67-86.ap-south-1.compute.amazonaws.com:9090/api/user",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
