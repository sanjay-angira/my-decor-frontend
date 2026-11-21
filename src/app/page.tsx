import { RecentlyViewed } from "@/components/homepage/RecentlyViewed";
import HeroBanner, { type HeroSlide } from "@/components/homepage/HeroBanner";
import TrustedBy from "@/components/homepage/TrustedBy";
import Newsletter from "@/components/homepage/Newsletter";
import NewArrivals from "@/components/homepage/NewArrivals";
import ShopByRoom from "@/components/homepage/ShopByRoom";
import MidBanner from "@/components/homepage/MidBanner";
import BestSellers from "@/components/homepage/BestSellers";
import FeaturedCollection from "@/components/homepage/FeaturedCollection";
import TrustBadges from "@/components/homepage/TrustBadges";
import CategoryTiles from "@/components/homepage/CategoryTiles";
import CategoryCircles from "@/components/homepage/CategoryCircles";
import {
  fetchHomepageBanners,
  fetchFeaturedCategories,
  fetchHomepageProducts,
  fetchHomepageRooms,
} from "@/services/homepageService";

export const dynamic = "force-dynamic";

const image = (name: string) => `/images/${name}.jpg`;

const categories = [
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
  const [heroSlides, bestSellers, newArrivals, rooms, featuredCategories] =
    await Promise.all([
    fetchHomepageBanners().catch((error) => {
      console.error("Failed to load homepage banners on the server.", error);
      return [] as HeroSlide[];
    }),
    fetchHomepageProducts("bestSellers").catch((error) => {
      console.error("Failed to load best sellers on the server.", error);
      return [];
    }),
    fetchHomepageProducts("newArrivals").catch((error) => {
      console.error("Failed to load new arrivals on the server.", error);
      return [];
    }),
    fetchHomepageRooms().catch((error) => {
      console.error("Failed to load rooms on the server.", error);
      return [];
    }),
    fetchFeaturedCategories().catch((error) => {
      console.error("Failed to load featured categories on the server.", error);
      return [];
    }),
  ]);

  return (
    <main>
      <HeroBanner slides={heroSlides} />
      <CategoryCircles categories={categories} />
      <CategoryTiles />
      <TrustBadges />
      <FeaturedCollection categories={featuredCategories.map((category) => ({
        title: category.title,
        blurb: category.blurb,
        image: category.mobileImage || category.image || "",
        slug: category.slug,
      }))} />
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
