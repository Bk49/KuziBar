import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: {
        email: "",
        name: "",
    },
    reducers: {
        setVal: (currentState, { payload }) => currentState.payload.key = payload.value,
    },
});

export const { setVal } = userSlice.actions

export default userSlice.reducer