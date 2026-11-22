import { ProductCard1 } from "../ProductCard1";
import SectionHeading from "./homePageUtilis/SectionHeading";
import type { ProductCardData } from "@/data/products";

type BestSellersProps = {
  products: ProductCardData[];
};

function BestSellers({products}: BestSellersProps) {
  if (!products.length) return null;

  return (
    <section className="page-width content-section" id="best-sellers">
      <SectionHeading title="Best Sellers" href="#new-arrivals" />
      <div className="product-grid best-seller-grid">
        {products.map((product) => <ProductCard1 key={product.slug} product={product} />)}
      </div>
    </section>
  );
}

export default BestSellers;