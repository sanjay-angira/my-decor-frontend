export interface Category {
    id: number;
    categoryName: string;
    categorySlug: string;
    shortDescription: string;
    description: string;
    desktopBanner: string | null;
    tabletBanner: string | null,
    mobileBanner: string | null,
    image: string | null,
    video: string | null,
    isActive: true,
    showOnHomePage: false,
    useAsHeroBanner: false,
}
