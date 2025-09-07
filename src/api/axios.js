import axios from "axios";
import queryClient from "../queryClient";

const api = axios.create({
  baseURL: "https://linked-posts.routemisr.com",
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.token = token;
  }
  return config;
});

// After any mutating request, invalidate core queries
api.interceptors.response.use(
  (response) => {
    const method = response.config?.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      // Try to invalidate specific post if id is present in URL
      const match = response.config?.url?.match(/\/posts\/(\w+)/);
      if (match?.[1]) {
        queryClient.invalidateQueries({ queryKey: ["posts", match[1]] });
      }
    }
    return response;
  },
  (error) => {
    const method = error.config?.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    }
    return Promise.reject(error);
  }
);

export default api;


