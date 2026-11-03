import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import modalReducer from "./slices/modalSlice";
import userAuthReducer from "./slices/userAuthSlice";
import wishlistReducer from "./slices/wishlistSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
      modal: modalReducer,
      userAuth: userAuthReducer,
      wishlist: wishlistReducer,
    },
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
