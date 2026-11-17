import Image from "next/image";
import Link from "next/link";
import { AutoSubmitFilterForm } from "@/components/AutoSubmitFilterForm";
import { PriceRangeFilter } from "@/components/PriceRangeFilter";
import { ProductCard } from "@/components/ProductCard";
import HeroBanner, { type HeroSlide } from "@/components/homepage/HeroBanner";
import {
  fetchStoreFilters,
  fetchStoreProducts,
  type StoreCategory,
  type StoreProductsQuery,
} from "@/services/homepageService";

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
    categoryIds: number[];
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
  if (state.categoryIds.length) {
    params.set("categoryIds", state.categoryIds.join(","));
  }
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
  const selectedCategoryIds = category ? [] : [
    ...new Set(
      allValues(query.categoryIds)
        .flatMap((value) => value.split(","))
        .map((value) => Number(value))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  ];
  const categoryIds = category ? [category.id] : selectedCategoryIds;
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
  const filterFormKey = JSON.stringify({
    pagePath,
    search,
    sortBy,
    selectedCategoryIds,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
  });
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
  const paginationState = {
    search,
    sortBy,
    categoryIds: selectedCategoryIds,
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
  for (const categoryId of selectedCategoryIds) {
    const categoryOption = filters.categories.find(({ id }) => id === categoryId);
    activeFilters.push({
      id: `category-${categoryId}`,
      label: categoryOption?.name || `Category ${categoryId}`,
      href: filterHref({
        categoryIds: selectedCategoryIds.filter((id) => id !== categoryId),
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
  const heroSlides: HeroSlide[] = filters.banners.flatMap((banner, index) => {
    const desktopImage =
      banner.desktopImage ||
      banner.image ||
      banner.tabletImage ||
      banner.mobileImage ||
      "";
    if (!desktopImage) return [];
    const categoryId = /^category-(\d+)$/.exec(banner.id)?.[1];
    const bannerCategory = categoryId
      ? filters.categories.find((item) => item.id === Number(categoryId))
      : undefined;
    return [{
      id: index + 1,
      title: banner.title,
      href: bannerCategory?.slug
        ? `/category/${encodeURIComponent(bannerCategory.slug)}`
        : categoryId
          ? `/products?categoryIds=${categoryId}`
          : "/products",
      desktopImage,
      tabletImage: banner.tabletImage || desktopImage,
      mobileImage: banner.mobileImage || banner.tabletImage || desktopImage,
    }];
  });

  return (
    <main className="store-page">
      {!category && <HeroBanner slides={heroSlides} />}

      <div className="container-page store-content">
        {category?.desktopBanner && (
          <div className="store-category-banner">
            <Image
              src={category.desktopBanner}
              alt={`${category.name} collection`}
              fill
              sizes="100vw"
              priority
              unoptimized
            />
          </div>
        )}

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

        <div className="store-layout">
          <aside className="store-sidebar" aria-label="Product filters">
            <AutoSubmitFilterForm action={pagePath} key={filterFormKey}>
              <input type="hidden" name="search" value={search} />
              {categoryIds
                .filter((id) => category && id === category.id)
                .map((id) => (
                  <input type="hidden" name="categoryIds" value={id} key={id} />
                ))}

              <fieldset className="store-filter-group">
                <legend>Price</legend>
                <PriceRangeFilter
                  key={`${minPrice ?? ""}-${maxPrice ?? ""}`}
                  min={rangeMin}
                  max={rangeMax}
                  selectedMin={minPrice}
                  selectedMax={maxPrice}
                />
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

              {!category && (
                <fieldset className="store-filter-group store-category-filter">
                  <legend>Product Categories</legend>
                  {filters.categories.map((categoryOption) => (
                    <label
                      className="store-check-option"
                      data-child={categoryOption.parentId !== null}
                      key={categoryOption.id}
                    >
                      <input
                        type="checkbox"
                        name="categoryIds"
                        value={categoryOption.id}
                        defaultChecked={selectedCategoryIds.includes(categoryOption.id)}
                      />
                      <span>{categoryOption.name}</span>
                    </label>
                  ))}
                </fieldset>
              )}

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

            </AutoSubmitFilterForm>
          </aside>

          <section className="store-results" aria-labelledby="store-title">
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
        </div>
      </div>
    </main>
  );
}
