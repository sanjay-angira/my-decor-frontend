import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { getData, postData, type QueryParams } from "./api/apiService";
import type { ApiSuccessResponse } from "./api/errors";

export type CustomerOrder = {
  id: number;
  orderNumber: string;
  orderStatus: string;
  paymentMethod: string | null;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: {
    id: number;
    productName: string;
    variantName: string | null;
    quantity: number;
    unitPrice: number;
    image: string | null;
  }[];
};

export function estimateShipping(params: QueryParams) {
  return getData(API_ENDPOINTS.CUSTOMER.SHIPPING_ESTIMATE, params);
}

export function placeOrder(payload: Record<string, unknown>) {
  return postData(API_ENDPOINTS.CUSTOMER.CHECKOUT, payload);
}

export function applyCoupon(payload: Record<string, unknown>) {
  return postData(API_ENDPOINTS.CUSTOMER.APPLY_COUPON, payload);
}

export function verifyRazorpayPayment(payload: Record<string, unknown>) {
  return postData(API_ENDPOINTS.CUSTOMER.RAZORPAY_VERIFY, payload);
}

export function fetchOrder(orderNumber: string, params?: QueryParams) {
  return getData(
    API_ENDPOINTS.CUSTOMER.ORDER_BY_NUMBER(orderNumber),
    params,
  );
}

export function fetchOrders() {
  return getData<ApiSuccessResponse<CustomerOrder[]>>(
    API_ENDPOINTS.CUSTOMER.ORDERS,
  );
}
