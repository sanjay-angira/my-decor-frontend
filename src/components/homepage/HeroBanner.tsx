
"use client";
import { useRef } from "react";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
import { Icon } from "@/components/Icon";

const heroSlides = [
  {
    id: 1,
    buttonLink: "/collections/all",
    buttonText: "Shop Now",
    desktopImage: "/images/herobanner1.png",
    tabletImage: "/images/tabletbanner1.png",
    mobileImage: "/images/mobilebanner1.png",
    alt: "Black metal mountain wall art above a cream sofa in a modern living room",
  },
  {
    id: 2,
    buttonLink: "/collections/all",
    buttonText: "Explore Collection",
    desktopImage: "/images/herobanner2.png",
    tabletImage: "/images/tabletbanner2.png",
    mobileImage: "/images/mobilebanner2.png",
    alt: "Black metal mountain wall art above a wooden dining table",
  },
  {
    id: 3,
    buttonLink: "/collections/all",
    buttonText: "Explore Collection",
    desktopImage: "/images/herobanner3.png",
    tabletImage: "/images/tabletbanner3.png",
    mobileImage: "/images/mobilebanner3.png",   
    alt: "Black metal mountain wall art above a wooden dining table",
  },
  {
    id: 4,
    buttonLink: "/collections/all",
    buttonText: "Explore Collection",
    desktopImage: "/images/herobanner4.png",
    tabletImage: "/images/tabletbanner4.png",
    mobileImage: "/images/mobilebanner4.png",
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
            <article className="hero-slide hero-slide-full" key={slide.id}>
              <Link
                className="hero-full-link"
                href={slide.buttonLink}
                aria-label={slide.buttonText}
              >
                <picture>
                  <source
                    media="(max-width: 767px)"
                    srcSet={slide.mobileImage || slide.desktopImage}
                  />
                  <source
                    media="(max-width: 1199px)"
                    srcSet={slide.tabletImage || slide.desktopImage}
                  />
                  <img
                    src={slide.desktopImage}
                    alt={slide.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </picture>
              </Link>
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