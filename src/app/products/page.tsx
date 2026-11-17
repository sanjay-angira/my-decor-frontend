import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import HeroBanner, { type HeroSlide } from "@/components/homepage/HeroBanner";
import {
  fetchStoreFilters,
  fetchStoreProducts,
  type StoreProductsQuery,
} from "@/services/homepageService";

export const metadata: Metadata = {
  title: "Shop All Products | India Decor",
  description:
    "Explore the complete India Decor collection of metal wall art and home décor.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const pageSize = 24;
const sortOptions: NonNullable<StoreProductsQuery["sortBy"]>[] = [
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
  "discount_desc",
];

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function allValues(value: string | string[] | undefined): string[] {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isChecked(value: string | undefined): boolean {
  return value === "true" || value === "1" || value === "on";
}

function productsPageHref(
  page: number,
  state: {
    search: string;
    sortBy: NonNullable<StoreProductsQuery["sortBy"]>;
    categoryIds: number[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    newArrivals: boolean;
    featured: boolean;
    bestDeals: boolean;
  },
): string {
  const params = new URLSearchParams({
    page: String(page),
    sortBy: state.sortBy,
  });
  if (state.search) params.set("search", state.search);
  if (state.categoryIds.length) {
    params.set("categoryIds", state.categoryIds.join(","));
  }
  if (state.minPrice !== undefined) params.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined) params.set("maxPrice", String(state.maxPrice));
  if (state.minRating !== undefined) params.set("minRating", String(state.minRating));
  if (state.newArrivals) params.set("newArrivals", "true");
  if (state.featured) params.set("featured", "true");
  if (state.bestDeals) params.set("bestDeals", "true");
  return `/products?${params}`;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const query = await searchParams;
  const filters = await fetchStoreFilters();
  const search = firstValue(query.search).trim();
  const requestedPage = Number.parseInt(firstValue(query.page), 10);
  const pageNumber = Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const requestedSort = firstValue(query.sortBy);
  const sortBy = sortOptions.find((option) => option === requestedSort) ?? "newest";
  const categoryIds = [
    ...new Set(
      allValues(query.categoryIds)
        .flatMap((value) => value.split(","))
        .map((value) => Number(value))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  ];
  const rangeMin = Number(filters.priceRange.min) || 0;
  const rangeMax = Math.max(rangeMin, Number(filters.priceRange.max) || rangeMin);
  const requestedMinPrice = parseOptionalNumber(firstValue(query.minPrice));
  const requestedMaxPrice = parseOptionalNumber(firstValue(query.maxPrice));
  const minPrice = requestedMinPrice === undefined
    ? undefined
    : Math.min(rangeMax, Math.max(rangeMin, requestedMinPrice));
  const maxPrice = requestedMaxPrice === undefined
    ? undefined
    : Math.min(rangeMax, Math.max(rangeMin, requestedMaxPrice));
  const minRating = parseOptionalNumber(firstValue(query.minRating));
  const newArrivals = isChecked(firstValue(query.newArrivals));
  const featured = isChecked(firstValue(query.featured));
  const bestDeals = isChecked(firstValue(query.bestDeals));
  const result = await fetchStoreProducts({
    pageNumber,
    pageSize,
    search,
    sortBy,
    categoryIds,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
  });
  const pageCount = Math.ceil(result.count / pageSize);
  const firstProduct = result.count === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const lastProduct = Math.min(pageNumber * pageSize, result.count);
  const paginationState = {
    search,
    sortBy,
    categoryIds,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
  };
  const heroSlides: HeroSlide[] = filters.banners.flatMap((banner, index) => {
    const desktopImage =
      banner.desktopImage ||
      banner.image ||
      banner.tabletImage ||
      banner.mobileImage ||
      "";
    if (!desktopImage) return [];
    const categoryId = /^category-(\d+)$/.exec(banner.id)?.[1];
    return [{
      id: index + 1,
      title: banner.title,
      href: categoryId
        ? `/products?categoryIds=${categoryId}`
        : "/products",
      desktopImage,
      tabletImage: banner.tabletImage || desktopImage,
      mobileImage: banner.mobileImage || banner.tabletImage || desktopImage,
    }];
  });

  return (
    <main className="store-page">
      <HeroBanner slides={heroSlides} />

      <div className="container-page store-content">
        <nav className="store-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">›</span>
          <span>All Products</span>
        </nav>

        <div className="store-layout">
          <aside className="store-sidebar" aria-label="Product filters">
            <form action="/products" method="get">
              <input type="hidden" name="search" value={search} />

              <fieldset className="store-filter-group">
                <legend>Price</legend>
                <div className="store-price-values">
                  <label>
                    <span>From</span>
                    <input
                      type="number"
                      name="minPrice"
                      min={rangeMin}
                      max={rangeMax}
                      placeholder={`₹${rangeMin.toLocaleString("en-IN")}`}
                      defaultValue={minPrice}
                    />
                  </label>
                  <label>
                    <span>To</span>
                    <input
                      type="number"
                      name="maxPrice"
                      min={rangeMin}
                      max={rangeMax}
                      placeholder={`₹${rangeMax.toLocaleString("en-IN")}`}
                      defaultValue={maxPrice}
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset className="store-filter-group">
                <legend>Sort By</legend>
                <select
                  className="store-sort-select"
                  name="sortBy"
                  defaultValue={sortBy}
                  aria-label="Sort products"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="discount_desc">Best Discount</option>
                </select>
              </fieldset>

              <fieldset className="store-filter-group">
                <legend>Product Type</legend>
                <label className="store-check-option">
                  <input type="checkbox" name="newArrivals" value="true" defaultChecked={newArrivals} />
                  <span>New Arrivals</span>
                </label>
                <label className="store-check-option">
                  <input type="checkbox" name="featured" value="true" defaultChecked={featured} />
                  <span>Featured Products</span>
                </label>
                <label className="store-check-option">
                  <input type="checkbox" name="bestDeals" value="true" defaultChecked={bestDeals} />
                  <span>Best Deals</span>
                </label>
              </fieldset>

              <fieldset className="store-filter-group store-category-filter">
                <legend>Product Categories</legend>
                {filters.categories.map((category) => (
                  <label
                    className="store-check-option"
                    data-child={category.parentId !== null}
                    key={category.id}
                  >
                    <input
                      type="checkbox"
                      name="categoryIds"
                      value={category.id}
                      defaultChecked={categoryIds.includes(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="store-filter-group">
                <legend>Customer Rating</legend>
                {[4, 3, 2, 1].map((rating) => (
                  <label className="store-check-option" key={rating}>
                    <input
                      type="radio"
                      name="minRating"
                      value={rating}
                      defaultChecked={minRating === rating}
                    />
                    <span>{rating} stars &amp; up</span>
                  </label>
                ))}
              </fieldset>

              <div className="store-filter-actions">
                <button className="products-submit" type="submit">Apply Filters</button>
                <Link href="/products">Clear all</Link>
              </div>
            </form>
          </aside>

          <section className="store-results" aria-labelledby="store-title">
            <header className="store-results-heading">
              <div>
                <p className="products-eyebrow">THE INDIA DÉCOR</p>
                <h1 id="store-title">Home decor store</h1>
                <p>Shop curated wall art and modern decor for every room.</p>
              </div>
              <label className="store-search">
                <span className="visually-hidden">Search products</span>
                <input
                  form="store-search-form"
                  type="search"
                  name="search"
                  placeholder="Search products"
                  defaultValue={search}
                />
              </label>
              <form id="store-search-form" action="/products" method="get">
                <input type="hidden" name="sortBy" value={sortBy} />
                {categoryIds.map((id) => (
                  <input type="hidden" name="categoryIds" value={id} key={id} />
                ))}
                {newArrivals && <input type="hidden" name="newArrivals" value="true" />}
                {featured && <input type="hidden" name="featured" value="true" />}
                {bestDeals && <input type="hidden" name="bestDeals" value="true" />}
                {minPrice !== undefined && <input type="hidden" name="minPrice" value={minPrice} />}
                {maxPrice !== undefined && <input type="hidden" name="maxPrice" value={maxPrice} />}
                {minRating !== undefined && <input type="hidden" name="minRating" value={minRating} />}
              </form>
            </header>

            <div className="store-results-meta" aria-live="polite">
              {result.count > 0
                ? `Showing ${firstProduct}–${lastProduct} of ${result.count} products`
                : search
                  ? `No products found for “${search}”`
                  : "No products available yet"}
            </div>

            {result.products.length > 0 ? (
              <div className="product-grid catalog-grid">
                {result.products.map((product) => (
                  <ProductCard
                    key={`${product.id}-${product.slug}`}
                    product={product}
                    showRating
                  />
                ))}
              </div>
            ) : (
              <div className="products-empty">
                <p>We couldn&apos;t find any products matching these filters.</p>
                <Link href="/products">Clear filters</Link>
              </div>
            )}

            {pageCount > 1 && (
              <nav className="products-pagination" aria-label="Product pages">
                {pageNumber > 1 ? (
                  <Link href={productsPageHref(pageNumber - 1, paginationState)}>
                    Previous
                  </Link>
                ) : (
                  <span aria-disabled="true">Previous</span>
                )}
                <span>Page {pageNumber} of {pageCount}</span>
                {pageNumber < pageCount ? (
                  <Link href={productsPageHref(pageNumber + 1, paginationState)}>
                    Next
                  </Link>
                ) : (
                  <span aria-disabled="true">Next</span>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
