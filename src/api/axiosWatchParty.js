import axios from "axios";

const axiosWatchParty = axios.create({
  baseURL: "http://localhost:9090/user/watch-party",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosWatchParty.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosWatchParty;
