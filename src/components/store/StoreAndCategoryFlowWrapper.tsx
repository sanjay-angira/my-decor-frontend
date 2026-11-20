"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useParams, usePathname } from "next/navigation";
import HeroBanner from "@/components/homepage/HeroBanner";
import {
  StoreFiltersPanel,
  StoreFiltersSkeleton,
} from "@/components/store/StoreFiltersPanel";
import { StoreMobileFilterButton } from "@/components/store/StoreMobileFilterButton";
import {
  FilterContext,
  type FilterContextType,
} from "@/components/store/storeFilterContext";
import {
  fetchHomepageBanners,
  fetchStoreFilterOptions,
  type HomepageBanner,
  type StoreCategory,
  type StoreFilters,
} from "@/services/homepageService";

export { useFilterContext } from "@/components/store/storeFilterContext";

function StoreAndCategoryFlowWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const params = useParams<{ slug?: string }>();
  const slugParam = typeof params?.slug === "string" ? params.slug : "";
  const isCategoryRoute = Boolean(pathname?.startsWith("/category/"));
  const currentSlug = isCategoryRoute
    ? slugParam || pathname?.split("/category/")[1]?.split("?")[0] || ""
    : "";
  const pagePath = currentSlug
    ? `/category/${encodeURIComponent(currentSlug)}`
    : "/products";

  const [filters, setFilters] = useState<StoreFilters | null>(null);
  const [category, setCategory] = useState<StoreCategory | null>(null);
  const [heroSlides, setHeroSlides] = useState<HomepageBanner[]>([]);
  const [toggleFilters, setToggleFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateToggleFilters = useCallback((open: boolean) => {
    setToggleFilters(open);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const getBannerData = async () => {
      try {
        const banners = await fetchHomepageBanners();
        if (!cancelled) {
          setHeroSlides(
            currentSlug
              ? banners.filter(
                (banner) =>
                  banner.source === "category" &&
                  banner.slug.trim().toLowerCase() ===
                  currentSlug.trim().toLowerCase(),
              )
              : banners,
          );
        }
      } catch (error) {
        console.error("Failed to load store/category banners.", error);
        if (!cancelled) setHeroSlides([]);
      }
    }

    const loadSharedData = async () => {
      setIsLoading(true);
      try {
        const filterOptions = await fetchStoreFilterOptions(currentSlug || undefined);
        console.log("Fetched filter options:", filterOptions);
        if (!cancelled) {
          setFilters(filterOptions);
          setCategory(filterOptions.selectedCategory);
        }
      } catch (error) {
        console.error("Failed to load store/category layout data.", error);
        if (!cancelled) {
          setFilters(null);
          setCategory(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadSharedData();
    void getBannerData()
    return () => {
      cancelled = true;
    };
  }, [currentSlug]);

  const contextValue = useMemo<FilterContextType>(
    () => ({
      filters,
      category,
      pagePath,
      toggleFilters,
      updateToggleFilters,
      isLoading,
    }),
    [filters, category, pagePath, toggleFilters, updateToggleFilters, isLoading],
  );

  return (
    <FilterContext.Provider value={contextValue}>
      <main className="store-page">
        {heroSlides.length > 0 ? (
          <HeroBanner slides={heroSlides} />
        ) : isLoading ? (
          <div className="page-width hero-section" aria-hidden="true">
            <div className="store-skeleton-block store-hero-skeleton" />
          </div>
        ) : null}

        <div className="container-page store-content">
          <div className="store-mobile-filters-bar">
            <StoreMobileFilterButton />
          </div>

          <div className="store-layout" id="store-section">
            <aside
              className={`store-sidebar${toggleFilters ? " is-open" : ""}`}
              aria-label="Product filters"
              data-open={toggleFilters ? "true" : "false"}
            >
              <Suspense fallback={<StoreFiltersSkeleton />}>
                <StoreFiltersPanel />
              </Suspense>
            </aside>
            {children}
          </div>
        </div>
      </main>
    </FilterContext.Provider>
  );
}

export default StoreAndCategoryFlowWrapper;
