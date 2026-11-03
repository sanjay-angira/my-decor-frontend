import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { getProductBySlug, products, type Product } from "@/data/products";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="flex-1 pb-14">
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
