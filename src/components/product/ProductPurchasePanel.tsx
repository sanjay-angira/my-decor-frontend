"use client";

import { useState } from "react";
import { Icon, type IconName } from "@/components/Icon";
import { discountPercent, formatPrice, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { Stars } from "./Stars";

const assurances: { icon: IconName; label: string }[] = [
  { icon: "truck", label: "Free delivery in 3–5 business days" },
  { icon: "rotate", label: "7-day easy returns & exchanges" },
  { icon: "shield", label: "100% secure payments" },
  { icon: "check", label: "Cash on delivery available" },
];

export function ProductPurchasePanel({ product }: { product: Product }) {
  const defaultSize = Math.max(0, product.sizes.findIndex((size) => size.price === product.price));
  const [sizeIndex, setSizeIndex] = useState(defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  const size = product.sizes[sizeIndex] ?? product.sizes[0];
  if (!size) return null;

  const discount = discountPercent(size.price, size.mrp);
  const savings = size.mrp - size.price;

  const flash = (message: string, description?: string) => {
    setNotice(description ? `${message} — ${description}` : message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">{product.category}</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm">
        <Stars value={product.rating} />
        <span className="font-semibold text-foreground">{product.rating}</span>
        <span className="text-muted-foreground">({product.reviewCount} verified reviews)</span>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight text-foreground">
          {formatPrice(size.price)}
        </span>
        <span className="text-lg text-muted-foreground line-through">{formatPrice(size.mrp)}</span>
        {discount > 0 && (
          <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-bold text-accent-foreground">
            {discount}% off
          </span>
        )}
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Inclusive of all taxes
        {savings > 0 && <span className="font-semibold text-brand"> · You save {formatPrice(savings)}</span>}
      </p>

      <div className="mt-7">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">Size</h2>
          <span className="text-xs text-muted-foreground">{size.dimensions}</span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2.5" aria-label="Choose a size">
          {product.sizes.map((option, index) => (
            <li key={option.label}>
              <button
                type="button"
                onClick={() => setSizeIndex(index)}
                aria-pressed={index === sizeIndex}
                className={cn(
                  "rounded-lg border-2 px-4 py-2.5 text-left transition-colors",
                  index === sizeIndex
                    ? "border-brand bg-brand-soft"
                    : "border-border bg-card hover:border-foreground/30",
                )}
              >
                <span className="block text-sm font-bold text-foreground">{option.label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{option.dimensions}</span>
                <span className="mt-1 block text-sm font-extrabold text-foreground">{formatPrice(option.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Icon name="minus" className="h-4 w-4" />
          </button>
          <span aria-live="polite" className="w-8 text-center text-sm font-bold text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(10, value + 1))}
            aria-label="Increase quantity"
            className="grid h-9 w-9 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setSaved((value) => !value)}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full border transition-colors",
            saved
              ? "border-destructive bg-destructive/10 text-destructive"
              : "border-border text-foreground/60 hover:border-destructive hover:text-destructive",
          )}
        >
          <Icon name="heart" className={cn("h-5 w-5", saved && "fill-current")} />
        </button>
      </div>

      <div className="pdp-cta-row">
        <button
          type="button"
          className="pdp-btn-cart"
          onClick={() => flash(`${product.name} · ${size.label} × ${quantity} added to cart`, "Free delivery on orders over ₹999.")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 10a4 4 0 0 1-8 0" />
            <path d="M3.103 6.034h17.794" />
            <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />
          </svg>
          Add to Cart
        </button>
        <button
          type="button"
          className="pdp-btn-buy"
          onClick={() => flash(`${product.name} · ${size.label} added to cart`, "Secure checkout opens soon.")}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
          </svg>
          Buy Now
        </button>
      </div>

      {notice && (
        <p className="mt-3 rounded-lg bg-brand-soft px-3.5 py-2.5 text-sm font-semibold text-foreground" role="status">
          {notice}
        </p>
      )}

      <ul className="mt-7 grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-2">
        {assurances.map(({ icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-xs font-medium text-foreground/80">
            <Icon name={icon} className="h-4 w-4 shrink-0 text-brand" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
