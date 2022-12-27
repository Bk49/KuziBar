import { createSlice } from "@reduxjs/toolkit";

export const itemSlice = createSlice({
    name: "item",
    initialState: {
        item_name: "",
        tier: "1",
        image: "",
        skins: [],
    },
    reducers: {
        setItemVal: (currentState, { payload }) => {
            currentState[payload.key] = payload.value;
        },

        setItem: (currentState, { payload }) => payload,

        addSkin: (currentState) => {
            currentState.skins.push({
                skin_name: "",
                skin_image: "",
            });
        },

        removeSkin: (currentState, { payload }) => {
            currentState.skins.splice(payload.index, 1);
        },

        setSkinVal: (currentState, { payload }) => {
            currentState.skins[payload.index][payload.key] = payload.value;
        },

        reset: (currentState) => ({
            item_name: "",
            tier: "1",
            image: "",
            skins: [],
        }),
    },
});

export const { setItemVal, setItem, addSkin, removeSkin, setSkinVal, reset } =
    itemSlice.actions;

export default itemSlice.reducer;
