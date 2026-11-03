import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { deleteData, getData, postData, putData } from "./api/apiService";
import { getSessionId } from "./api/storage";

export type CartItem = {
  id: number;
  variationId: number;
  quantity: number;
  priceAtTime: number;
  productName?: string;
  image?: string | null;
};

export type CartData = {
  items: CartItem[];
  total: number;
};

function sessionParams() {
  const sessionId = getSessionId();
  return sessionId ? { sessionId } : {};
}

export function fetchCart() {
  return getData<CartData>(
    API_ENDPOINTS.CUSTOMER.CART_ITEMS,
    sessionParams(),
  );
}

export function addCartItem(variationId: number, quantity: number) {
  return postData(API_ENDPOINTS.CUSTOMER.ADD_CART_ITEM, {
    variationId,
    quantity,
    ...sessionParams(),
  });
}

export function updateCartItem(cartItemId: number, quantity: number) {
  return putData(API_ENDPOINTS.CUSTOMER.UPDATE_CART_ITEM, {
    cartItemId,
    quantity,
    ...sessionParams(),
  });
}

export function removeCartItem(id: number) {
  const sessionId = getSessionId();
  const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : "";
  return deleteData(
    `${API_ENDPOINTS.CUSTOMER.REMOVE_CART_ITEM(id)}${query}`,
  );
}

export function clearRemoteCart() {
  const sessionId = getSessionId();
  const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : "";
  return deleteData(`${API_ENDPOINTS.CUSTOMER.CLEAR_CART}${query}`);
}
