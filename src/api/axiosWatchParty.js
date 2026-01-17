import axios from "axios";

const axiosWatchParty = axios.create({
  baseURL: "http://ec2-13-234-67-86.ap-south-1.compute.amazonaws.com:9090/user/watch-party",
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
