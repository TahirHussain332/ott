import axiosInstance from "./axiosInstance";

export const getAllMovies = async () => {
  const response = await axiosInstance.get("/allMovies");
  return response.data;
};

export const playMovie = async (movieId) => {
  const response = await axiosInstance.get(`/movies/${movieId}/play`);
  return response.data;
};
