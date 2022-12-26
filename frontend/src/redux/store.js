import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import lotteryReducer from "./slice/lotterySlice";

export default configureStore({
    reducer: {
        user: userReducer,
        lottery: lotteryReducer,
    },
});
