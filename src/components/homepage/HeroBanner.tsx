"use client";
import { useRef } from "react";
import Link from "next/link";
import Slider, { type Settings } from "react-slick";
import { Icon } from "@/components/Icon";

export type HeroSlide = {
  id: number;
  source: string;
  title: string;
  slug: string;
  desktopImage: string;
  tabletImage: string;
  mobileImage: string;
  href?: string | null;
};

const HeroBanner = ({
  slides,
  ariaLabel = "Featured collections",
}: {
  slides: HeroSlide[];
  ariaLabel?: string;
}) => {
  console.log("Rendering HeroBanner with slides:", slides);
  const sliderRef = useRef<Slider | null>(null);

  const settings: Settings = {
    accessibility: true,
    arrows: false,
    autoplay: slides.length > 1,
    autoplaySpeed: 7000,
    dots: slides.length > 1,
    infinite: slides.length > 1,
    pauseOnHover: true,
    pauseOnFocus: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    customPaging: (index) => (
      <button type="button" aria-label={`Go to slide ${index + 1}`} />
    ),
  };

  if (!slides.length) return null;

  return (
    <section className="page-width hero-section" aria-label={ariaLabel}>
      <div className="hero">
        <Slider ref={sliderRef} {...settings}>
          {slides.map((slide, index) => {
            const fallbackHref = slide.slug.trim()
              ? slide.source === "category"
                ? `/products?category=${encodeURIComponent(slide.slug)}`
                : `/products?offer=${encodeURIComponent(slide.slug)}`
              : null;
            const href = slide.href === null ? null : slide.href || fallbackHref;
            const image = (
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
                  alt={slide.title || "Featured collection"}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </picture>
            );

            return (
              <article className="hero-slide hero-slide-full" key={slide.id}>
                {href ? (
                  <Link className="hero-full-link" href={href}>
                    {image}
                  </Link>
                ) : (
                  image
                )}
              </article>
            );
          })}
        </Slider>
        {slides.length > 1 && (
          <>
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
          </>
        )}
      </div>
    </section>
  );
};

export default HeroBanner;
