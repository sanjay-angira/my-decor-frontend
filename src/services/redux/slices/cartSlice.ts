import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartData } from "@/services/cartService";

type CartState = {
  items: CartData["items"];
  count: number;
  total: number;
};

const initialState: CartState = {
  items: [],
  count: 0,
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartContents(state, action: PayloadAction<CartData>) {
      state.items = action.payload.items;
      state.count = action.payload.items.reduce(
        (count, item) => count + item.quantity,
        0,
      );
      state.total = action.payload.total;
    },
    setCartCount(state, action: PayloadAction<number>) {
      state.count = action.payload;
    },
  },
});

export const { setCartContents, setCartCount } = cartSlice.actions;
export default cartSlice.reducer;
