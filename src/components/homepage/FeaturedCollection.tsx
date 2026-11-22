import SectionHeading from "./homePageUtilis/SectionHeading";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import Link from "next/link";
import type { HomepageFeaturedCategory } from "@/services/homepageService";


type FeaturedCollectionProps = {
  categories: HomepageFeaturedCategory[];
}; 

const FeaturedCollection = ({ categories }: FeaturedCollectionProps) => {
  return (
    <section className="page-width content-section">
      <SectionHeading title="Featured Collection" href="#best-sellers" id="featured" />
      <div className="featured-grid">
        {categories.map((item) => {
          if (!item.image || !item.slug) return null;

          return (
            <Link
              className="featured-card"
              href={`/category/${encodeURIComponent(item.slug)}`}
              key={item.id}
            >
              <span className="featured-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 50vw, 25vw" /></span>
              <span className="featured-caption"><span><strong>{item.title}</strong><small>{item.blurb}</small></span><i><Icon name="arrow" /></i></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedCollection;