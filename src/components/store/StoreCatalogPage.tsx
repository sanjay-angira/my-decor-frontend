import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  fetchStoreFilters,
  fetchStoreProducts,
  type StoreCategory,
  type StoreProductsQuery,
} from "@/services/homepageService";
import { resolveSluggedOptions } from "@/utils/storeFilterSlugs";

type StoreCatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  category?: StoreCategory;
};

type ActiveFilter = {
  id: string;
  label: string;
  href: string;
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

function storePageHref(
  page: number,
  state: {
    search: string;
    sortBy: NonNullable<StoreProductsQuery["sortBy"]>;
    categorySlugs: string[];
    offerValues: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    newArrivals: boolean;
    featured: boolean;
    bestDeals: boolean;
  },
  pathname: string,
): string {
  const params = new URLSearchParams({
    page: String(page),
    sortBy: state.sortBy,
  });
  if (state.search) params.set("search", state.search);
  if (state.offerValues.length) params.set("offer", state.offerValues.join("/"));
  state.categorySlugs.forEach((slug) => params.append("category", slug));
  if (state.minPrice !== undefined) params.set("minPrice", String(state.minPrice));
  if (state.maxPrice !== undefined) params.set("maxPrice", String(state.maxPrice));
  if (state.minRating !== undefined) params.set("minRating", String(state.minRating));
  if (state.newArrivals) params.set("newArrivals", "true");
  if (state.featured) params.set("featured", "true");
  if (state.bestDeals) params.set("bestDeals", "true");
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export async function StoreCatalogPage({
  searchParams,
  category,
}: StoreCatalogPageProps) {
  const pagePath = category
    ? `/category/${encodeURIComponent(category.slug)}`
    : "/products";
  const query = await searchParams;
  const filters = await fetchStoreFilters();
  const search = firstValue(query.search).trim();
  const requestedPage = Number.parseInt(firstValue(query.page), 10);
  const pageNumber = Number.isFinite(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1;
  const requestedSort = firstValue(query.sortBy);
  const sortBy = sortOptions.find((option) => option === requestedSort) ?? "newest";
  const selectedCategories = category
    ? []
    : resolveSluggedOptions(filters.categories, [
        ...allValues(query.category),
        ...allValues(query.categoryIds),
      ]);
  const selectedCategorySlugs = selectedCategories
    .map((item) => item.slug?.trim())
    .filter((slug): slug is string => Boolean(slug));
  const selectedCategoryIds = selectedCategories.map((item) => item.id);
  const categoryIds = category ? [category.id] : selectedCategoryIds;
  const selectedOffers = resolveSluggedOptions(
    filters.offers,
    allValues(query.offer),
  );
  const offerValues = selectedOffers
    .map((item) => item.slug?.trim())
    .filter((slug): slug is string => Boolean(slug));
  const offerIds = selectedOffers.map((item) => item.id);
  const rangeMin = Number(filters.priceRange.min) || 0;
  const rangeMax = Math.max(rangeMin, Number(filters.priceRange.max) || rangeMin);
  const requestedMinPrice = parseOptionalNumber(firstValue(query.minPrice));
  const requestedMaxPrice = parseOptionalNumber(firstValue(query.maxPrice));
  let minPrice = requestedMinPrice === undefined
    ? undefined
    : Math.min(rangeMax, Math.max(rangeMin, requestedMinPrice));
  let maxPrice = requestedMaxPrice === undefined
    ? undefined
    : Math.min(rangeMax, Math.max(rangeMin, requestedMaxPrice));
  if (
    minPrice !== undefined &&
    maxPrice !== undefined &&
    minPrice > maxPrice
  ) {
    minPrice = undefined;
    maxPrice = undefined;
  }
  const minRating = parseOptionalNumber(firstValue(query.minRating));
  const newArrivals = isChecked(firstValue(query.newArrivals));
  const featured = isChecked(firstValue(query.featured));
  const bestDeals = isChecked(firstValue(query.bestDeals));
  const result = await fetchStoreProducts({
    pageNumber,
    pageSize,
    search,
    sortBy,
    offerIds,
    categoryIds,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
  });
  const pageCount = Math.ceil(result.count / pageSize);
  const paginationState = {
    search,
    sortBy,
    categorySlugs: selectedCategorySlugs,
    offerValues,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
  };
  const filterHref = (updates: Partial<typeof paginationState>) =>
    storePageHref(1, { ...paginationState, ...updates }, pagePath);
  const activeFilters: ActiveFilter[] = [];

  for (const offerValue of offerValues) {
    const offer = filters.offers?.find(
      (item) => item.slug?.trim().toLowerCase() === offerValue.toLowerCase(),
    );
    activeFilters.push({
      id: `offer-${offerValue}`,
      label: offer?.name || "Offer",
      href: filterHref({
        offerValues: offerValues.filter((value) => value !== offerValue),
      }),
    });
  }
  if (newArrivals) {
    activeFilters.push({
      id: "new-arrivals",
      label: "New Arrivals",
      href: filterHref({ newArrivals: false }),
    });
  }
  if (bestDeals) {
    activeFilters.push({
      id: "best-deals",
      label: "Best Deals",
      href: filterHref({ bestDeals: false }),
    });
  }
  for (const categorySlug of selectedCategorySlugs) {
    const categoryOption = filters.categories.find(
      (item) => item.slug?.trim().toLowerCase() === categorySlug.toLowerCase(),
    );
    activeFilters.push({
      id: `category-${categorySlug}`,
      label: categoryOption?.name || categorySlug,
      href: filterHref({
        categorySlugs: selectedCategorySlugs.filter(
          (slug) => slug !== categorySlug,
        ),
      }),
    });
  }
  if (featured) {
    activeFilters.push({
      id: "featured",
      label: "Featured Products",
      href: filterHref({ featured: false }),
    });
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    const formatPrice = (value: number) =>
      `₹${value.toLocaleString("en-IN")}`;
    const priceLabel =
      minPrice !== undefined && maxPrice !== undefined
        ? `Price: ${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
        : minPrice !== undefined
          ? `Price from ${formatPrice(minPrice)}`
          : `Price up to ${formatPrice(maxPrice ?? rangeMax)}`;
    activeFilters.push({
      id: "price",
      label: priceLabel,
      href: filterHref({ minPrice: undefined, maxPrice: undefined }),
    });
  }
  if (minRating !== undefined) {
    activeFilters.push({
      id: "rating",
      label: `${minRating}+ stars`,
      href: filterHref({ minRating: undefined }),
    });
  }
  if (sortBy !== "newest") {
    const sortLabels: Record<
      NonNullable<StoreProductsQuery["sortBy"]>,
      string
    > = {
      newest: "Newest",
      price_asc: "Price: Low to High",
      price_desc: "Price: High to Low",
      name_asc: "Name: A to Z",
      discount_desc: "Best Discount",
    };
    activeFilters.push({
      id: "sort",
      label: sortLabels[sortBy],
      href: filterHref({ sortBy: "newest" }),
    });
  }
  if (search) {
    activeFilters.push({
      id: "search",
      label: `Search: ${search}`,
      href: filterHref({ search: "" }),
    });
  }

  return (
    <section className="store-results" aria-labelledby="store-title">
      <nav className="store-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">›</span>
        {category ? (
          <>
            <Link href="/products">All Products</Link>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{category.name}</span>
          </>
        ) : (
          <span>All Products</span>
        )}
      </nav>

      <header className="store-results-heading">
        <div>
          <p className="products-eyebrow">THE INDIA DÉCOR</p>
          <h1 id="store-title">{category?.name || "Home decor store"}</h1>
          {category ? (
            category.description && <p>{category.description}</p>
          ) : (
            <p>Shop curated wall art and modern decor for every room.</p>
          )}
        </div>
      </header>

      {activeFilters.length > 0 && (
        <div className="store-active-filters" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <Link
              className="store-active-filter"
              href={filter.href}
              key={filter.id}
              aria-label={`Remove ${filter.label} filter`}
            >
              <span>{filter.label}</span>
              <span className="store-active-filter-remove" aria-hidden="true">
                ×
              </span>
            </Link>
          ))}
          <Link className="store-clear-filters" href={pagePath}>
            Clear Filters
          </Link>
        </div>
      )}

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
        </div>
      )}

      {pageCount > 1 && (
        <nav className="products-pagination" aria-label="Product pages">
          {pageNumber > 1 ? (
            <Link href={storePageHref(pageNumber - 1, paginationState, pagePath)}>
              Previous
            </Link>
          ) : (
            <span aria-disabled="true">Previous</span>
          )}
          <span>Page {pageNumber} of {pageCount}</span>
          {pageNumber < pageCount ? (
            <Link href={storePageHref(pageNumber + 1, paginationState, pagePath)}>
              Next
            </Link>
          ) : (
            <span aria-disabled="true">Next</span>
          )}
        </nav>
      )}
    </section>
  );
}
