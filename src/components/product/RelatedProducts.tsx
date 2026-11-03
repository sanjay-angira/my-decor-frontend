import { relatedProducts, type Product } from "@/data/products";
import { RelatedProductCard } from "./RelatedProductCard";

export function RelatedProducts({ product }: { product: Product }) {
  const related = relatedProducts(product, 4);
  if (related.length === 0) return null;

  return (
    <section className="container-page pt-14" aria-label="You may also like">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        You may also like
      </h2>
      <ul className="mt-6 grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
        {related.map((item) => (
          <RelatedProductCard key={item.id} product={item} />
        ))}
      </ul>
    </section>
  );
}
