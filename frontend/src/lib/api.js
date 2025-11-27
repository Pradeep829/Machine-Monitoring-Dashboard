import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authAPI = {
    login: async (email, password) => {
        const response = await api.post("/login", { email, password });
        return response.data;
    },
};

export const machinesAPI = {
    getAll: async () => {
        const response = await api.get("/machines");
        return response.data;
    },
    getByName: async (name) => {
        const response = await api.get(`/machines/${name}`);
        return response.data;
    },
    update: async (name, data) => {
        const response = await api.post(`/machines/${name}/update`, data);
        return response.data;
    },
};

export default api;
