import { RecentlyViewed } from "@/components/homepage/RecentlyViewed";
import {
  bestSellerSlugs,
  getProductsBySlugs,
  newArrivalSlugs,
} from "@/data/products";
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
import { fetchHomepageBanners } from "@/services/homepageService";

export const dynamic = "force-dynamic";

const image = (name: string) => `/images/${name}.jpg`;

const bestSellers = getProductsBySlugs(bestSellerSlugs);
const newArrivals = getProductsBySlugs(newArrivalSlugs);

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

const featured = [
  {
    title: "Wall Art",
    blurb: "Elegant designs to transform your walls.",
    image: image("art_leaves"),
  },
  {
    title: "Planters",
    blurb: "Greenery for a fresher space.",
    image: image("hanging_planters"),
  },
  {
    title: "Lamps",
    blurb: "Light up your home with style.",
    image: image("lamp"),
  },
  {
    title: "Gym Wall Art",
    blurb: "For a stronger, bolder you.",
    image: image("art_gym"),
  },
];

const rooms = [
  { label: "Living Room", image: image("room_living") },
  { label: "Bedroom", image: image("room_bedroom") },
  { label: "Office", image: image("room_office") },
  { label: "Entryway", image: image("room_entry") },
];

export default async function Home() {
  let heroSlides: HeroSlide[] = [];
  try {
    heroSlides = await fetchHomepageBanners(); 
  } catch (error) {
    console.error("Failed to load homepage banners on the server.", error);
  }

  return (
    <main>
      <HeroBanner slides={heroSlides} />
      <CategoryCircles categories={categories} />
      <CategoryTiles />
      <TrustBadges />
      <FeaturedCollection categories={featured} />
      <BestSellers products={bestSellers} />
      <MidBanner />
      <ShopByRoom rooms={rooms} />
      <NewArrivals products={newArrivals} />
      <RecentlyViewed products={bestSellers} />
      <Newsletter />
      <TrustedBy />
    </main>
  );
}
