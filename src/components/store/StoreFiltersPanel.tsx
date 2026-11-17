"use client";

import { useSearchParams } from "next/navigation";
import { AutoSubmitFilterForm } from "@/components/AutoSubmitFilterForm";
import { PriceRangeFilter } from "@/components/PriceRangeFilter";
import { useFilterContext } from "@/components/store/storeFilterContext";
import type { StoreProductsQuery } from "@/services/homepageService";

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

function allValues(searchParams: URLSearchParams, key: string): string[] {
  return searchParams.getAll(key);
}

function parseOptionalNumber(value: string | undefined): number | undefined {
  if (!value?.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function isChecked(value: string | undefined): boolean {
  return value === "true" || value === "1" || value === "on";
}

export function StoreFiltersPanel() {
  const searchParams = useSearchParams();
  const { filters, category, pagePath, isLoading } = useFilterContext();

  if (isLoading && !filters) {
    return <div className="store-filters-loading">Loading filters…</div>;
  }

  if (!filters) {
    return <div className="store-filters-loading">Filters unavailable.</div>;
  }

  const search = firstValue(searchParams.get("search")).trim();
  const offerSlugs = [
    ...new Set(
      firstValue(searchParams.get("offer"))
        .split("/")
        .map((slug) => slug.trim())
        .filter(Boolean),
    ),
  ];
  const requestedSort = firstValue(searchParams.get("sortBy"));
  const sortBy = sortOptions.find((option) => option === requestedSort) ?? "newest";
  const selectedCategoryIds = category
    ? []
    : [
        ...new Set(
          allValues(searchParams, "categoryIds")
            .flatMap((value) => value.split(","))
            .map((value) => Number(value))
            .filter((id) => Number.isInteger(id) && id > 0),
        ),
      ];
  const categoryIds = category ? [category.id] : selectedCategoryIds;
  const rangeMin = Number(filters.priceRange.min) || 0;
  const rangeMax = Math.max(rangeMin, Number(filters.priceRange.max) || rangeMin);
  const requestedMinPrice = parseOptionalNumber(
    firstValue(searchParams.get("minPrice")) || undefined,
  );
  const requestedMaxPrice = parseOptionalNumber(
    firstValue(searchParams.get("maxPrice")) || undefined,
  );
  const minPrice =
    requestedMinPrice === undefined
      ? undefined
      : Math.min(rangeMax, Math.max(rangeMin, requestedMinPrice));
  const maxPrice =
    requestedMaxPrice === undefined
      ? undefined
      : Math.min(rangeMax, Math.max(rangeMin, requestedMaxPrice));
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
    offerSlugs,
    sortBy,
    selectedCategoryIds,
    minPrice,
    maxPrice,
    minRating,
    newArrivals,
    featured,
    bestDeals,
    categoryId: category?.id ?? null,
  });

  return (
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

      {filters.offers && filters.offers.length > 0 && (
        <fieldset className="store-filter-group store-offer-filter">
          <legend>Offers</legend>
          {filters.offers.map((offer) => (
            <label className="store-check-option" key={offer.id}>
              <input
                type="checkbox"
                name="offer"
                value={offer.slug || offer.id}
                defaultChecked={offer.slug
                  ? offerSlugs.includes(offer.slug)
                  : false}
              />
              <span>{offer.name}</span>
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
  );
}
