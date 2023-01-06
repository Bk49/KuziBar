import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost",
});

const authInstance = axios.create({
    baseURL: "http://localhost",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default instance;
export { authInstance };
