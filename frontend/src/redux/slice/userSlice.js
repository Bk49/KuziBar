import { createSlice } from "@reduxjs/toolkit";
import jwt from "jsonwebtoken"

export const userSlice = createSlice({
    name: "user",
    initialState: {
        email: "",
        name: "",
        token: "",
    },
    reducers: {
        setVal: (currentState, { payload }) =>
            (currentState.payload.key = payload.value),

        decodeToken: (currentState, { payload }) => {
            // This reducer func is supposed to decrypt the token and set it into the state
            // Later on, we will use axios.interceptor to append the header before the request
            //  is being sent to the back end for APIs that are not opened to public
        },
    },
});

export const { setVal, decodeToken } = userSlice.actions;

export default userSlice.reducer;
