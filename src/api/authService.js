import axiosInstance from "./axiosInstance";

export const loginUser = async (loginData) => {
  const response = await axiosInstance.post("/login", loginData);
  return response.data;
};

export const registerUser = async (registerData) => {
  const response = await axiosInstance.post("/save", registerData);
  return response.data;
};
