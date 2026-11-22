import CollectionTile from "./homePageUtilis/CollectionTile";
import type { StoreCategoryDirectoryItem } from "@/services/homepageService";

type CategoryTilesProps = {
  categories: StoreCategoryDirectoryItem[];
};

const CategoryTiles = ({ categories }: CategoryTilesProps) => {
  if (!categories.length) return null;

  const renderTile = (category: StoreCategoryDirectoryItem, large = false) => (
    <CollectionTile
      key={category.id}
      title={category.name}
      blurb={
        category.description ||
        `Explore our ${category.name.toLowerCase()} collection.`
      }
      cta={`Shop ${category.name}`}
      src={category.image3x2 || category.image || category.desktopBanner || ""}
      alt={`${category.name} category`}
      href={
        category.slug
          ? `/category/${encodeURIComponent(category.slug)}`
          : "/products"
      }
      large={large}
    />
  );

  const featuredCategories = categories.slice(0, 2);
  const remainingCategories = categories.slice(2);

  return (
    <section className="page-width category-tiles" aria-label="Collections">
      {featuredCategories.length > 0 && (
        <div className="tile-row tile-row-two">
          {featuredCategories.map((category) => renderTile(category, true))}
        </div>
      )}
      {remainingCategories.length > 0 && (
        <div className="tile-row tile-row-three">
          {remainingCategories.map((category) => renderTile(category))}
        </div>
      )}
    </section>
  );
};

export default CategoryTiles; 