import axios from "axios";

const apiClient = axios.create({
	baseURL: globalThis.__AJALI_API_URL__ || "http://localhost:5000/api",
	headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("ajali_token");
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export default apiClient;
