import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/data/products";

type RecentlyViewedProps = {
  products: Product[];
};

export function RecentlyViewed({ products }: RecentlyViewedProps) {
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
          <ProductCard key={product.slug} product={product} showRating />
        ))}
      </div>
    </section>
  );
}
