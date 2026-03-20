import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

//REQUEST: attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//RESPONSE: handle token expiry
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    //Don't retry refresh endpoint itself
    if (originalRequest.url.includes("/auth/refresh")) {
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          "http://localhost:5001/api/auth/refresh",
          { refreshToken }
        );

        // ✅ FIXED
        const newAccessToken = res.data?.data?.accessToken;

        if (!newAccessToken) throw new Error("No access token received");

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);

        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;