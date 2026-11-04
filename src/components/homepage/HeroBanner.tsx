
"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
import { Icon } from "@/components/Icon";

const heroSlides = [
  {
    id: 1,
    eyebrow: "The India Decor",
    title: "Art for",
    accent: "Every Space",
    description: "Premium metal wall art, planters, lamps and décor pieces to make your home and workspace truly yours.",
    buttonLink: "/collections/all",
    buttonText: "Shop Now",
    desktopImage: "/images/hero_living_room.jpg",
     mobileImage: "/images/banner_dining_mobile.jpg",
    bannerSize: "half",
    alt: "Black metal mountain wall art above a cream sofa in a modern living room",
  },
  {
    id: 2,
    eyebrow: "Handcrafted in India",
    title: "Turn Walls",
    accent: "Into Stories",
    description: "Laser-cut steel sculptures that bring personality, calm and character to every room you love.",
    buttonLink: "/collections/all",
    buttonText: "Explore Collection",
    desktopImage: "/images/banner_dining.jpg",
    mobileImage: "/images/banner_dining_mobile.jpg",
    bannerSize: "half",
    alt: "Black metal mountain wall art above a wooden dining table",
  },
  {
    id: 3,
    eyebrow: "Handcrafted in India",
    title: "Turn Walls",
    accent: "Into Stories",
    description: "Laser-cut steel sculptures that bring personality, calm and character to every room you love.",
    buttonLink: "/collections/all",
    buttonText: "Explore Collection",
    desktopImage: "/images/herobanner1.png",
    mobileImage: "/images/herobanner1_mobile.png",
    bannerSize: "full",
    alt: "Black metal mountain wall art above a wooden dining table",
  },
];

const HeroBanner = () => {
  const sliderRef = useRef<Slider | null>(null);

  const settings: Settings = {
    accessibility: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 7000,
    dots: true,
    infinite: true,
    pauseOnHover: true,
    pauseOnFocus: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    customPaging: (index) => (
      <button type="button" aria-label={`Go to slide ${index + 1}`} />
    ),
  };

  return (
    <section className="page-width hero-section" aria-label="Featured collections">
      <div className="hero">
        <Slider ref={sliderRef} {...settings}>
          {heroSlides.map((slide, index) => (
            <article
              className={`hero-slide${slide.bannerSize === "full" ? " hero-slide-full" : ""}`}
              key={slide.id}
            >
              {slide.bannerSize === "full" ? (
                <Link
                  className="hero-full-link"
                  href={slide.buttonLink}
                  aria-label={slide.buttonText}
                >
                  <Image
                    src={slide.desktopImage}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 760px) 100vw, 80rem"
                  />
                </Link>
              ) : (
                <>
                  <div className="hero-copy">
                    <p className="eyebrow">{slide.eyebrow}</p>
                    <h1>
                      {slide.title}
                      <br />
                      <span>{slide.accent}</span>
                    </h1>
                    <p className="hero-description">{slide.description}</p>
                    <Link href={slide.buttonLink} className="button button-dark">
                      {slide.buttonText}
                      <Icon name="arrow" />
                    </Link>
                  </div>
                  <div className="hero-image">
                    <Image
                      src={slide.desktopImage}
                      alt={slide.alt}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 760px) 100vw, 58vw"
                    />
                  </div>
                </>
              )}
            </article>
          ))}
        </Slider>
        <button
          className="carousel-control previous"
          type="button"
          aria-label="Previous slide"
          onClick={() => sliderRef.current?.slickPrev()}
        >
          <Icon name="chevronLeft" />
        </button>
        <button
          className="carousel-control next"
          type="button"
          aria-label="Next slide"
          onClick={() => sliderRef.current?.slickNext()}
        >
          <Icon name="chevronRight" />
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;