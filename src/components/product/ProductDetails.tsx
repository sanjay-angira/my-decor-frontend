"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { ratingBreakdown, type Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { Stars } from "./Stars";

function Description({ product }: { product: Product }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">About this piece</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
      </div>
      <div>
        <h3 className="font-display text-lg font-bold text-foreground">Why you&apos;ll love it</h3>
        <ul className="mt-3 space-y-2.5">
          {product.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2.5 text-sm leading-relaxed text-foreground/85">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Specifications({ product }: { product: Product }) {
  return (
    <dl className="overflow-hidden rounded-lg border border-border">
      {product.specs.map((spec, index) => (
        <div
          key={spec.label}
          className={cn(
            "grid gap-1 px-4 py-3.5 sm:grid-cols-[14rem_1fr] sm:gap-4",
            index % 2 === 0 ? "bg-card" : "bg-secondary/60",
          )}
        >
          <dt className="text-sm font-semibold text-foreground">{spec.label}</dt>
          <dd className="text-sm text-muted-foreground">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Reviews({ product }: { product: Product }) {
  const breakdown = ratingBreakdown(product);
  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <div className="rounded-lg border border-border bg-card p-5 lg:sticky lg:top-28 lg:self-start">
        <div className="flex items-end gap-3">
          <span className="font-display text-5xl font-extrabold tracking-tight text-foreground">
            {product.rating}
          </span>
          <span className="pb-1.5">
            <Stars value={product.rating} />
            <span className="mt-1 block text-xs text-muted-foreground">{product.reviewCount} reviews</span>
          </span>
        </div>
        <ul className="mt-5 space-y-2">
          {breakdown.map(({ stars, percent }) => (
            <li key={stars} className="flex items-center gap-2.5 text-xs">
              <span className="w-8 shrink-0 font-semibold text-foreground">{stars} ★</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                <span className="block h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
              </span>
              <span className="w-9 shrink-0 text-right text-muted-foreground">{percent}%</span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="space-y-4">
        {product.reviews.map((review) => (
          <li key={`${review.name}-${review.date}`} className="rounded-lg border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-bold text-accent-foreground">
                  {review.name.charAt(0)}
                </span>
                <span>
                  <span className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                    {review.name}
                    {review.verified && (
                      <span className="flex items-center gap-1 text-[0.65rem] font-semibold text-brand">
                        <Icon name="check" className="h-3.5 w-3.5" /> Verified
                      </span>
                    )}
                  </span>
                  <span className="block text-xs text-muted-foreground">{review.date}</span>
                </span>
              </div>
              <Stars value={review.rating} size="h-3.5 w-3.5" />
            </div>
            <h4 className="mt-3.5 flex items-start gap-2 font-display text-base font-bold text-foreground">
              <Icon name="quote" className="mt-1 h-4 w-4 shrink-0 text-brand/50" />
              {review.title}
            </h4>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{review.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProductDetails({ product }: { product: Product }) {
  const [tab, setTab] = useState<"description" | "specs" | "reviews">("description");

  return (
    <div className="mt-14">
      <div className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b border-border bg-transparent p-0" role="tablist" aria-label="Product information">
        {(
          [
            ["description", "Description"],
            ["specs", "Specifications"],
            ["reviews", `Reviews (${product.reviewCount})`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={tab === value}
            onClick={() => setTab(value)}
            className={cn(
              "rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-bold transition-colors",
              tab === value ? "border-brand bg-transparent text-brand" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pt-7" role="tabpanel">
        {tab === "description" && <Description product={product} />}
        {tab === "specs" && <Specifications product={product} />}
        {tab === "reviews" && <Reviews product={product} />}
      </div>
    </div>
  );
}
