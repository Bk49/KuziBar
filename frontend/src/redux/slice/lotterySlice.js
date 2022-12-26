import { createSlice } from "@reduxjs/toolkit";

/*
    Lottery Item
        item_name <String>
        tier <Number>
        image <File>
        skins <Array(Skins)>
    
    Skins
        skin_name
        image
*/

export const lotterySlice = createSlice({
    name: "lottery",
    initialState: {
        image: "",
        lottery_name: "",
        price: 10.0,
        status: "draft",
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
            currentState.lottery_items[payload.index] = payload.item;
        },

        deleteLotteryItem: (currentState, { payload }) => {
            currentState.lottery_items.splice(payload.index, 1);
        },

        resetLottery: (currentState) => {
            currentState = {
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
    resetLotteryItemsId,
} = lotterySlice.actions;

export default lotterySlice.reducer;
