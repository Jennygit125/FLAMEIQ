import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Essential for CORS with cookies/sessions across origins
  withCredentials: true,
  timeout: 10000, // 10s timeout to prevent hanging requests
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("flameiq_token");
      if (token) {
        // Axios v1+ header assignment syntax
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data, // Unwraps response so you get `data` directly
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== "undefined") {
      // Clear token and redirect on unauthorized access
      localStorage.removeItem("flameiq_token");
      window.location.href = "/login";
    }

    return Promise.reject({
      message: error.response?.data?.message || "An unexpected error occurred",
      status: status,
      raw: error,
    });
  }
);

export default apiClient;