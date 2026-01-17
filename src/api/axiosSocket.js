import axios from "axios";

const axiosSocket = axios.create({
  baseURL: "http://ec2-13-234-67-86.ap-south-1.compute.amazonaws.com:9090",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosSocket.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosSocket;
