import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost",
});

const authInstance = axios.create({
    baseURL: "http://localhost",
    headers: {
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

authInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        config.headers = {
            Authorization: `Bearer ${token}`,
        };
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
export { authInstance };
