"use client";

import { createContext, useContext } from "react";
import type { StoreCategory, StoreFilters } from "@/services/homepageService";

export type FilterContextType = {
  filters: StoreFilters | null;
  category: StoreCategory | null;
  pagePath: string;
  toggleFilters: boolean;
  updateToggleFilters: (open: boolean) => void;
  isLoading: boolean;
};

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
);

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      "useFilterContext must be used within a StoreAndCategoryFlowWrapper",
    );
  }
  return context;
}
