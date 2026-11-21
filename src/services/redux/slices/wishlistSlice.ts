import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type WishlistState = {
  productIds: number[];
};

const initialState: WishlistState = { productIds: [] };

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addWishlistProduct(state, action: PayloadAction<number>) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload);
      }
    },
    removeWishlistProduct(state, action: PayloadAction<number>) {
      state.productIds = state.productIds.filter((id) => id !== action.payload);
    },
    toggleWishlistProduct(state, action: PayloadAction<number>) {
      state.productIds = state.productIds.includes(action.payload)
        ? state.productIds.filter((id) => id !== action.payload)
        : [...state.productIds, action.payload];
    },
    setWishlistProducts(state, action: PayloadAction<number[]>) {
      state.productIds = [...new Set(action.payload)];
    },
    clearWishlist(state) {
      state.productIds = [];
    },
  },
});

export const {
  addWishlistProduct,
  removeWishlistProduct,
  toggleWishlistProduct,
  setWishlistProducts,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
