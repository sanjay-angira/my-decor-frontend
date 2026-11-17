"use client";

import { useFilterContext } from "@/components/store/storeFilterContext";

export function StoreMobileFilterButton() {
  const { toggleFilters, updateToggleFilters } = useFilterContext();

  return (
    <button
      type="button"
      className="store-mobile-filters-btn"
      aria-expanded={toggleFilters}
      aria-controls="store-section"
      onClick={() => updateToggleFilters(!toggleFilters)}
    >
      {toggleFilters ? "Hide Filters" : "Show Filters"}
    </button>
  );
}
