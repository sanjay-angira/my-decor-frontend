import Image from "next/image";
import Link from "next/link";
import { fetchStoreCategories } from "@/services/homepageService";

export const metadata = {
  title: "Shop All Categories | India Decor",
  description:
    "Browse all India Decor categories, from wall art and planters to lighting and home décor.",
};

export default async function CategoriesPage() {
  const categories = await fetchStoreCategories();

  return (
    <main className="page-width category-directory">
      <nav className="category-directory-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true">›</span>
        <span aria-current="page">Categories</span>
      </nav>

      <header className="category-directory-heading">
        <p className="products-eyebrow">FIND YOUR STYLE</p>
        <h1>Shop All Categories</h1>
        <p>Explore every collection and find the perfect piece for your space.</p>
      </header>

      {categories.length > 0 ? (
        <div className="category-directory-grid">
          {categories.map((category, index) => (
            <Link
              className="category-directory-card"
              href={
                category.slug
                  ? `/category/${encodeURIComponent(category.slug)}`
                  : "/products"
              }
              key={category.id}
            >
              <span className="category-directory-image">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
                    unoptimized
                  />
                ) : (
                  <span className="category-directory-placeholder" aria-hidden="true">
                    {category.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </span>
              <span className="category-directory-card-content">
                <span>
                  <strong>{category.name}</strong>
                  <small>
                    {category.productCount}{" "}
                    {category.productCount === 1 ? "product" : "products"}
                  </small>
                </span>
                <span className="category-directory-cta">Explore</span>
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="category-directory-empty">No categories are available right now.</p>
      )}
    </main>
  );
}
