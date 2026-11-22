"use client";

import { useEffect, useState } from "react";
import { ProductCard1 } from "@/components/ProductCard1";
import type { ProductCardData } from "@/data/products";
import { fetchRecentlyViewedProducts } from "@/services/recentlyViewedService";

export function RecentlyViewed() {
  const [products, setProducts] = useState<ProductCardData[] | null>(null);

  useEffect(() => {
    let active = true;

    fetchRecentlyViewedProducts()
      .then((recentProducts) => {
        if (active) setProducts(recentProducts);
      })
      .catch((error: unknown) => {
        if (active) {
          console.error("Failed to load recently viewed products.", error);
          setProducts([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!products?.length) return null;

  return (
    <section className="page-width content-section" id="recently-viewed" aria-labelledby="recently-viewed-heading">
      <div className="section-heading">
        <h2 id="recently-viewed-heading">Recently Viewed</h2>
        <a className="view-all" href="#new-arrivals">
          View All
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>

      <div className="product-grid best-seller-grid">
        {products.map((product) => (
          <ProductCard1 key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
