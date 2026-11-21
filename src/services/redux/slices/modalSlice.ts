import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalState = {
  authOpen: boolean;
  cartOpen: boolean;
  wishlistOpen: boolean;
};

const initialState: ModalState = {
  authOpen: false,
  cartOpen: false,
  wishlistOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setAuthOpen(state, action: PayloadAction<boolean>) {
      state.authOpen = action.payload;
    },
    setCartOpen(state, action: PayloadAction<boolean>) {
      state.cartOpen = action.payload;
    },
    setWishlistOpen(state, action: PayloadAction<boolean>) {
      state.wishlistOpen = action.payload;
    },
    closeModals(state) {
      state.authOpen = false;
      state.cartOpen = false;
      state.wishlistOpen = false;
    },
  },
});

export const {
  setAuthOpen,
  setCartOpen,
  setWishlistOpen,
  closeModals,
} = modalSlice.actions;
export default modalSlice.reducer;
