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
import HeroBanner, { type HeroSlide } from "@/components/homepage/HeroBanner";
import {
  StoreFiltersPanel,
  StoreFiltersSkeleton,
} from "@/components/store/StoreFiltersPanel";
import { StoreMobileFilterButton } from "@/components/store/StoreMobileFilterButton";
import {
  FilterContext,
  type FilterContextType,
} from "@/components/store/storeFilterContext";
import { API_ENDPOINTS } from "@/services/api/API_ENDPOINT";
import { getData } from "@/services/api/apiService";
import type { ApiSuccessResponse } from "@/services/api/errors";
import type { StoreCategory, StoreFilters } from "@/services/homepageService";

export { useFilterContext } from "@/components/store/storeFilterContext";

type StoreCategoriesResponse = {
  rows?: Array<{
    id: number;
    name: string;
    slug?: string | null;
    description?: string | null;
    desktopBanner?: string | null;
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

function cleanDescription(value?: string | null): string {
  const description = (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return description.toLowerCase().startsWith("no descr") ? "" : description;
}

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
  const [toggleFilters, setToggleFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const updateToggleFilters = useCallback((open: boolean) => {
    setToggleFilters(open);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSharedData = async () => {
      setIsLoading(true);
      try {
        const filtersResponse = await getData<ApiSuccessResponse<StoreFilters>>(
          API_ENDPOINTS.CUSTOMER.STORE_FILTERS,
          undefined,
          { auth: false },
        );

        if (
          !cancelled &&
          filtersResponse.success &&
          Array.isArray(filtersResponse.data?.categories) &&
          filtersResponse.data.priceRange &&
          Array.isArray(filtersResponse.data.banners)
        ) {
          setFilters(filtersResponse.data);
        }

        if (!currentSlug) {
          if (!cancelled) setCategory(null);
          return;
        }

        const categoriesResponse = await getData<ApiSuccessResponse<StoreCategoriesResponse>>(API_ENDPOINTS.CUSTOMER.CATEGORIES, undefined, { auth: false });

        if (!cancelled && categoriesResponse.success) {
          const match = categoriesResponse.data?.rows?.find(
            (item) =>
              item.slug?.trim().toLowerCase() ===
              currentSlug.trim().toLowerCase(),
          );
          if (match?.slug) {
            setCategory({
              id: match.id,
              name: match.name,
              slug: match.slug,
              description: cleanDescription(match.description),
              desktopBanner: match.desktopBanner || null,
              categoryOffers: Array.isArray(match.categoryOffers)
                ? match.categoryOffers.map((offer) => ({
                    ...offer,
                    desktopImage: offer.desktopImage ?? null,
                    tabletImage: offer.tabletImage ?? null,
                    mobileImage: offer.mobileImage ?? null,
                  }))
                : [],
            });
          } else {
            setCategory(null);
          }
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
    return () => {
      cancelled = true;
    };
  }, [currentSlug]);

  const heroSlides = useMemo<HeroSlide[]>(() => {
    if (!filters?.banners?.length || currentSlug) return [];
    return filters.banners.flatMap((banner, index) => {
      const desktopImage =
        banner.desktopImage ||
        banner.tabletImage ||
        banner.mobileImage ||
        "";
      if (!desktopImage) return [];
      if (banner.source === "offer") {
        const offerId = /^offer-(\d+)$/.exec(banner.id)?.[1];
        const offer = offerId
          ? filters.offers?.find((item) => item.id === Number(offerId))
          : undefined;
        const offerSlug = offer?.slug?.trim();
        return [
          {
            id: index + 1,
            source: "offer",
            title: banner.title,
            slug: offerSlug || "",
            desktopImage,
            tabletImage: banner.tabletImage || desktopImage,
            mobileImage: banner.mobileImage || banner.tabletImage || desktopImage,
          },
        ];
      }
      const categoryId = /^category-(\d+)$/.exec(banner.id)?.[1];
      const bannerCategory = categoryId
        ? filters.categories.find((item) => item.id === Number(categoryId))
        : undefined;
      return [
        {
          id: index + 1,
          source: "category",
          title: banner.title,
          slug: bannerCategory?.slug || "",
          desktopImage,
          tabletImage: banner.tabletImage || desktopImage,
          mobileImage: banner.mobileImage || banner.tabletImage || desktopImage,
        },
      ];
    });
  }, [currentSlug, filters]);

  const categoryHeroSlides = useMemo<HeroSlide[]>(() => {
    if (!currentSlug || !category) return [];

    const offerSlides = (category.categoryOffers ?? []).flatMap(
      (offer, index) => {
        const desktopImage =
          offer.desktopImage ||
          offer.tabletImage ||
          offer.mobileImage ||
          "";
        if (!desktopImage || !offer.slug?.trim()) return [];
        return [
          {
            id: index + 1,
            source: "offer",
            title: offer.name,
            slug: offer.slug.trim(),
            desktopImage,
            tabletImage: offer.tabletImage || desktopImage,
            mobileImage:
              offer.mobileImage || offer.tabletImage || desktopImage,
          },
        ];
      },
    );
    if (offerSlides.length) return offerSlides;

    const desktopImage = category.desktopBanner?.trim();
    if (!desktopImage) return [];
    return [
      {
        id: category.id,
        source: "category",
        title: category.name,
        slug: category.slug,
        href: null,
        desktopImage,
        tabletImage: desktopImage,
        mobileImage: desktopImage,
      },
    ];
  }, [category, currentSlug]);
  const displayedHeroSlides = currentSlug ? categoryHeroSlides : heroSlides;
  const heroAriaLabel = currentSlug && category
    ? `${category.name} collection banner`
    : "Featured collections";

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
        {displayedHeroSlides.length > 0 ? (
          <HeroBanner
            slides={displayedHeroSlides}
            ariaLabel={heroAriaLabel}
          />
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
