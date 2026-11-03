
import Image from "next/image";

type CategoryCirclesProps = {
  categories: {
    label: string;
    image: string;
  }[];
}; 

const CategoryCircles = ({ categories }: CategoryCirclesProps) => {
  return (
    <section className="page-width category-circles" id="categories" aria-label="Shop by category">
      {categories.map((category) => (
        <a className="category-circle" href="#featured" key={category.label}>
          <span className="circle-image"><Image src={category.image} alt="" fill sizes="96px" /></span>
          <span>{category.label}</span>
        </a>
      ))}
    </section>
  );
}

export default CategoryCircles;