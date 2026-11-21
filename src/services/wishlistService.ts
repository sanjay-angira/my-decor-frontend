import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { deleteData, getData, postData } from "./api/apiService";
import type { ApiSuccessResponse } from "./api/errors";

export type WishlistEntry = {
  id: number;
  variationId: number;
  productId: number | null;
  productName: string;
  productSlug: string | null;
  variantName: string | null;
  image: string | null;
  finalPrice: number;
  stock: number;
  inStock: boolean;
};

export function fetchWishlist() {
  return getData<ApiSuccessResponse<WishlistEntry[]>>(
    API_ENDPOINTS.CUSTOMER.WISHLIST,
  );
}

export function fetchWishlistIds() {
  return getData<ApiSuccessResponse<number[]>>(
    API_ENDPOINTS.CUSTOMER.WISHLIST_IDS,
  );
}

export function fetchWishlistCount() {
  return getData<ApiSuccessResponse<{ count: number }>>(
    API_ENDPOINTS.CUSTOMER.WISHLIST_COUNT,
  );
}

export function addWishlistItem(variationId: number, userId: number) {
  return postData<ApiSuccessResponse<WishlistEntry>>(
    API_ENDPOINTS.CUSTOMER.WISHLIST,
    { userId, variationId },
  );
}

export function toggleWishlistItem(variationId: number, userId: number) {
  return postData<
    ApiSuccessResponse<{ wished: boolean; variationId: number; id: number | null }>
  >(API_ENDPOINTS.CUSTOMER.WISHLIST_TOGGLE, { userId, variationId });
}

export function removeWishlistItem(id: number) {
  return deleteData<
    ApiSuccessResponse<{ id: number; variationId: number }>
  >(API_ENDPOINTS.CUSTOMER.WISHLIST_BY_ID(id));
}

export function removeWishlistVariation(variationId: number) {
  return deleteData<
    ApiSuccessResponse<{ id: number; variationId: number }>
  >(API_ENDPOINTS.CUSTOMER.WISHLIST_BY_VARIATION(variationId));
}
