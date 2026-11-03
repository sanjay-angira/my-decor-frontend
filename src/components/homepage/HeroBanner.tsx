
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icon";

const image = (name: string) => `/images/${name}.jpg`;
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

const HeroBanner = () => {
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
export default HeroBanner;