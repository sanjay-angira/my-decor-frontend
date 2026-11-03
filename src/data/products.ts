const image = (name: string) => `/images/${name}.jpg`;

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface ProductSize {
  label: string;
  dimensions: string;
  price: number;
  mrp: number;
}


export interface ProductReview {
  name: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  badge?: string;
  description: string;
  highlights: string[];
  gallery: GalleryImage[];
  sizes: ProductSize[];
  specs: { label: string; value: string }[];
  reviews: ProductReview[];
}

const mountingSpec = { label: "Mounting", value: "Ready-to-hang with pre-drilled holes and included hardware" };
const originSpec = { label: "Country of Origin", value: "India — handcrafted by skilled artisans" };
const warrantySpec = { label: "Warranty", value: "6 months against manufacturing defects" };

export const products: Product[] = [
  {
    id: 1,
    slug: "tree-of-life-metal-wall-art",
    name: "Tree of Life Metal Wall Art",
    category: "Wall Art",
    price: 2499,
    mrp: 4999,
    rating: 4.8,
    reviewCount: 412,
    badge: "Best Seller",
    description:
      "A handcrafted Tree of Life silhouette in laser-cut steel, finished in a rich matte black. Its intricate branches and leaves catch light beautifully through the day, making it a striking centrepiece for living rooms, entryways and offices alike.",
    highlights: [
      "Laser-cut from a single sheet of wrought iron — no seams or weld lines",
      "Weather-resistant powder coating for indoor and covered outdoor use",
      "Comes ready to hang with pre-drilled holes and mounting hardware",
      "Lightweight design that sits flush against the wall",
    ],
    gallery: [
      { src: image("art_tree"), alt: "Tree of Life metal wall art in matte black" },
      { src: image("hero_living_room"), alt: "Tree of Life wall art styled above a cream sofa" },
      { src: image("room_living"), alt: "Living room styled with India Decor wall art" },
      { src: image("art_leaves"), alt: "Monstera leaf metal wall art in matte black" },
    ],
    sizes: [
      { label: "Small", dimensions: '18" × 18"', price: 1899, mrp: 3799 },
      { label: "Medium", dimensions: '24" × 24"', price: 2499, mrp: 4999 },
      { label: "Large", dimensions: '36" × 36"', price: 4499, mrp: 7499 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated wrought iron" },
      { label: "Finish", value: "Matte black, anti-rust coating" },
      { label: "Weight", value: "1.8 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Wipe with a dry cloth; avoid direct water spray" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Ananya Iyer",
        rating: 5,
        date: "12 Sep 2026",
        title: "Absolutely stunning in my living room",
        body: "The detailing on the branches is finer than I expected. Installed it above our sofa and every guest asks where it's from. Packaging was excellent too.",
        verified: true,
      },
      {
        name: "Vikram Nair",
        rating: 5,
        date: "28 Aug 2026",
        title: "Premium quality, worth the price",
        body: "Solid metal, clean powder coating and the finish looks far more expensive than what I paid. Took 15 minutes to mount with the included hardware.",
        verified: true,
      },
      {
        name: "Priya Deshmukh",
        rating: 4,
        date: "3 Aug 2026",
        title: "Beautiful, but measure your wall",
        body: "Lovely piece and very well made. I ordered the medium size and wish I'd gone larger — do measure your wall space before ordering.",
        verified: true,
      },
    ],
  },
  {
    id: 2,
    slug: "offroad-suv-metal-wall-art",
    name: "Off-Road SUV Metal Wall Art",
    category: "Wall Art",
    price: 5499,
    mrp: 7499,
    rating: 4.6,
    reviewCount: 186,
    description:
      "A bold off-road SUV rendered in layered laser-cut steel — perfect for the automobile enthusiast. Layered depth gives the silhouette a real 3D presence on the wall, especially in studios, offices and garages.",
    highlights: [
      "Layered steel panels create genuine depth and shadow",
      "Matte black finish with subtle metallic highlights",
      "Ready to hang — no assembly required",
      "A conversation piece for offices, studios and garages",
    ],
    gallery: [
      { src: image("art_jeep"), alt: "Off-road SUV metal wall art in layered black steel" },
      { src: image("room_office"), alt: "SUV wall art styled in a modern home office" },
      { src: image("banner_dining"), alt: "Mountain metal wall art above a dining table" },
      { src: image("art_car"), alt: "Classic sedan metal wall art in matte black" },
    ],
    sizes: [
      { label: "Medium", dimensions: '30" × 18"', price: 5499, mrp: 7499 },
      { label: "Large", dimensions: '42" × 26"', price: 7999, mrp: 10999 },
    ],
    specs: [
      { label: "Material", value: "Layered laser-cut mild steel" },
      { label: "Finish", value: "Matte black with metallic accents" },
      { label: "Weight", value: "3.2 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Dust with a soft dry cloth" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Arjun Mehta",
        rating: 5,
        date: "20 Sep 2026",
        title: "Perfect gift for a car lover",
        body: "Gave this to my brother for his new office and he hasn't stopped talking about it. The layered build genuinely looks 3D in person.",
        verified: true,
      },
      {
        name: "Sneha Kulkarni",
        rating: 4,
        date: "8 Sep 2026",
        title: "Heavy and sturdy",
        body: "Great craftsmanship. It's heavier than I expected so make sure your wall anchors are solid, otherwise flawless.",
        verified: true,
      },
      {
        name: "Rahul Verma",
        rating: 5,
        date: "14 Jul 2026",
        title: "Statement piece for my studio",
        body: "Clients notice it immediately. The finish is even and the edges are clean, no sharp burrs anywhere.",
        verified: true,
      },
    ],
  },
  {
    id: 3,
    slug: "ganesha-metal-wall-art",
    name: "Ganesha Metal Wall Art",
    category: "Spiritual Wall Art",
    price: 2999,
    mrp: 4499,
    rating: 4.9,
    reviewCount: 528,
    badge: "Best Seller",
    description:
      "Lord Ganesha in flowing laser-cut lines, framed by a delicate mandala halo. A serene, positive presence for your pooja room, entryway or living space — crafted with devotion in matte black steel.",
    highlights: [
      "Intricate mandala halo cut from a single steel sheet",
      "Auspicious centrepiece for entryways and pooja rooms",
      "Anti-rust matte black powder coating",
      "Ready to hang with included hardware",
    ],
    gallery: [
      { src: image("art_ganesha"), alt: "Ganesha metal wall art with mandala halo" },
      { src: image("room_entry"), alt: "Ganesha wall art styled in an entryway" },
      { src: image("banner_dining"), alt: "Mountain metal wall art above a dining table" },
      { src: image("art_buddha"), alt: "Buddha metal wall art in matte black" },
    ],
    sizes: [
      { label: "Small", dimensions: '18" × 24"', price: 2299, mrp: 3499 },
      { label: "Medium", dimensions: '24" × 32"', price: 2999, mrp: 4499 },
      { label: "Large", dimensions: '36" × 48"', price: 5499, mrp: 8499 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated wrought iron" },
      { label: "Finish", value: "Matte black, anti-rust coating" },
      { label: "Weight", value: "2.1 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Wipe with a dry cloth; avoid direct water spray" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Kavitha Reddy",
        rating: 5,
        date: "1 Oct 2026",
        title: "Divine and beautifully made",
        body: "Placed it in our entryway and it completely transforms the space. The mandala detailing is exquisite up close.",
        verified: true,
      },
      {
        name: "Deepak Joshi",
        rating: 5,
        date: "17 Sep 2026",
        title: "Gifted it for Griha Pravesh",
        body: "Bought this for a housewarming and it was the most appreciated gift of the day. Packaging was secure and premium.",
        verified: true,
      },
      {
        name: "Meera Pillai",
        rating: 5,
        date: "30 Aug 2026",
        title: "Exceeds expectations",
        body: "Photos don't do it justice. The metal is thick, the finish is flawless and it hangs perfectly flush to the wall.",
        verified: true,
      },
    ],
  },
  {
    id: 4,
    slug: "metal-planter-with-stand",
    name: "Metal Planter with Stand",
    category: "Planters",
    price: 2099,
    mrp: 3499,
    rating: 4.7,
    reviewCount: 294,
    description:
      "A matte black metal planter on a slim tripod stand, designed to give your greens a stage. Sized for medium indoor plants, it works equally well beside a sofa, in a bedroom corner or flanking an entryway.",
    highlights: [
      "Rust-resistant coated metal with a removable inner pot",
      "Slim tripod stand fits neatly into corners",
      "Drainage hole and drip tray included",
      "Fits nursery pots up to 8 inches",
    ],
    gallery: [
      { src: image("planters"), alt: "Matte black metal planters with lush green plants" },
      { src: image("room_living"), alt: "Planter styled in a modern living room" },
      { src: image("hanging_planters"), alt: "Hanging metal planters on a balcony" },
      { src: image("room_bedroom"), alt: "Bedroom corner styled with a metal planter" },
    ],
    sizes: [
      { label: "Single", dimensions: '10" × 10" × 22"', price: 2099, mrp: 3499 },
      { label: "Set of 2", dimensions: '10" × 10" × 22" (each)', price: 3799, mrp: 6499 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated metal stand with metal planter" },
      { label: "Finish", value: "Matte black" },
      { label: "Weight", value: "1.6 kg (Single)" },
      { label: "Assembly", value: "Stand ships flat; assembles in under 5 minutes, tools included" },
      { label: "Drainage", value: "Drainage hole with matching drip tray" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Nandini Bose",
        rating: 5,
        date: "25 Sep 2026",
        title: "My monstera finally looks styled",
        body: "Sturdy stand, clean welds and the drip tray is a thoughtful touch. My monstera has never looked better.",
        verified: true,
      },
      {
        name: "Suresh Kumar",
        rating: 4,
        date: "11 Sep 2026",
        title: "Good value, easy assembly",
        body: "Assembled in five minutes and feels solid. Would love a slightly taller option for floor plants.",
        verified: true,
      },
      {
        name: "Ritu Malhotra",
        rating: 5,
        date: "2 Sep 2026",
        title: "Bought two more",
        body: "Ordered one, loved it, ordered two more the same week. They make the corner of our living room look designed.",
        verified: true,
      },
    ],
  },
  {
    id: 5,
    slug: "world-map-metal-wall-art",
    name: "World Map Metal Wall Art",
    category: "Wall Art",
    price: 3499,
    mrp: 6499,
    rating: 4.8,
    reviewCount: 341,
    description:
      "A detailed world map in laser-cut steel, with continents and islands faithfully outlined. A wanderlust statement for home offices, study rooms and living spaces — and a natural fit behind a desk.",
    highlights: [
      "Accurate continent outlines including islands and archipelagos",
      "Panels align edge-to-edge for a seamless look",
      "Anti-rust matte black finish",
      "Ships in protective foam with a mounting template",
    ],
    gallery: [
      { src: image("art_worldmap"), alt: "World map metal wall art in matte black" },
      { src: image("room_office"), alt: "World map wall art behind a home office desk" },
      { src: image("hero_living_room"), alt: "Living room styled with India Decor wall art" },
      { src: image("room_living"), alt: "Living room styled with metal wall art" },
    ],
    sizes: [
      { label: "Medium", dimensions: '48" × 28"', price: 3499, mrp: 6499 },
      { label: "Large", dimensions: '60" × 35"', price: 5499, mrp: 9499 },
    ],
    specs: [
      { label: "Material", value: "Laser-cut mild steel panels" },
      { label: "Finish", value: "Matte black, anti-rust coating" },
      { label: "Weight", value: "2.8 kg (Medium)" },
      mountingSpec,
      { label: "Includes", value: "Paper mounting template for perfect panel alignment" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Aditya Rane",
        rating: 5,
        date: "29 Sep 2026",
        title: "Anchors my home office",
        body: "The mounting template made alignment genuinely easy. Continents are accurate — even New Zealand is there.",
        verified: true,
      },
      {
        name: "Tanvi Shah",
        rating: 5,
        date: "9 Sep 2026",
        title: "Better than the online photos",
        body: "Crisp edges and a really nice matte texture. Everyone who visits asks about it.",
        verified: true,
      },
      {
        name: "Gaurav Chauhan",
        rating: 4,
        date: "22 Aug 2026",
        title: "Great piece, plan your wall",
        body: "It's wide — measure twice. Once up, it looks fantastic and the panels line up seamlessly.",
        verified: true,
      },
    ],
  },
  {
    id: 6,
    slug: "buddha-metal-wall-art",
    name: "Buddha Metal Wall Art",
    category: "Spiritual Wall Art",
    price: 2499,
    mrp: 3999,
    rating: 4.9,
    reviewCount: 387,
    description:
      "A serene Buddha silhouette in flowing steel lines, bringing calm and positivity to any room. The gentle curves of the laser-cut design catch soft light beautifully — ideal for bedrooms, meditation corners and living rooms.",
    highlights: [
      "Peaceful silhouette cut from one continuous steel sheet",
      "Soft matte black finish that suits any palette",
      "Ready to hang with included hardware",
      "Pairs beautifully with plants and warm lighting",
    ],
    gallery: [
      { src: image("art_buddha"), alt: "Buddha metal wall art with mandala halo" },
      { src: image("room_bedroom"), alt: "Buddha wall art styled in a bedroom" },
      { src: image("banner_dining"), alt: "Mountain metal wall art above a dining table" },
      { src: image("art_ganesha"), alt: "Ganesha metal wall art with mandala halo" },
    ],
    sizes: [
      { label: "Small", dimensions: '18" × 24"', price: 1999, mrp: 3199 },
      { label: "Medium", dimensions: '24" × 32"', price: 2499, mrp: 3999 },
      { label: "Large", dimensions: '36" × 48"', price: 4799, mrp: 7499 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated wrought iron" },
      { label: "Finish", value: "Matte black, anti-rust coating" },
      { label: "Weight", value: "2.0 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Wipe with a dry cloth; avoid direct water spray" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Lakshmi Rao",
        rating: 5,
        date: "5 Oct 2026",
        title: "Brings so much calm",
        body: "It's in our meditation corner now and honestly sets the mood every morning. The lines are graceful and smooth.",
        verified: true,
      },
      {
        name: "Harpreet Singh",
        rating: 5,
        date: "18 Sep 2026",
        title: "Excellent craftsmanship",
        body: "No rough edges, perfect powder coating, and it sits flat against the wall. Very happy.",
        verified: true,
      },
      {
        name: "Divya Krishnan",
        rating: 5,
        date: "4 Sep 2026",
        title: "Gifted twice already",
        body: "Bought one for us, then two more as gifts. It's become my default housewarming present.",
        verified: true,
      },
    ],
  },
  {
    id: 7,
    slug: "hanging-planter-set-of-3",
    name: "Hanging Planter Set of 3",
    category: "Planters",
    price: 1499,
    mrp: 2499,
    rating: 4.5,
    reviewCount: 219,
    badge: "New",
    description:
      "Three matte black hanging planters with metal hooks, ready to bring greenery to balconies, windows and stairwells. Sized for small and medium trailing plants, they look best grouped in a staggered line.",
    highlights: [
      "Set of three in graduated sizes for a styled look",
      "Sturdy hooks and chains included",
      "Rust-resistant coating for balcony and outdoor use",
      "Drainage holes to keep roots healthy",
    ],
    gallery: [
      { src: image("hanging_planters"), alt: "Hanging metal planters on a balcony" },
      { src: image("room_bedroom"), alt: "Hanging planters styled near a window" },
      { src: image("planters"), alt: "Matte black metal planters with green plants" },
      { src: image("room_entry"), alt: "Entryway styled with India Decor planters" },
    ],
    sizes: [
      { label: "Set of 3", dimensions: '6", 8", 10" diameter', price: 1499, mrp: 2499 },
      { label: "Set of 5", dimensions: '6", 8", 10", 12", 14" diameter', price: 2299, mrp: 3999 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated metal with steel chains" },
      { label: "Finish", value: "Matte black, weather resistant" },
      { label: "Weight", value: "1.2 kg (Set of 3)" },
      { label: "Includes", value: "3 planters, chains and ceiling hooks" },
      { label: "Drainage", value: "Pre-drilled drainage holes" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Akash Dwivedi",
        rating: 5,
        date: "27 Sep 2026",
        title: "Balcony upgrade done",
        body: "Money plant trails look gorgeous in these. Coating has survived two months of monsoon so far.",
        verified: true,
      },
      {
        name: "Shreya Ghosh",
        rating: 4,
        date: "12 Sep 2026",
        title: "Nice set, hooks need strong drilling",
        body: "Planters are great quality. Make sure your ceiling anchors are rated — they get heavy once potted.",
        verified: true,
      },
      {
        name: "Manoj Patil",
        rating: 5,
        date: "1 Sep 2026",
        title: "Staggered heights look designed",
        body: "The graduated sizes are the best part — hanging them in a line instantly looks styled.",
        verified: true,
      },
    ],
  },
  {
    id: 8,
    slug: "cruiser-bike-metal-wall-art",
    name: "Cruiser Bike Metal Wall Art",
    category: "Wall Art",
    price: 3999,
    mrp: 5999,
    rating: 4.6,
    reviewCount: 158,
    badge: "New",
    description:
      "A classic cruiser bike silhouette in layered laser-cut steel — spokes, fenders and tank rendered in fine metal lines. A tribute to timeless machines, made for living rooms, cafes and workshops.",
    highlights: [
      "Fine spoke and fender detailing in layered steel",
      "Striking against both light and dark walls",
      "Ready to hang with included hardware",
      "Great gift for bikers and café-racer fans",
    ],
    gallery: [
      { src: image("art_bike"), alt: "Cruiser bike metal wall art in matte black steel" },
      { src: image("room_office"), alt: "Bike wall art styled in a modern room" },
      { src: image("art_car"), alt: "Classic sedan metal wall art in matte black" },
      { src: image("banner_dining"), alt: "Mountain metal wall art above a dining table" },
    ],
    sizes: [
      { label: "Medium", dimensions: '28" × 18"', price: 3999, mrp: 5999 },
      { label: "Large", dimensions: '40" × 26"', price: 5999, mrp: 8999 },
    ],
    specs: [
      { label: "Material", value: "Layered laser-cut mild steel" },
      { label: "Finish", value: "Matte black" },
      { label: "Weight", value: "2.4 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Dust with a soft dry cloth" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Karthik Subramanian",
        rating: 5,
        date: "30 Sep 2026",
        title: "The spokes are unreal",
        body: "How they cut spokes this fine out of steel is beyond me. It's now the highlight of my living room.",
        verified: true,
      },
      {
        name: "Pooja Nayak",
        rating: 4,
        date: "15 Sep 2026",
        title: "Gift for my husband",
        body: "He loves it. Only note — it needs two people to hang comfortably because of the size.",
        verified: true,
      },
      {
        name: "Nikhil Bhatia",
        rating: 5,
        date: "6 Sep 2026",
        title: "Cafe corner sorted",
        body: "Put this up in my cafe and customers photograph it constantly. Quality is excellent.",
        verified: true,
      },
    ],
  },
  {
    id: 9,
    slug: "monstera-leaf-metal-wall-art",
    name: "Monstera Leaf Metal Wall Art",
    category: "Wall Art",
    price: 2999,
    mrp: 4999,
    rating: 4.8,
    reviewCount: 176,
    badge: "New",
    description:
      "A dramatic monstera leaf in matte black steel, its fenestrations cut with precision. Botanical, bold and endlessly versatile — style it solo or group it with smaller pieces for a gallery wall.",
    highlights: [
      "Precise fenestration cuts with smooth, safe edges",
      "Bold botanical statement for any room",
      "Anti-rust matte black powder coating",
      "Ready to hang with included hardware",
    ],
    gallery: [
      { src: image("art_leaves"), alt: "Monstera leaf metal wall art in matte black" },
      { src: image("room_living"), alt: "Monstera wall art above a sideboard" },
      { src: image("art_tree"), alt: "Tree of Life metal wall art in matte black" },
      { src: image("hero_living_room"), alt: "Living room styled with India Decor wall art" },
    ],
    sizes: [
      { label: "Small", dimensions: '18" × 18"', price: 2299, mrp: 3799 },
      { label: "Medium", dimensions: '26" × 26"', price: 2999, mrp: 4999 },
      { label: "Large", dimensions: '36" × 36"', price: 4799, mrp: 7999 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated wrought iron" },
      { label: "Finish", value: "Matte black, anti-rust coating" },
      { label: "Weight", value: "1.9 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Wipe with a dry cloth; avoid direct water spray" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Sandeep Gurung",
        rating: 5,
        date: "2 Oct 2026",
        title: "Perfect above my sideboard",
        body: "The cut-outs are so clean it looks like a stencil artist drew it on the wall. Love it.",
        verified: true,
      },
      {
        name: "Farhan Sheikh",
        rating: 5,
        date: "19 Sep 2026",
        title: "Great with real plants nearby",
        body: "Hung it next to our actual monstera and the pairing is perfect. Finish is premium.",
        verified: true,
      },
      {
        name: "Meera Pillai",
        rating: 4,
        date: "7 Sep 2026",
        title: "Lovely, slightly larger than expected",
        body: "Beautiful piece. Double-check the medium size — it has real presence on the wall.",
        verified: true,
      },
    ],
  },
  {
    id: 10,
    slug: "classic-sedan-metal-wall-art",
    name: "Classic Sedan Metal Wall Art",
    category: "Wall Art",
    price: 4599,
    mrp: 6999,
    rating: 4.7,
    reviewCount: 132,
    description:
      "A classic sedan silhouette rendered in layered matte black steel, with grille and body lines cut in fine detail. Timeless automotive art for offices, lounges and garages.",
    highlights: [
      "Layered steel with genuine 3D depth",
      "Detailed grille and body-line cuts",
      "Ready to hang with included hardware",
      "Suits offices, lounges and garage walls",
    ],
    gallery: [
      { src: image("art_car"), alt: "Classic sedan metal wall art in matte black" },
      { src: image("room_living"), alt: "Sedan wall art styled above a grey sofa" },
      { src: image("art_jeep"), alt: "Off-road SUV metal wall art in black steel" },
      { src: image("room_office"), alt: "Metal wall art styled in a home office" },
    ],
    sizes: [
      { label: "Medium", dimensions: '30" × 16"', price: 4599, mrp: 6999 },
      { label: "Large", dimensions: '42" × 22"', price: 6499, mrp: 9999 },
    ],
    specs: [
      { label: "Material", value: "Layered laser-cut mild steel" },
      { label: "Finish", value: "Matte black" },
      { label: "Weight", value: "2.7 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Dust with a soft dry cloth" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Rahul Verma",
        rating: 5,
        date: "24 Sep 2026",
        title: "Vintage vibe, modern build",
        body: "The body lines are beautifully done. Looks like a piece from a boutique studio, not mass produced.",
        verified: true,
      },
      {
        name: "Ananya Iyer",
        rating: 4,
        date: "10 Sep 2026",
        title: "Solid and striking",
        body: "Very well packed and finished. Took a bit of patience to align, but the result is worth it.",
        verified: true,
      },
      {
        name: "Deepak Joshi",
        rating: 5,
        date: "28 Aug 2026",
        title: "Office lounge favourite",
        body: "Everyone assumes we imported it. Made in India and proud of it.",
        verified: true,
      },
    ],
  },
  {
    id: 11,
    slug: "gym-motivation-metal-wall-art",
    name: "Gym Motivation Metal Wall Art",
    category: "Wall Art",
    price: 2799,
    mrp: 4499,
    rating: 4.5,
    reviewCount: 121,
    description:
      "A bold motivational silhouette in laser-cut steel — the kind of piece that makes you want to pick up the weights. Built for home gyms, studios and workout corners.",
    highlights: [
      "High-contrast silhouette that motivates at a glance",
      "Durable finish that handles humid gym spaces",
      "Ready to hang with included hardware",
      "Great for home gyms and fitness studios",
    ],
    gallery: [
      { src: image("art_gym"), alt: "Gym motivation metal wall art in matte black" },
      { src: image("room_office"), alt: "Gym wall art styled in a workout corner" },
      { src: image("art_tree"), alt: "Tree of Life metal wall art in matte black" },
      { src: image("hero_living_room"), alt: "Living room styled with India Decor wall art" },
    ],
    sizes: [
      { label: "Medium", dimensions: '24" × 18"', price: 2799, mrp: 4499 },
      { label: "Large", dimensions: '36" × 26"', price: 4299, mrp: 6999 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated wrought iron" },
      { label: "Finish", value: "Matte black, humidity resistant" },
      { label: "Weight", value: "1.7 kg (Medium)" },
      mountingSpec,
      { label: "Care", value: "Wipe with a dry cloth" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Gaurav Chauhan",
        rating: 5,
        date: "26 Sep 2026",
        title: "Home gym feels real now",
        body: "Exactly the energy I wanted above my rack. Sturdy metal and clean cuts.",
        verified: true,
      },
      {
        name: "Ritu Malhotra",
        rating: 4,
        date: "13 Sep 2026",
        title: "Motivational indeed",
        body: "Good quality and looks sharp. Wish there were more designs to pick from in this range.",
        verified: true,
      },
      {
        name: "Akash Dwivedi",
        rating: 5,
        date: "3 Sep 2026",
        title: "Survives the humidity",
        body: "Two months in a basement gym and zero rust. Coating quality is legit.",
        verified: true,
      },
    ],
  },
  {
    id: 12,
    slug: "arched-table-lamp",
    name: "Arched Table Lamp",
    category: "Lamps",
    price: 3299,
    mrp: 4999,
    rating: 4.7,
    reviewCount: 264,
    description:
      "A sculptural arched table lamp in matte black metal with a warm amber glow. Its tall arc reaches over sideboards and bedside tables, adding ambient light and a designer silhouette to any corner.",
    highlights: [
      "Tall arched silhouette with a weighted stable base",
      "Warm ambient glow with an inline dimmer switch",
      "Standard E27 holder — use any bulb up to 40W",
      "1.8 m braided cord with inline switch",
    ],
    gallery: [
      { src: image("lamp"), alt: "Black arched table lamp glowing warmly" },
      { src: image("room_bedroom"), alt: "Arched lamp styled on a bedside table" },
      { src: image("room_living"), alt: "Lamp styled in a modern living room" },
      { src: image("hero_living_room"), alt: "Living room styled with India Decor lighting" },
    ],
    sizes: [
      { label: "Standard", dimensions: '14" × 9" × 26"', price: 3299, mrp: 4999 },
      { label: "Tall", dimensions: '14" × 9" × 34"', price: 3999, mrp: 5999 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated metal with fabric-wrapped cord" },
      { label: "Bulb", value: "E27 holder, max 40W (bulb not included)" },
      { label: "Weight", value: "2.2 kg" },
      { label: "Switch", value: "Inline dimmer on a 1.8 m braided cord" },
      { label: "Voltage", value: "220–240V, Indian plug" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Tanvi Shah",
        rating: 5,
        date: "4 Oct 2026",
        title: "Looks like a designer piece",
        body: "The arc is elegant and the warm glow completely changes our bedroom at night. Worth every rupee.",
        verified: true,
      },
      {
        name: "Karthik Subramanian",
        rating: 5,
        date: "16 Sep 2026",
        title: "Beautiful, sturdy base",
        body: "Base is properly weighted — no wobble at all. The inline dimmer is genuinely useful.",
        verified: true,
      },
      {
        name: "Nandini Bose",
        rating: 4,
        date: "6 Sep 2026",
        title: "Gorgeous, buy a warm bulb",
        body: "Lamp is beautiful. It doesn't come with a bulb, so pick up a warm-white E27 to get the glow in the photos.",
        verified: true,
      },
    ],
  },
  {
    id: 13,
    slug: "desk-organizer-tray",
    name: "Desk Organizer Tray",
    category: "Desk Organizers",
    price: 1299,
    mrp: 1999,
    rating: 4.4,
    reviewCount: 98,
    description:
      "A matte black metal desk organizer with dedicated slots for pens, phones, notes and keys. Clean lines and a soft-lined base keep your desk tidy and your workspace looking considered.",
    highlights: [
      "Five compartments sized for everyday desk essentials",
      "Felt-lined base protects your desk surface",
      "Powder-coated steel that won't chip or bend",
      "Compact footprint fits any desk corner",
    ],
    gallery: [
      { src: image("desk_organizer"), alt: "Matte black desk organizer holding stationery" },
      { src: image("room_office"), alt: "Desk organizer styled on a home office desk" },
      { src: image("lamp"), alt: "Arched table lamp glowing warmly" },
      { src: image("room_living"), alt: "Modern living room styled by India Decor" },
    ],
    sizes: [
      { label: "Standard", dimensions: '9" × 5" × 4"', price: 1299, mrp: 1999 },
      { label: "Large", dimensions: '12" × 6" × 4"', price: 1699, mrp: 2699 },
    ],
    specs: [
      { label: "Material", value: "Powder-coated steel with felt-lined base" },
      { label: "Compartments", value: "5 (pens, phone, notes, keys, misc)" },
      { label: "Weight", value: "0.7 kg" },
      warrantySpec,
      originSpec,
    ],
    reviews: [
      {
        name: "Pooja Nayak",
        rating: 5,
        date: "21 Sep 2026",
        title: "Tidy desk at last",
        body: "Everything has a slot now — pens, phone, even my AirPods case. The felt base is a nice touch.",
        verified: true,
      },
      {
        name: "Suresh Kumar",
        rating: 4,
        date: "8 Sep 2026",
        title: "Solid, compact",
        body: "Well built and looks premium on my desk. The standard size is a bit small if you carry a lot of stationery.",
        verified: true,
      },
      {
        name: "Divya Krishnan",
        rating: 4,
        date: "29 Aug 2026",
        title: "Good gifting option",
        body: "Bought two for the office team. Everyone liked them — a useful, good-looking gift.",
        verified: true,
      },
    ],
  },
];

export const productBySlug = new Map(products.map((product) => [product.slug, product]));

export function getProductBySlug(slug: string | undefined): Product | undefined {
  return slug ? productBySlug.get(slug) : undefined;
}

export const bestSellerSlugs = [
  "tree-of-life-metal-wall-art",
  "offroad-suv-metal-wall-art",
  "ganesha-metal-wall-art",
  "metal-planter-with-stand",
  "world-map-metal-wall-art",
];

export const newArrivalSlugs = [
  "buddha-metal-wall-art",
  "hanging-planter-set-of-3",
  "cruiser-bike-metal-wall-art",
  "monstera-leaf-metal-wall-art",
  "classic-sedan-metal-wall-art",
  "gym-motivation-metal-wall-art",
];

/** Pieces that tidy a room: desk organisers, plant stands and hanging planters. */
export const storageSlugs = [
  "desk-organizer-tray",
  "metal-planter-with-stand",
  "hanging-planter-set-of-3",
];

export const getProductsBySlugs = (slugs: string[]) =>
  slugs.map((slug) => productBySlug.get(slug)).filter((product): product is Product => Boolean(product));

export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter((p) => p.id !== product.id && p.category === product.category);
  const others = products.filter((p) => p.id !== product.id && p.category !== product.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function discountPercent(price: number, mrp: number): number {
  return Math.round((1 - price / mrp) * 100);
}

/** Deterministic rating distribution derived from the product's average rating. */
export function ratingBreakdown(product: Product): { stars: number; percent: number }[] {
  const fiveStar = Math.min(88, Math.max(52, Math.round(60 + (product.rating - 4) * 55)));
  const rest = 100 - fiveStar;
  const fourStar = Math.round(rest * 0.72);
  const threeStar = Math.round(rest * 0.16);
  const twoStar = Math.round(rest * 0.08);
  const oneStar = rest - fourStar - threeStar - twoStar;
  return [
    { stars: 5, percent: fiveStar },
    { stars: 4, percent: fourStar },
    { stars: 3, percent: threeStar },
    { stars: 2, percent: twoStar },
    { stars: 1, percent: oneStar },
  ];
}

export const formatPrice = (value: number) => `₹${value.toLocaleString("en-IN")}`;
