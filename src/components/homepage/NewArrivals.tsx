
import { ProductCard } from "@/components/ProductCard";
import type { ProductCardData } from "@/data/products";
import SectionHeading from "./homePageUtilis/SectionHeading";
type NewArrivalsProps = {
  products: ProductCardData[];
};

const NewArrivals = ({ products }: NewArrivalsProps) => {
  if (!products.length) return null;

  return (
    <section className="page-width content-section" id="new-arrivals">
      <SectionHeading title="New Arrivals" href="#footer" />
      <div className="product-grid arrivals-grid">
        {products.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </section>
  );
}

export default NewArrivals;