// Utility functions for JWT token handling

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const payload = token.split('.')[1];

    // Decode the base64 payload
    const decodedPayload = JSON.parse(atob(payload));

    return {
      id: decodedPayload.id || decodedPayload.userId || decodedPayload.sub,
      email: decodedPayload.email || decodedPayload.sub,
      name: decodedPayload.name || decodedPayload.username
    };
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

export const getCurrentUserId = () => {
  const user = getUserFromToken();
  return user ? user.id : null;
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    // Check if token is expired
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

