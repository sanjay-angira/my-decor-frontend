import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { RecentlyViewedTracker } from "@/components/product/RecentlyViewedTracker";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug, products, type Product } from "@/data/products";
import { fetchProductBySlug } from "@/services/catalogService";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function number(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function mapStoreProduct(value: unknown): Product | null {
  if (!isRecord(value)) return null;

  const slug = text(value.productSlug);
  const name = text(value.productName);
  if (!slug || !name) return null;

  const variants = Array.isArray(value.variants)
    ? value.variants.filter(isRecord)
    : [];
  const specs = new Map<string, string>();
  const sizes = variants.map((variant, index) => {
    const pricing = isRecord(variant.pricing) ? variant.pricing : {};
    const attributes = Array.isArray(variant.variantAttributes)
      ? variant.variantAttributes.filter(isRecord)
      : [];
    const sizeAttribute = attributes.find((attribute) => {
      const definition = isRecord(attribute.attribute) ? attribute.attribute : {};
      return text(definition.name).toLowerCase() === "size";
    });
    const dimensions =
      text(sizeAttribute?.value) || text(variant.name) || `Option ${index + 1}`;

    for (const attribute of attributes) {
      const definition = isRecord(attribute.attribute) ? attribute.attribute : {};
      const label = text(definition.name);
      const attributeValue = text(attribute.value);
      if (label && attributeValue) specs.set(label, attributeValue);
    }

    const mrp = number(variant.price);
    const price = number(pricing.finalPrice ?? variant.price);
    return {
      label: dimensions,
      dimensions,
      price,
      mrp: Math.max(mrp, price),
    };
  });

  const gallery = variants.flatMap((variant) => {
    const images = Array.isArray(variant.images)
      ? variant.images.filter(isRecord)
      : [];
    return images.flatMap((image) => {
      const src =
        text(image.webp800) ||
        text(image.webp1200) ||
        text(image.originalUrl) ||
        text(image.webp400);
      return src ? [{ src, alt: text(image.altText) || name }] : [];
    });
  });

  const reviews = Array.isArray(value.reviews)
    ? value.reviews.filter(isRecord)
    : [];
  const rating =
    reviews.length > 0
      ? Math.round(
          (reviews.reduce((sum, review) => sum + number(review.rating), 0) /
            reviews.length) *
            10,
        ) / 10
      : 0;
  const category = isRecord(value.category)
    ? text(value.category.categoryName)
    : text(value.category);
  const description =
    text(value.shortDescription) ||
    text(value.description).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ") ||
    "Product details coming soon.";

  return {
    id: number(value.id),
    slug,
    name,
    category,
    price: sizes[0]?.price ?? 0,
    mrp: sizes[0]?.mrp ?? 0,
    rating,
    reviewCount: reviews.length,
    badge: value.bestSeller
      ? "Best Seller"
      : value.newArrival
        ? "New Arrival"
        : undefined,
    description,
    highlights: [],
    gallery,
    sizes,
    specs: [...specs].map(([label, specValue]) => ({ label, value: specValue })),
    reviews: reviews.map((review) => {
      const createdAt = text(review.createdAt);
      const parsedDate = createdAt ? new Date(createdAt) : null;
      return {
        name: text(review.userName) || "Customer",
        rating: number(review.rating),
        date:
          parsedDate && !Number.isNaN(parsedDate.getTime())
            ? parsedDate.toLocaleDateString("en-IN")
            : "Recently",
        title: "Customer review",
        body: text(review.comment),
        verified: Boolean(review.verified),
      };
    }),
  };
}

const loadProduct = cache(async (slug: string): Promise<Product | null> => {
  const staticProduct = getProductBySlug(slug);
  if (staticProduct) return staticProduct;

  const response: unknown = await fetchProductBySlug(slug);
  if (!isRecord(response)) {
    throw new Error("Product response was invalid.");
  }
  if (response.success !== true) {
    if (response.statusCode === 404) return null;
    throw new Error(text(response.message) || "Product request failed.");
  }

  return mapStoreProduct(response.data);
});

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) {
    return { title: "Product unavailable – India Decor", robots: { index: false } };
  }

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157).trimEnd()}…`
      : product.description;

  return {
    title: `${product.name} – Buy Online at India Decor`,
    description,
    openGraph: {
      title: `${product.name} | India Decor`,
      description,
      type: "website",
      images: product.gallery[0] ? [{ url: product.gallery[0].src }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | India Decor`,
      description,
    },
  };
}

function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: `ID-${String(product.id).padStart(4, "0")}`,
    brand: { "@type": "Brand", name: "India Decor" },
    category: product.category,
    image: product.gallery.map((image) => image.src),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    review: product.reviews.map((review) => ({
      "@type": "Review",
      author: { "@type": "Person", name: review.name },
      reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
      name: review.title,
      reviewBody: review.body,
    })),
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  return (
    <main className="flex-1 pb-14">
      <RecentlyViewedTracker productId={product.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }}
      />
      <ProductBreadcrumb category={product.category} name={product.name} />
      <div className="container-page grid gap-10 pt-6 lg:grid-cols-2 lg:gap-14">
        <ProductGallery product={product} />
        <ProductPurchasePanel product={product} />
      </div>
      <div className="container-page">
        <ProductDetails product={product} />
      </div>
      <RelatedProducts product={product} />
    </main>
  );
}
