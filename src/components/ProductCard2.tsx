import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { formatPrice, type ProductCardData } from "@/data/products";

type ProductCard2Props = {
  product: ProductCardData;
};

export function ProductCard2({ product }: ProductCard2Props) {
  const cover = product.gallery[0];

  return (
    <article className="product-card product-card--arrival">
      <div className="product-image">
        <Link
          className="product-image-trigger"
          href={`/product/${product.slug}`}
          aria-label={`View ${product.name}`}
        >
          {cover?.src ? (
            <Image
              src={cover.src}
              alt={cover.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, 20vw"
              unoptimized
            />
          ) : (
            <span className="product-image-placeholder">Image unavailable</span>
          )}
        </Link>
      </div>
      <div className="product-info">
        <h3>
          <Link className="product-name-button" href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <div className="product-card--arrival-meta">
          <p className="product-price">
            <strong>{formatPrice(product.price)}</strong>
            {product.mrp > product.price && <del>{formatPrice(product.mrp)}</del>}
          </p>
          <span className="rating">
            <Icon name="star" />
            {product.rating ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}
