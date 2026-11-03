import type { RootState } from "./index";

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartCount = (state: RootState) => state.cart.count;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectWishlistProductIds = (state: RootState) =>
  state.wishlist.productIds;
export const selectIsAuthenticated = (state: RootState) =>
  state.userAuth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.userAuth.user;
