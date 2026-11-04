import CollectionTile from "./homePageUtilis/CollectionTile";

const image = (name: string) => `/images/${name}.jpg`;
const CategoryTiles = () => {
  return (
    <section className="page-width category-tiles" aria-label="Collections">
      <div className="tile-row tile-row-two">
        <CollectionTile title="Modern Wall Art" blurb="Statement pieces for modern homes." cta="Shop Wall Art" src={image("art_leaves")} alt="Black monstera leaf metal wall art above a sideboard" large />
        <CollectionTile title="Car Wall Art" blurb="For true automobile enthusiasts." cta="Explore Collection" src={image("art_car")} alt="Black metal sedan wall art above a grey sofa" large />
      </div>
      <div className="tile-row tile-row-three">
        <CollectionTile title="Spiritual Wall Art" blurb="Bring positivity and peace home." cta="Shop Now" src={image("art_buddha")} alt="Black metal Buddha wall art with mandala halo" />
        <CollectionTile title="Planters" blurb="Stylish planters for indoor & outdoor spaces." cta="Shop Planters" src={image("planters")} alt="Matte black planters with lush green plants" />
        <CollectionTile title="Lamps" blurb="Modern lighting for a beautiful ambience." cta="View Collection" src={image("lamp")} alt="Black arched table lamp glowing warmly" />
      </div>
    </section>
  );
}

export default CategoryTiles; 