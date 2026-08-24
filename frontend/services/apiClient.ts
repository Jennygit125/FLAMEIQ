import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://flameiq-82s9.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("flameiq_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

/*apiClient.interceptors.response.use(
  (response) => {
    // Store the response in session storage
    sessionStorage.setItem("backendResponse", JSON.stringify(response.data));
    return response;
  },
  (error) => {
    // Clear the session storage in case of an error
    sessionStorage.removeItem("backendResponse");
    throw error;
  }
);*/

export default apiClient;