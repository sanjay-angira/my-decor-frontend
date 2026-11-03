"use client";

import Image from "next/image";
import { useEffect, useState, type FormEvent } from "react";
import { Icon } from "@/components/Icon";
import { ProductCard } from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { bestSellerSlugs, getProductsBySlugs, newArrivalSlugs } from "@/data/products";

const image = (name: string) => `/images/${name}.jpg`;

const bestSellers = getProductsBySlugs(bestSellerSlugs);
const newArrivals = getProductsBySlugs(newArrivalSlugs);

const heroSlides = [
  {
    eyebrow: "The India Decor",
    title: "Art for",
    accent: "Every Space",
    description: "Premium metal wall art, planters, lamps and décor pieces to make your home and workspace truly yours.",
    cta: "Shop Now",
    image: image("hero_living_room"),
    alt: "Black metal mountain wall art above a cream sofa in a modern living room",
  },
  {
    eyebrow: "Handcrafted in India",
    title: "Turn Walls",
    accent: "Into Stories",
    description: "Laser-cut steel sculptures that bring personality, calm and character to every room you love.",
    cta: "Explore Collection",
    image: image("banner_dining"),
    alt: "Black metal mountain wall art above a wooden dining table",
  },
];

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
  { title: "Wall Art", blurb: "Elegant designs to transform your walls.", image: image("art_leaves") },
  { title: "Planters", blurb: "Greenery for a fresher space.", image: image("hanging_planters") },
  { title: "Lamps", blurb: "Light up your home with style.", image: image("lamp") },
  { title: "Gym Wall Art", blurb: "For a stronger, bolder you.", image: image("art_gym") },
];

const rooms = [
  { label: "Living Room", image: image("room_living") },
  { label: "Bedroom", image: image("room_bedroom") },
  { label: "Office", image: image("room_office") },
  { label: "Entryway", image: image("room_entry") },
];

function SectionHeading({ title, href = "#featured", id }: { title: string; href?: string; id?: string }) {
  return (
    <div className="section-heading">
      <h2 id={id}>{title}</h2>
      <a className="view-all" href={href}>View All <Icon name="arrow" /></a>
    </div>
  );
}

function Hero() {
  const [active, setActive] = useState(0);
  const slide = heroSlides[active];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((current) => (current + 1) % heroSlides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="page-width hero-section" aria-label="Featured collections">
      <div className="hero">
        <div className="hero-copy" key={slide.title}>
          <p className="eyebrow">{slide.eyebrow}</p>
          <h1>{slide.title}<br /><span>{slide.accent}</span></h1>
          <p className="hero-description">{slide.description}</p>
          <a href="#featured" className="button button-dark">{slide.cta}<Icon name="arrow" /></a>
        </div>
        <div className="hero-image">
          <Image src={slide.image} alt={slide.alt} fill priority sizes="(max-width: 760px) 100vw, 58vw" />
        </div>
        <button className="carousel-control previous" type="button" aria-label="Previous slide" onClick={() => setActive((active - 1 + heroSlides.length) % heroSlides.length)}><Icon name="chevronLeft" /></button>
        <button className="carousel-control next" type="button" aria-label="Next slide" onClick={() => setActive((active + 1) % heroSlides.length)}><Icon name="chevronRight" /></button>
        <div className="carousel-dots" aria-label="Choose slide">
          {heroSlides.map((item, index) => <button key={item.title} type="button" aria-label={`Go to slide ${index + 1}`} aria-current={index === active} className={index === active ? "active" : ""} onClick={() => setActive(index)} />)}
        </div>
      </div>
    </section>
  );
}

function CategoryCircles() {
  return (
    <section className="page-width category-circles" id="categories" aria-label="Shop by category">
      {categories.map((category) => (
        <a className="category-circle" href="#featured" key={category.label}>
          <span className="circle-image"><Image src={category.image} alt="" fill sizes="96px" /></span>
          <span>{category.label}</span>
        </a>
      ))}
    </section>
  );
}

function CollectionTile({ title, blurb, cta, src, alt, large = false }: { title: string; blurb: string; cta: string; src: string; alt: string; large?: boolean }) {
  return (
    <a className={`collection-tile${large ? " collection-tile-large" : ""}`} href="#featured">
      <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" />
      <span className="tile-shade" />
      <span className="tile-copy">
        <strong>{title}</strong><span>{blurb}</span><b>{cta}<Icon name="arrow" /></b>
      </span>
    </a>
  );
}

function CategoryTiles() {
  return (
    <section className="page-width category-tiles" aria-label="Collections">
      <div className="tile-row tile-row-two">
        <CollectionTile title="Modern Wall Art" blurb="Statement pieces for modern homes." cta="Shop Wall Art" src={image("art_leaves")} alt="Black monstera leaf metal wall art above a sideboard" large />
        <CollectionTile title="Car Wall Art" blurb="For true automobile enthusiasts." cta="Explore Collection" src={image("art_car")} alt="Black metal sedan wall art above a grey sofa" large />
      </div>
      <div className="tile-row tile-row-three">
        <CollectionTile title="Spiritual Wall Art" blurb="Bring positivity and peace home." cta="Shop Now" src={image("art_buddha")} alt="Black metal Buddha wall art with mandala halo" />
        <CollectionTile title="Planters" blurb="Stylish planters for indoor & outdoor spaces." cta="Shop Planters" src={image("planters")} alt="Matte black planters with lush green plants" />
        <CollectionTile title="Lamps" blurb="Modern lighting for a beautiful ambience." cta="View Collection" src={image("lamp")} alt="Black arched table lamp glowing warmly" />
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = [
    { icon: "truck" as const, title: "Easy Returns", blurb: "Hassle-free exchanges" },
    { icon: "shield" as const, title: "Secure Checkout", blurb: "100% safe payments" },
    { icon: "check" as const, title: "Premium Quality", blurb: "Crafted with care" },
    { icon: "pin" as const, title: "Made in India", blurb: "Supporting local artisans" },
  ];

  return (
    <section className="page-width trust-badges" aria-label="Why shop with us">
      {badges.map(({ icon, title, blurb }) => <div className="trust-badge" key={title}><span className="badge-icon"><Icon name={icon} /></span><span><strong>{title}</strong><small>{blurb}</small></span></div>)}
    </section>
  );
}

function FeaturedCollection() {
  return (
    <section className="page-width content-section">
      <SectionHeading title="Featured Collection" href="#best-sellers" id="featured" />
      <div className="featured-grid">
        {featured.map((item) => (
          <a className="featured-card" href="#best-sellers" key={item.title}>
            <span className="featured-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 50vw, 25vw" /></span>
            <span className="featured-caption"><span><strong>{item.title}</strong><small>{item.blurb}</small></span><i><Icon name="arrow" /></i></span>
          </a>
        ))}
      </div>
    </section>
  );
}

function BestSellers() {
  return (
    <section className="page-width content-section" id="best-sellers">
      <SectionHeading title="Best Sellers" href="#new-arrivals" />
      <div className="product-grid best-seller-grid">
        {bestSellers.map((product) => <ProductCard key={product.slug} product={product} showRating />)}
      </div>
    </section>
  );
}

function MidBanner() {
  return (
    <section className="page-width content-section">
      <a className="mid-banner" href="#shop-by-room">
        <Image src={image("banner_dining")} alt="Black metal mountain wall art above a dining table" fill sizes="100vw" />
        <span className="banner-shade" />
        <span className="banner-copy"><strong>Turn Walls Into Stories</strong><span>Discover unique metal wall art that reflects your personality.</span><b className="button button-dark">Explore Now<Icon name="arrow" /></b></span>
      </a>
    </section>
  );
}

function ShopByRoom() {
  return (
    <section className="page-width content-section" id="shop-by-room">
      <SectionHeading title="Shop by Room" href="#new-arrivals" />
      <div className="room-grid">
        {rooms.map((room) => <a className="room-card" href="#featured" key={room.label}><Image src={room.image} alt={`${room.label} décor`} fill sizes="(max-width: 640px) 50vw, 25vw" /><span className="room-shade" /><strong>{room.label}</strong><i><Icon name="arrow" /></i></a>)}
      </div>
    </section>
  );
}

function NewArrivals() {
  return (
    <section className="page-width content-section" id="new-arrivals">
      <SectionHeading title="New Arrivals" href="#footer" />
      <div className="product-grid arrivals-grid">
        {newArrivals.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </section>
  );
}

function Newsletter() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => event.preventDefault();

  return (
    <section className="page-width content-section">
      <div className="newsletter">
        <div><h2>Get décor ideas, new arrivals &amp; exclusive offers.</h2><p>Join 50,000+ happy customers. No spam, ever.</p></div>
        <form onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" placeholder="Enter your email address" required />
          <button className="button button-dark" type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

function TrustedBy() {
  return (
    <section className="page-width trusted-by">
      <p>As Seen On / Trusted By 50,000+ Happy Customers</p>
      <div>{["Amazon", "Flipkart", "Pepperfry", "Croma", "Meesho", "AJIO", "Myntra"].map((name) => <span key={name}>{name}</span>)}</div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <CategoryCircles />
        <CategoryTiles />
        <TrustBadges />
        <FeaturedCollection />
        <BestSellers />
        <MidBanner />
        <ShopByRoom />
        <NewArrivals />
        <RecentlyViewed products={bestSellers} />
        <Newsletter />
        <TrustedBy />
      </main>
      <SiteFooter />
    </>
  );
}
