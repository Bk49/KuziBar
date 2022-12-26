import { createSlice } from "@reduxjs/toolkit";

/*
    Lottery Item
        id
        item_name <String>
        tier <Number>
        image <File>
        skins <Array(Skins)>
    
    Skins
        id
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
        addLotteryItem: (currentState, { payload }) =>
            currentState.lottery_items.push({
                ...payload,
                id: currentState.lottery_items.length,
            }),

        editLotteryItem: (currentState, { payload }) => {
            const index = currentState.lottery_items.indexOf(
                currentState.lottery_items.find(({ id }) => id === payload.id)
            );
            return (currentState.lottery_items[index][payload.key] =
                payload.value);
        },

        deleteLotteryItem: (currentState, { payload }) => {
            const index = currentState.lottery_items.indexOf(
                currentState.lottery_items.find(({ id }) => id === payload.id)
            );
            currentState.lottery_items.splice(index, 1);
            lotterySlice.caseReducers.resetLotteryItemId(currentState);
        },

        resetLotteryItemsId: (currentState) =>
            (currentState.lottery_items = currentState.lottery_items.map(
                (items, index) => ({ ...items, id: index })
            )),

        // This part is for lottery_item.skin in the lottery slice
        addLotteryItemSkin: (currentState, { payload }) => {
            const index = currentState.lottery_items.indexOf(
                currentState.lottery_items.find(
                    ({ id }) => id === payload.itemId
                )
            );
            currentState.lottery_items[index].skins.push({
                ...payload,
                id: currentState.lottery_items[index].skins.length,
            });
        },

        editLotteryItemSkin: (currentState, { payload }) => {
            const index = currentState.lottery_items.indexOf(
                currentState.lottery_items.find(
                    ({ id }) => id === payload.itemId
                )
            );
            const skinIndex = currentState.lottery_items[index].skins.indexOf(
                currentState.lottery_items[index].skins.find(
                    ({ id }) => id === payload.skinId
                )
            );
            return (currentState.lottery_items[index].skins[skinIndex][
                payload.key
            ] = payload.value);
        },

        deleteLotteryItemSkin: (currentState, { payload }) => {
            const index = currentState.lottery_items.indexOf(
                currentState.lottery_items.find(
                    ({ id }) => id === payload.itemId
                )
            );
            const skinIndex = currentState.lottery_items[index].skins.indexOf(
                currentState.lottery_items[index].skins.find(
                    ({ id }) => id === payload.skinId
                )
            );
            currentState.lottery_items[index].skins[skinIndex].splice(index, 1);
            lotterySlice.caseReducers.resetLotterySkinId(currentState, {
                itemId: skinIndex,
            });
        },

        resetLotteryItemSkinId: (currentState, { payload }) => {
            const index = currentState.lottery_items.indexOf(
                currentState.lottery_items.find(
                    ({ id }) => id === payload.itemId
                )
            );
            return (currentState.lottery_items[index].skins =
                currentState.lottery_items[index].skins.map((skins, index) => ({
                    ...skins,
                    id: index,
                })));
        },
    },
});

export const {
    setLotteryVal,
    addLotteryItem,
    editLotteryItem,
    deleteLotteryItem,
    resetLotteryItemsId,
    addLotteryItemSkin,
    editLotteryItemSkin,
    deleteLotteryItemSkin,
    resetLotteryItemSkinId,
} = lotterySlice.actions;

export default lotterySlice.reducer;
