import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import lotteryReducer from "./slice/lotterySlice";
import itemReducer from "./slice/itemSlice";
import authReducer from "./slice/authSlice";

export default configureStore({
    reducer: {
        user: userReducer,
        lottery: lotteryReducer,
        item: itemReducer,
        auth: authReducer,
    },
});
