export const API_ENDPOINTS = {
  CUSTOMER_AUTH: {
    SEND_WHATSAPP_OTP: "customer/auth/send-whatsapp-otp",
    VERIFY_WHATSAPP_OTP: "customer/auth/verify-whatsapp-otp",
    COMPLETE_PROFILE: "customer/auth/complete-profile",
    VERIFY_EMAIL_OTP: "customer/auth/verify-email-otp",
    RESEND_EMAIL_OTP: "customer/auth/resend-email-otp",
    REFRESH_TOKEN: "customer/auth/refresh-token",
  },
  CUSTOMER: {
    BANNERS: "customer/banners",
    CATEGORIES: "customer/categories",
    PRODUCTS: "customer/all-products",
    PRODUCT_BY_SLUG: (slug: string) =>
      `customer/product/${encodeURIComponent(slug)}`,
    SEARCH: "customer/search",
    ADD_CART_ITEM: "customer/add-cart-item",
    CART_ITEMS: "customer/get-cart-items",
    UPDATE_CART_ITEM: "customer/update-cart-item",
    REMOVE_CART_ITEM: (id: number | string) =>
      `customer/remove-cart-item/${encodeURIComponent(String(id))}`,
    CLEAR_CART: "customer/clear-cart",
    CART_COUNT: "customer/cart-count",
    ADDRESSES: "customer/addresses",
    ADDRESS_BY_ID: (id: number | string) =>
      `customer/addresses/${encodeURIComponent(String(id))}`,
    ADDRESS_DEFAULT: (id: number | string) =>
      `customer/addresses/${encodeURIComponent(String(id))}/default`,
    WISHLIST: "customer/wishlist",
    WISHLIST_IDS: "customer/wishlist/ids",
    WISHLIST_TOGGLE: "customer/wishlist/toggle",
    WISHLIST_BY_ID: (id: number | string) =>
      `customer/wishlist/${encodeURIComponent(String(id))}`,
    WISHLIST_BY_VARIATION: (id: number | string) =>
      `customer/wishlist/by-variation/${encodeURIComponent(String(id))}`,
    CHECKOUT: "customer/checkout",
    APPLY_COUPON: "customer/apply-coupon",
    SHIPPING_ESTIMATE: "customer/shipping-estimate",
    RAZORPAY_VERIFY: "customer/payments/razorpay/verify",
    ORDERS: "customer/orders",
    ORDER_BY_NUMBER: (number: string) =>
      `customer/order/${encodeURIComponent(number)}`,
    RECENTLY_VIEWED: "customer/recently-viewed",
  },
  PUBLIC: {
    COUPONS: "coupons/public",
    CMS_PAGES: "cms-pages/public",
    CMS_PAGE_BY_SLUG: (slug: string) =>
      `cms-pages/slug/${encodeURIComponent(slug)}`,
    SHIPPING_SERVICEABILITY: "shipping/serviceability",
    SHIPPING_LOCATION: "shipping/location",
    SHIPPING_ESTIMATE: "shipping/estimate",
  },
  UPLOAD: "upload",
} as const;
