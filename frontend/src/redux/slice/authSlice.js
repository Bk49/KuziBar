//this slice shd be used to store auth's data
//such as accessToken and refreshToken

import { createSlice, current } from "@reduxjs/toolkit";
// import jwt_decode from "jwt-decode"

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        email: "",
        access_token: "",
        refresh_token: "",
    },
    reducers: {
        setCredentials: (currentState, { payload }) => {
            const { email, access_token, refresh_token } = payload;
            currentState.email = email;
            currentState.access_token = access_token;
            currentState.refresh_token = refresh_token;
            //currentState[payload.key] = payload.value;
        },

        decodeToken: (currentState, { payload }) => {
            // This reducer func is supposed to decrypt the token and set it into the state
            // Later on, we will use axios.interceptor to append the header before the request
            //  is being sent to the back end for APIs that are not opened to public
        },

        logOut: (currentState) => ({
            email: "",
            access_token: "",
            refresh_token: "",
        }),
    },
});

export const { setCredentials, decodeToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.email;
export const selectCurrentToken = (state) => state.auth.access_token;
export const selectRefreshToken = (state) => state.auth.refresh_token;
