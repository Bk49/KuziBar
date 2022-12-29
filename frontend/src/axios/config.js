import axios from "axios";
import {
    selectCurrentToken,
    selectRefreshToken,
    setAccessToken,
} from "../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slice/authSlice";

const instance = axios.create({
    baseURL: "http://localhost",
});

instance.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {
        return res;
    },
    function (error) {
        const originalRequest = error.config;
        console.log(error.config);
        if (
            error.response.status === 401 &&
            originalRequest.url === "http://localhost/token"
        ) {
            //push to login page
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = selectRefreshToken;
            return axios
                .post("/token", {
                    refresh_token: refreshToken,
                })
                .then((res) => {
                    if (res.status === 201) {
                        useDispatch(setAccessToken(res.data));
                        axios.defaults.headers.common["Authorization"] =
                            "Bearer " + selectCurrentToken;
                        return axios(originalRequest);
                    }
                });
        }
        return Promise.reject(error);
    }
);
export default instance;
