import axiosWatchParty from "./axiosWatchParty";
import axiosSocket from "./axiosSocket";

// HOST
export const createWatchParty = async (movieId) => {
  const response = await axiosWatchParty.post(`/create/${movieId}`);
  return response.data;
};

// GUEST
export const joinWatchParty = async (roomCode) => {
  const response = await axiosWatchParty.post(`/join/${roomCode}`);
  return response.data;
};

// SYNC (different controller)
export const getWatchPartySync = async (roomCode) => {
  const response = await axiosSocket.get(`/watch-party/${roomCode}/sync`);
  return response.data;
};
