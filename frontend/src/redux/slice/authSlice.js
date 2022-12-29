//this slice shd be used to store auth's data
//such as accessToken and refreshToken

import { createSlice, current } from "@reduxjs/toolkit";
// import jwt_decode from "jwt-decode"

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        email: "",
        access_token: null,
        refresh_token: null,
    },
    reducers: {
        setCredentials: (currentState, { payload }) => {
            const { email, access_token, refresh_token } = payload;
            currentState.email = email;
            currentState.access_token = access_token;
            currentState.refresh_token = refresh_token;
            //currentState[payload.key] = payload.value;
        },

        setAccessToken: (currentState, { token }) => {
            currentState.access_token = token;
        },

        logOut: (currentState) => ({
            email: "",
            access_token: null,
            refresh_token: null,
        }),
    },
});

export const { setCredentials, decodeToken, logOut, setAccessToken } =
    authSlice.actions;

export const selectCurrentUser = (state) => state.auth.email;
export const selectCurrentToken = (state) => state.auth.access_token;
export const selectRefreshToken = (state) => state.auth.refresh_token;

export default authSlice.reducer;
