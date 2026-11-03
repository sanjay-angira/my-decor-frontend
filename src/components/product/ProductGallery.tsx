"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { discountPercent, type Product } from "@/data/products";
import { cn } from "@/lib/utils";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const images = product.gallery;
  const current = images[active] ?? images[0];
  if (!current) return null;
  const discount = discountPercent(product.price, product.mrp);

  const go = (next: number) => setActive((next + images.length) % images.length);

  return (
    <div className="lg:sticky lg:top-28">
      <div className="group relative overflow-hidden rounded-lg border border-border bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current.src} alt={current.alt} className="aspect-square w-full object-cover" />

        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand-foreground shadow-sm">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold text-brand shadow-sm backdrop-blur">
            {discount}% off
          </span>
        )}

        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-card focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
        >
          <Icon name="chevronLeft" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next image"
          className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-card/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity hover:bg-card focus-visible:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
        >
          <Icon name="chevronRight" className="h-5 w-5" />
        </button>
      </div>

      <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1" aria-label="Product images">
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`} className="shrink-0">
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-current={index === active ? "true" : undefined}
              className={cn(
                "block h-20 w-20 overflow-hidden rounded-lg border-2 bg-sand transition-colors sm:h-24 sm:w-24",
                index === active ? "border-brand" : "border-transparent hover:border-border",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.src} alt="" loading="lazy" className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
