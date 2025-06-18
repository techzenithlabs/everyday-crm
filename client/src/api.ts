import axios from "axios";

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: false,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

 api.interceptors.request.use((config) => {
  const persistRoot = localStorage.getItem("persist:root");

  if (persistRoot) {
    try {
      const parsedRoot = JSON.parse(persistRoot);
      const auth = parsedRoot.auth ? JSON.parse(parsedRoot.auth) : null;

      if (auth?.token) {     
        config.headers.Authorization = `Bearer ${auth.token}`;
      }
    } catch (e) {
      console.warn("Failed to parse auth token from persist:root");
    }
  }

  return config;
});
export default api;
