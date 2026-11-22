import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@/data/products";
import SectionHeading from "./homePageUtilis/SectionHeading";

type FeaturedProductsProps = {
  products: ProductCardData[];
};

const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  if (!products.length) return null;

  return (
    <section className="page-width content-section" id="featured-products">
      <SectionHeading title="Featured Products" href="/products?featured=true" />
      <div className="product-grid arrivals-grid">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
