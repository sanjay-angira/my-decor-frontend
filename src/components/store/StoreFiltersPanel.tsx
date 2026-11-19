"use client";

import { useSearchParams } from "next/navigation";
import { AutoSubmitFilterForm } from "@/components/AutoSubmitFilterForm";
import { PriceRangeFilter } from "@/components/PriceRangeFilter";
import { useFilterContext } from "@/components/store/storeFilterContext";
import type { StoreProductsQuery } from "@/services/homepageService";
import { resolveSluggedOptions } from "@/utils/storeFilterSlugs";

const sortOptions: NonNullable<StoreProductsQuery["sortBy"]>[] = [
  "newest",
  "price_asc",
  "price_desc",
  "name_asc",
  "discount_desc",
];

function firstValue(value: string | null): string {
  return value ?? "";
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isChecked(value: string | undefined): boolean {
  return value === "true" || value === "1" || value === "on";
}

export function StoreFiltersSkeleton() {
  return (
    <div className="store-filter-skeleton" aria-busy="true">
      <span className="visually-hidden" role="status">
        Loading filters
      </span>
      <div aria-hidden="true">
        {["price", "sort", "types", "categories", "offers", "rating"].map(
          (group) => (
            <div className="store-filter-skeleton-group" key={group}>
              <span className="store-skeleton-block store-filter-skeleton-title" />
              <span className="store-skeleton-block store-filter-skeleton-row" />
              <span className="store-skeleton-block store-filter-skeleton-row" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}

export function StoreFiltersPanel() {
  const searchParams = useSearchParams();
  const { filters, category, pagePath, isLoading } = useFilterContext();

  if (isLoading && !filters) {
    return <StoreFiltersSkeleton />;
  }

  if (!filters) {
    return <div className="store-filters-loading">Filters unavailable.</div>;
  }

  const search = firstValue(searchParams.get("search")).trim();
  const selectedOffers = resolveSluggedOptions(
    filters.offers,
    searchParams.getAll("offer"),
  );
  const offerValues = selectedOffers
    .map((offer) => offer.slug?.trim())
    .filter((slug): slug is string => Boolean(slug));
  const selectedCategories = category
    ? []
    : resolveSluggedOptions(filters.categories, [
        ...searchParams.getAll("category"),
        ...searchParams.getAll("categoryIds"),
      ]);
  const selectedCategorySlugs = selectedCategories
    .map((item) => item.slug?.trim().toLowerCase())
    .filter((slug): slug is string => Boolean(slug));
  const requestedSort = firstValue(searchParams.get("sortBy"));
  const sortBy = sortOptions.find((option) => option === requestedSort) ?? "newest";
  const rangeMin = Number(filters.priceRange.min) || 0;
  const rangeMax = Math.max(rangeMin, Number(filters.priceRange.max) || rangeMin);
  const requestedMinPrice = parseOptionalNumber(
    firstValue(searchParams.get("minPrice")) || undefined,
  );
  const requestedMaxPrice = parseOptionalNumber(
    firstValue(searchParams.get("maxPrice")) || undefined,
  );
  let minPrice =
    requestedMinPrice === undefined
      ? undefined
      : Math.min(rangeMax, Math.max(rangeMin, requestedMinPrice));
  let maxPrice =
    requestedMaxPrice === undefined
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
  const minRating = parseOptionalNumber(
    firstValue(searchParams.get("minRating")) || undefined,
  );
  const newArrivals = isChecked(
    firstValue(searchParams.get("newArrivals")) || undefined,
  );
  const featured = isChecked(firstValue(searchParams.get("featured")) || undefined);
  const bestDeals = isChecked(
    firstValue(searchParams.get("bestDeals")) || undefined,
  );
  const filterFormKey = JSON.stringify({
    pagePath,
    search,
    offerValues,
    sortBy,
    selectedCategorySlugs,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
    categorySlug: category?.slug ?? null,
  });

  return (
    <AutoSubmitFilterForm action={pagePath} key={filterFormKey}>
      <input type="hidden" name="search" value={search} />

      <fieldset className="store-filter-group">
        <legend>Price</legend>
        <PriceRangeFilter
          key={`${rangeMin}-${rangeMax}-${minPrice ?? ""}-${maxPrice ?? ""}`}
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
          <input
            type="checkbox"
            name="newArrivals"
            value="true"
            defaultChecked={newArrivals}
          />
          <span>New Arrivals</span>
        </label>
        <label className="store-check-option">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={featured}
          />
          <span>Featured Products</span>
        </label>
        <label className="store-check-option">
          <input
            type="checkbox"
            name="bestDeals"
            value="true"
            defaultChecked={bestDeals}
          />
          <span>Best Deals</span>
        </label>
      </fieldset>

      {!category && (
        <fieldset className="store-filter-group store-category-filter">
          <legend>Product Categories</legend>
          {filters.categories.map((categoryOption) => {
            const slug = categoryOption.slug?.trim();
            if (!slug) return null;

            return (
              <label
                className="store-check-option"
                data-child={categoryOption.parentId !== null}
                key={categoryOption.id}
              >
                <input
                  type="checkbox"
                  name="category"
                  value={slug}
                  defaultChecked={selectedCategorySlugs.includes(
                    slug.toLowerCase(),
                  )}
                />
                <span>{categoryOption.name}</span>
              </label>
            );
          })}
        </fieldset>
      )}

      {filters.offers && filters.offers.length > 0 && (
        <fieldset className="store-filter-group store-offer-filter">
          <legend>Offers</legend>
          {filters.offers.map((offer) => {
            const slug = offer.slug?.trim();
            if (!slug) return null;
            const checked = offerValues.some(
              (selected) => selected.toLowerCase() === slug.toLowerCase(),
            );

            return (
              <label className="store-check-option" key={offer.id}>
                <input
                  type="checkbox"
                  name="offer"
                  value={slug}
                  defaultChecked={checked}
                />
                <span>{offer.name}</span>
              </label>
            );
          })}
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
  );
}
