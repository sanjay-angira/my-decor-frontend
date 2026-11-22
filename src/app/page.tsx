import { RecentlyViewed } from "@/components/homepage/RecentlyViewed";
import HeroBanner, { type HeroSlide } from "@/components/homepage/HeroBanner";
import CategoryCircles from "@/components/homepage/CategoryCircles";
import TrustedBy from "@/components/homepage/TrustedBy";
import Newsletter from "@/components/homepage/Newsletter";
import NewArrivals from "@/components/homepage/NewArrivals";
import ShopByRoom from "@/components/homepage/ShopByRoom";
import MidBanner from "@/components/homepage/MidBanner";
import BestSellers from "@/components/homepage/BestSellers";
import FeaturedProducts from "@/components/homepage/FeaturedProducts";
import TrustBadges from "@/components/homepage/TrustBadges";
import CategoryTiles from "@/components/homepage/CategoryTiles";
import {
  fetchHomepageBanners,
  fetchHomepageProducts,
  fetchHomepageRooms,
  fetchStoreCategories,
} from "@/services/homepageService";

export const dynamic = "force-dynamic";

const image = (name: string) => `/images/${name}.jpg`;

const roundCategories = [
  ["Wall Art", "art_tree"],
  ["Car Wall Art", "art_car"],
  ["Spiritual Wall Art", "art_buddha"],
  ["Planters", "planters"],
  ["Lamps", "lamp"],
  ["Desk Organizers", "desk_organizer"],
  ["Gym Wall Art", "art_gym"],
  ["Bike Wall Art", "art_bike"],
].map(([label, asset]) => ({ label, image: image(asset) }));

export default async function Home() {
  const [
    heroSlides,
    featuredProducts,
    bestSellers,
    newArrivals,
    rooms,
    storeCategories,
  ] =
    await Promise.all([
    fetchHomepageBanners().catch((error) => {
      console.error("Failed to load homepage banners on the server.", error);
      return [] as HeroSlide[];
    }),
    fetchHomepageProducts("featured", 12).catch((error) => {
      console.error("Failed to load featured products on the server.", error);
      return [];
    }),
    fetchHomepageProducts("bestSellers",10).catch((error) => {
      console.error("Failed to load best sellers on the server.", error);
      return [];
    }),
    fetchHomepageProducts("newArrivals",12).catch((error) => {
      console.error("Failed to load new arrivals on the server.", error);
      return [];
    }),
    fetchHomepageRooms().catch((error) => {
      console.error("Failed to load rooms on the server.", error);
      return [];
    }),
    fetchStoreCategories().catch((error) => {
      console.error("Failed to load homepage categories on the server.", error);
      return [];
    }),
  ]);

  const parentCategories = storeCategories.filter(
    (category) => category.parentId === null,
  );

  return (
    <main>
      <HeroBanner slides={heroSlides} />
      <CategoryCircles categories={roundCategories} />
      <CategoryTiles categories={parentCategories} />
      <TrustBadges />
      {/* <FeaturedCollection categories={featuredCategories}/> */}
      <FeaturedProducts products={featuredProducts} />
      <BestSellers products={bestSellers} />
      <MidBanner />
      <ShopByRoom rooms={rooms} />
      <NewArrivals products={newArrivals} />
      <RecentlyViewed />
      <Newsletter />
      <TrustedBy />
    </main>
  );
}
