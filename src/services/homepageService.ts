import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import type { ApiSuccessResponse } from "./api/errors";
import type { ProductCardData } from "@/data/products";

export type HomepageBanner = {
  id: number;
  source: "offer" | "category";
  title: string;
  slug: string;
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
};

type StoreProductCardResponse = {
  id: number;
  productId: number;
  productSlug: string | null;
  productName: string;
  image: string | null;
  images?: {
    originalUrl?: string | null;
    webp400?: string | null;
    webp800?: string | null;
  }[];
  originalPrice: number | null;
  finalPrice: number | null;
  rating: number;
  reviewCount: number;
};

type StoreProductsResponse = {
  rows: StoreProductCardResponse[];
  count: number;
  pageNumber: number;
  pageSize: number;
};

export type StoreProductsQuery = {
  pageNumber: number;
  pageSize: number;
  search?: string;
  offerIds?: number[];
  sortBy?: "newest" | "price_asc" | "price_desc" | "name_asc" | "discount_desc";
  bestSellers?: boolean;
  newArrivals?: boolean;
  featured?: boolean;
  bestDeals?: boolean;
  categoryIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
};

export type StoreProductsPage = {
  products: ProductCardData[];
  count: number;
  pageNumber: number;
  pageSize: number;
};

export type StoreFilters = {
  selectedCategory: StoreCategory | null;
  categories: {
    id: number;
    name: string;
    slug?: string | null;
    parentId: number | null;
  }[];
  offers?: {
    id: number;
    name: string;
    slug?: string | null;
  }[];
};

type StoreCategoryOffer = {
  id: number;
  name: string;
  slug?: string | null;
  desktopImage: string | null;
  tabletImage: string | null;
  mobileImage: string | null;
};

export type StoreCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  desktopBanner: string | null;
  categoryOffers?: StoreCategoryOffer[];
};

export type StoreCategoryDirectoryItem = {
  id: number;
  name: string;
  slug: string | null;
  image: string | null;
  productCount: number;
  parentId: number | null;
  description: string;
  desktopBanner: string | null;
  categoryOffers: StoreCategoryOffer[];
};

type StoreCategoriesResponse = {
  rows?: Array<{
    id: number;
    name: string;
    slug?: string | null;
    description?: string | null;
    desktopBanner?: string | null;
    image?: string | null;
    productCount?: number;
    parentId?: number | null;
    categoryOffers?: Array<{
      id: number;
      name: string;
      slug?: string | null;
      desktopImage?: string | null;
      tabletImage?: string | null;
      mobileImage?: string | null;
    }>;
  }>;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080/backend/api";

function cleanCategoryDescription(value?: string | null): string {
  const description = (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return description.toLowerCase().startsWith("no descr") ? "" : description;
}

function mapStoreProduct(product: StoreProductCardResponse): ProductCardData | null {
  const slug = product.productSlug?.trim();
  const name = product.productName?.trim();
  if (!slug || !name) return null;

  const price = Number(product.finalPrice ?? product.originalPrice ?? 0);
  const mrp = Number(product.originalPrice ?? price);
  const image =
    product.image?.trim() ||
    product.images?.find((item) => item.webp400 || item.originalUrl || item.webp800)
      ?.webp400 ||
    product.images?.find((item) => item.originalUrl || item.webp800)?.originalUrl ||
    product.images?.find((item) => item.webp800)?.webp800 ||
    "";

  return {
    id: product.productId || product.id,
    slug,
    name,
    price: Number.isFinite(price) ? price : 0,
    mrp: Number.isFinite(mrp) ? mrp : Number.isFinite(price) ? price : 0,
    rating: Number(product.rating) || 0,
    reviewCount: Number(product.reviewCount) || 0,
    gallery: [{ src: image, alt: name }],
  };
}

export async function fetchStoreProducts(
  params: StoreProductsQuery,
): Promise<StoreProductsPage> {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
    sortBy: params.sortBy || "newest",
  });
  if (params.search?.trim()) query.set("search", params.search.trim());
  if (params.offerIds?.length) query.set("offerIds", params.offerIds.join(","));
  if (params.bestSellers) query.set("bestSellers", "true");
  if (params.newArrivals) query.set("newArrivals", "true");
  if (params.featured) query.set("featured", "true");
  if (params.bestDeals) query.set("bestDeals", "true");
  if (params.categoryIds?.length) query.set("categoryIds", params.categoryIds.join(","));
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.minRating !== undefined) query.set("minRating", String(params.minRating));

  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER.PRODUCTS}?${query}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Products request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ApiSuccessResponse<StoreProductsResponse>;
  if (!payload.success || !Array.isArray(payload.data?.rows)) {
    throw new Error("Products response was invalid.");
  }

  return {
    products: payload.data.rows
      .map(mapStoreProduct)
      .filter((product): product is ProductCardData => product !== null),
    count: Number(payload.data.count) || 0,
    pageNumber: Number(payload.data.pageNumber) || params.pageNumber,
    pageSize: Number(payload.data.pageSize) || params.pageSize,
  };
}

export async function fetchStoreFilterOptions(
  categorySlug?: string,
): Promise<StoreFilters> {
  const [allCategories, offers] = await Promise.all([
    fetchStoreCategories(),
    fetchStoreOffers(categorySlug),
  ]);
  const selectedCategory = allCategories.find(
    (category) =>
      categorySlug &&
      category.slug?.trim().toLowerCase() === categorySlug.trim().toLowerCase(),
  );

  return {
    selectedCategory:
      selectedCategory?.slug
        ? {
            id: selectedCategory.id,
            name: selectedCategory.name,
            slug: selectedCategory.slug,
            description: selectedCategory.description,
            desktopBanner: selectedCategory.desktopBanner,
            categoryOffers: selectedCategory.categoryOffers,
          }
        : null,
    categories: allCategories.map(({ id, name, slug, parentId }) => ({
      id,
      name,
      slug,
      parentId,
    })),
    offers,
  };
}

async function fetchStoreOffers(
  categorySlug?: string,
): Promise<NonNullable<StoreFilters["offers"]>> {
  const query = new URLSearchParams();
  if (categorySlug) query.set("categorySlug", categorySlug);
  const queryString = query.toString();
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER.OFFERS}${
      queryString ? `?${queryString}` : ""
    }`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Store offers request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ApiSuccessResponse<
    { id: number; name: string; slug: string | null }[]
  >;
  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error("Store offers response was invalid.");
  }

  return payload.data.flatMap((offer) => {
    const id = Number(offer.id);
    const name = offer.name?.trim();
    const slug = offer.slug?.trim();
    if (!Number.isInteger(id) || id <= 0 || !name || !slug) return [];
    return [{ id, name, slug }];
  });
}

export async function fetchStoreCategoryBySlug(
  slug: string,
): Promise<StoreCategory | null> {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER.CATEGORIES}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`Store categories request failed with status ${response.status}.`);
  }

  const payload = (await response.json()) as ApiSuccessResponse<StoreCategoriesResponse>;
  if (!payload.success || !Array.isArray(payload.data?.rows)) {
    throw new Error("Store categories response was invalid.");
  }

  const category = payload.data.rows.find(
    (item) => item.slug?.trim().toLowerCase() === slug.trim().toLowerCase(),
  );
  if (!category || !category.slug) return null;

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: cleanCategoryDescription(category.description),
    desktopBanner: category.desktopBanner || null,
    categoryOffers: Array.isArray(category.categoryOffers)
      ? category.categoryOffers.map((offer) => ({
          ...offer,
          desktopImage: offer.desktopImage ?? null,
          tabletImage: offer.tabletImage ?? null,
          mobileImage: offer.mobileImage ?? null,
        }))
      : [],
  };
}

export async function fetchStoreCategories(): Promise<
  StoreCategoryDirectoryItem[]
> {
  const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER.CATEGORIES}`,{ cache: "no-store" },);
  if (!response.ok) {
    throw new Error(
      `Store categories request failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as ApiSuccessResponse<StoreCategoriesResponse>;
  if (!payload.success || !Array.isArray(payload.data?.rows)) {
    throw new Error("Store categories response was invalid.");
  }

  return payload.data.rows.map((category) => {
    const categoryId = Number(category.id);
    if (
      !Number.isInteger(categoryId) ||
      categoryId <= 0 ||
      !category.name?.trim()
    ) {
      throw new Error("Store categories response contained an invalid category.");
    }

    const productCount = Number(category.productCount);

    return {
      id: categoryId,
      name: category.name.trim(),
      slug: category.slug?.trim() || null,
      image: category.image || category.desktopBanner || null,
      productCount: Number.isFinite(productCount)
        ? Math.max(0, productCount)
        : 0,
      parentId:
        category.parentId !== undefined && category.parentId !== null
          ? Number(category.parentId)
          : null,
      description: cleanCategoryDescription(category.description),
      desktopBanner: category.desktopBanner || null,
      categoryOffers: Array.isArray(category.categoryOffers)
        ? category.categoryOffers.map((offer) => ({
            ...offer,
            desktopImage: offer.desktopImage ?? null,
            tabletImage: offer.tabletImage ?? null,
            mobileImage: offer.mobileImage ?? null,
          }))
        : [],
    };
  });
}

export async function fetchHomepageBanners(): Promise<HomepageBanner[]> {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER.BANNERS}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(
      `Homepage banners request failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as ApiSuccessResponse<
    HomepageBanner[]
  >;
  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error("Homepage banners response was invalid.");
  }

  return payload.data;
}

export async function fetchHomepageProducts(
  section: "bestSellers" | "newArrivals",
  pageSize = 6,
): Promise<ProductCardData[]> {
  const result = await fetchStoreProducts({
    pageNumber: 1,
    pageSize,
    sortBy: "newest",
    [section]: true,
  });
  return result.products;
}
