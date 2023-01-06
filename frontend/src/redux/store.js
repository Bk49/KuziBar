import { configureStore } from "@reduxjs/toolkit";
import lotteryReducer from "./slice/lotterySlice";
import itemReducer from "./slice/itemSlice";
import authReducer from "./slice/authSlice";

export default configureStore({
    reducer: {
        lottery: lotteryReducer,
        item: itemReducer,
        auth: authReducer,
    },
});
