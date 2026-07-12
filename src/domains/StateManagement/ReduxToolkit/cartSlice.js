import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addItems: (state, action) => {
      state.cart.push(action.payload);
    },
    removeItems: (state, action) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { addItems, removeItems } = cartSlice.actions;
export default cartSlice.reducer;
