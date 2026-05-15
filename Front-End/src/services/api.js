import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    headers: {
        "Content-Type": "application/json",
    },
    });

    // add the token automatically to every request if exists
    api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
    });

    // go to login page if token is invalid or expired
    api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;