import SectionHeading from "./homePageUtilis/SectionHeading";
import Image from "next/image";
import { Icon } from "@/components/Icon";


type FeaturedCollectionProps = {
  categories: {
    title: string; 
    blurb: string;
    image: string;
  }[];
}; 

const FeaturedCollection = ({ categories }: FeaturedCollectionProps) => {
  return (
    <section className="page-width content-section">
      <SectionHeading title="Featured Collection" href="#best-sellers" id="featured" />
      <div className="featured-grid">
        {categories.map((item) => (
          <a className="featured-card" href="#best-sellers" key={item.title}>
            <span className="featured-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 700px) 50vw, 25vw" /></span>
            <span className="featured-caption"><span><strong>{item.title}</strong><small>{item.blurb}</small></span><i><Icon name="arrow" /></i></span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCollection;