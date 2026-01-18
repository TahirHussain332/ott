import axios from "axios";

const axiosSocket = axios.create({
  baseURL: "https://myotttest.duckdns.org",
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
