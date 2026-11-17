import type { ProductCardData } from "@/data/products";
import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { getData, postData } from "./api/apiService";
import { getSessionId } from "./api/storage";
import type { ApiSuccessResponse } from "./api/errors";

type RecentlyViewedProductResponse = {
  productId: number;
  slug: string | null;
  name: string;
  image: string | null;
  price: number | null;
  originalPrice: number | null;
  rating: number;
  reviewCount: number;
};

type RecentlyViewedListResponse = {
  products: RecentlyViewedProductResponse[];
};

export async function fetchRecentlyViewedProducts(
  limit = 6,
): Promise<ProductCardData[]> {
  const sessionId = getSessionId();
  if (!sessionId) return [];

  const response = await getData<
    ApiSuccessResponse<RecentlyViewedListResponse>
  >(API_ENDPOINTS.CUSTOMER.RECENTLY_VIEWED, { sessionId, limit });

  if (!response.success || !Array.isArray(response.data?.products)) {
    throw new Error("Recently viewed products response was invalid.");
  }

  return response.data.products.flatMap((product) => {
    const slug = product.slug?.trim();
    const name = product.name?.trim();
    if (!slug || !name) return [];

    const price = Number(product.price ?? 0);
    const mrp = Number(product.originalPrice ?? price);
    const image = product.image?.trim() || "";

    return [{
      id: product.productId,
      slug,
      name,
      price: Number.isFinite(price) ? price : 0,
      mrp: Number.isFinite(mrp) ? Math.max(mrp, price) : Number.isFinite(price) ? price : 0,
      rating: Number(product.rating) || 0,
      reviewCount: Number(product.reviewCount) || 0,
      gallery: [{ src: image, alt: name }],
    }];
  });
}

export async function recordRecentlyViewedProduct(productId: number): Promise<void> {
  const sessionId = getSessionId();
  if (!sessionId) return;

  const response = await postData<ApiSuccessResponse<{ addedOrUpdated: number }>>(
    API_ENDPOINTS.CUSTOMER.RECENTLY_VIEWED,
    { sessionId, productIds: [productId] },
  );

  if (!response.success) {
    throw new Error("Failed to record recently viewed product.");
  }
}
