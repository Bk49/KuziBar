import { createSlice } from "@reduxjs/toolkit";

/*
    Lottery Item
        item_name <String>
        tier <Number>
        image <File>
        skins <Array(Skins)>
    
    Skins
        skin_name
        skin_image
*/

export const lotterySlice = createSlice({
    name: "lottery",
    initialState: {
        id:"",
        image: "",
        lottery_name: "",
        price: 10.0,
        status: 0,
        lottery_items: [],
    },
    reducers: {
        setLotteryVal: (currentState, { payload }) => {
            currentState[payload.key] = payload.value;
        },

        // This part is for lottery_items in the lottery slice
        addLotteryItem: (currentState, { payload }) => {
            currentState.lottery_items.push({
                ...payload,
                id: currentState.lottery_items.length,
            });
        },

        editLotteryItem: (currentState, { payload }) => {
            let item = { ...payload };
            delete item.index;
            currentState.lottery_items[payload.index] = item;
        },

        deleteLotteryItem: (currentState, { payload }) => {
            currentState.lottery_items.splice(payload.index, 1);
        },

        resetLotteryItems: (currentState) => {
            currentState.lottery_items = []
        },

        resetLottery: (currentState) => {
            currentState = {
                id:"",
                image: "",
                lottery_name: "",
                price: 10.0,
                status: "draft",
                lottery_items: [],
            };
        },
    },
});

export const {
    setLotteryVal,
    addLotteryItem,
    editLotteryItem,
    deleteLotteryItem,
    resetLotteryItems,
    resetLottery,
} = lotterySlice.actions;

export default lotterySlice.reducer;
