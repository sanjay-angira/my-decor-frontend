import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  lineId: string;
  productId: number;
  slug: string;
  name: string;
  sizeLabel: string;
  quantity: number;
  unitPrice: number;
  image: string;
};

type CartState = {
  items: CartItem[];
  count: number;
  total: number;
};

const initialState: CartState = {
  items: [],
  count: 0,
  total: 0,
};

function updateTotals(state: CartState) {
  state.count = state.items.reduce((count, item) => count + item.quantity, 0);
  state.total = state.items.reduce(
    (total, item) => total + item.quantity * item.unitPrice,
    0,
  );
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCartItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (item) => item.lineId === action.payload.lineId,
      );
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      updateTotals(state);
    },
    setCartItemQuantity(
      state,
      action: PayloadAction<{ lineId: string; quantity: number }>,
    ) {
      const item = state.items.find(
        (row) => row.lineId === action.payload.lineId,
      );
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(
            (row) => row.lineId !== action.payload.lineId,
          );
        } else {
          item.quantity = action.payload.quantity;
        }
        updateTotals(state);
      }
    },
    removeCartItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter(
        (item) => item.lineId !== action.payload,
      );
      updateTotals(state);
    },
    clearCart(state) {
      state.items = [];
      state.count = 0;
      state.total = 0;
    },
  },
});

export const {
  addCartItem,
  setCartItemQuantity,
  removeCartItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
