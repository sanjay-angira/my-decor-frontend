"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { formatPrice, type ProductCardData } from "@/data/products";

type ProductCardProps = {
  product: ProductCardData;
  showRating?: boolean;
};

export function ProductCard({ product, showRating = false }: ProductCardProps) {
  const cover = product.gallery[0];

  return (
    <article className={`product-card${showRating ? "" : " product-card--arrival"}`}>
      <div className="product-image">
        <Link className="product-image-trigger" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
          {cover?.src ? (
            <Image src={cover.src} alt={cover.alt || product.name} fill sizes="(max-width: 640px) 50vw, 20vw" unoptimized />
          ) : (
            <span className="product-image-placeholder">Image unavailable</span>
          )}
        </Link>
        {showRating && (
          <button className="wishlist-button" type="button" aria-label={`Add ${product.name} to wishlist`}>
            <Icon name="heart" />
          </button>
        )}
      </div>
      <div className="product-info">
        <h3>
          <Link className="product-name-button" href={`/product/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <p className="product-price">
          <strong>{formatPrice(product.price)}</strong>
          {product.mrp > product.price && <del>{formatPrice(product.mrp)}</del>}
        </p>
        {showRating && (
          <div className="product-bottom">
            <span className="rating">
              <Icon name="star" />
              {product.rating}
            </span>
            <button className="add-to-cart" type="button" aria-label={`Add ${product.name} to cart`}>
              <Icon name="bag" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
