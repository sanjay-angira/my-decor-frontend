import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalState = {
  authOpen: boolean;
  cartOpen: boolean;
};

const initialState: ModalState = {
  authOpen: false,
  cartOpen: false,
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
    closeModals(state) {
      state.authOpen = false;
      state.cartOpen = false;
    },
  },
});

export const { setAuthOpen, setCartOpen, closeModals } = modalSlice.actions;
export default modalSlice.reducer;
