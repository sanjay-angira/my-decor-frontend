const image = (name: string) => `/images/${name}.jpg`;

export interface Category {
    title: string;
    blurb: string;
    image: string;
}

export const categories: Category[] = [
    {
        title: "Wall Art",
        blurb: "Elegant designs to transform your walls.",
        image: image("art_leaves")
    },
    {
        title: "Planters",
        blurb: "Greenery for a fresher space.",
        image: image("hanging_planters")
    },
    {
        title: "Lamps",
        blurb: "Light up your home with style.",
        image: image("lamp")
    },
    {
        title: "Gym Wall Art",
        blurb: "For a stronger, bolder you.",
        image: image("art_gym")
    },
]