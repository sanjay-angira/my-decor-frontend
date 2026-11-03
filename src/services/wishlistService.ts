import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { deleteData, getData, postData } from "./api/apiService";

export type WishlistEntry = {
  id: number;
  variationId: number;
  productName?: string;
};

export function fetchWishlist() {
  return getData<WishlistEntry[]>(API_ENDPOINTS.CUSTOMER.WISHLIST);
}

export function fetchWishlistIds() {
  return getData<number[]>(API_ENDPOINTS.CUSTOMER.WISHLIST_IDS);
}

export function toggleWishlistItem(variationId: number) {
  return postData(API_ENDPOINTS.CUSTOMER.WISHLIST_TOGGLE, { variationId });
}

export function removeWishlistItem(id: number) {
  return deleteData(API_ENDPOINTS.CUSTOMER.WISHLIST_BY_ID(id));
}

export function removeWishlistVariation(variationId: number) {
  return deleteData(API_ENDPOINTS.CUSTOMER.WISHLIST_BY_VARIATION(variationId));
}
