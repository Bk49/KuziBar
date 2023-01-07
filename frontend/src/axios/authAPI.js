import instance, { authInstance } from "./config";

const login = async ({ email, password }) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    try {
        const res = await instance.post(`/token/`, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                accept: "application/json",
            },
        });

        return res;
    } catch (e) {
        throw e;
    }
};

const getUserId = async () => {
    try {
        return await authInstance.get(
            `/users/me`,
            {},
            {
                headers: {
                    accept: "application/json",
                },
            }
        );
    } catch (e) {
        throw e;
    }
};

const register = async (data) => {
    try {
        return await instance.post(`/signup`, data, {
            headers: {
                "Content-Type": "application/json",
                accept: "application/json",
            },
        });
    } catch (e) {
        throw e;
    }
};

export { login, getUserId, register };
