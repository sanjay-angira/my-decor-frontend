"use client";

import Link from "next/link";
import { Icon } from "@/components/Icon";
import { discountPercent, formatPrice, type Product } from "@/data/products";

export function RelatedProductCard({ product }: { product: Product }) {
  const discount = discountPercent(product.price, product.mrp);
  const cover = product.gallery[0];
  if (!cover) return null;

  return (
    <li className="group flex flex-col rounded-lg bg-card p-3 shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/product/${product.slug}`} className="relative block overflow-hidden rounded-lg bg-sand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover.src}
          alt={cover.alt}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wide text-brand-foreground shadow-sm">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-card/90 px-2 py-1 text-[0.6rem] font-bold text-brand shadow-sm backdrop-blur">
            {discount}% off
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-3">
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors hover:text-brand"
        >
          {product.name}
        </Link>

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="text-base font-extrabold text-foreground">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground line-through">{formatPrice(product.mrp)}</span>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1 text-xs font-semibold text-foreground">
            <Icon name="star" className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {product.rating}
            <span className="font-normal text-muted-foreground">({product.reviewCount})</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-brand"
            >
              <Icon name="bag" className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to wishlist`}
              className="grid h-9 w-9 place-items-center rounded-full border border-border text-foreground/60 transition-colors hover:border-destructive hover:text-destructive"
            >
              <Icon name="heart" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}
