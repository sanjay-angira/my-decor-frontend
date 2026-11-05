import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { getData, type QueryParams, type RequestOptions } from "./api/apiService";

export function fetchCategories(options?: RequestOptions) {
  return getData(API_ENDPOINTS.CUSTOMER.CATEGORIES, undefined, options);
}

export function fetchProducts(
  params: QueryParams = {},
  options?: RequestOptions,
) {
  return getData(API_ENDPOINTS.CUSTOMER.PRODUCTS, params, options);
}

export function fetchProductBySlug(
  slug: string,
  options?: RequestOptions,
) {
  return getData(
    API_ENDPOINTS.CUSTOMER.PRODUCT_BY_SLUG(slug),
    undefined,
    options,
  );
}

export function searchProducts(
  params: QueryParams,
  options?: RequestOptions,
) {
  return getData(API_ENDPOINTS.CUSTOMER.SEARCH, params, options);
}
