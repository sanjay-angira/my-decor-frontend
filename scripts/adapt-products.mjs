import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dirname, "..");
const srcPath = path.resolve(root, "../inspired-homepage-studio/src/data/products.ts");
const src = fs.readFileSync(srcPath, "utf8");

const map = {
  artBike: "art_bike",
  artBuddha: "art_buddha",
  artCar: "art_car",
  artGanesha: "art_ganesha",
  artGym: "art_gym",
  artJeep: "art_jeep",
  artLeaves: "art_leaves",
  artTree: "art_tree",
  artWorldmap: "art_worldmap",
  bannerDining: "banner_dining",
  deskOrganizer: "desk_organizer",
  hangingPlanters: "hanging_planters",
  heroLivingRoom: "hero_living_room",
  lamp: "lamp",
  planters: "planters",
  roomBedroom: "room_bedroom",
  roomEntry: "room_entry",
  roomLiving: "room_living",
  roomOffice: "room_office",
};

let out = src.replace(/^import[\s\S]*?from "@\/assets\/room_office\.jpg";\r?\n\r?\n/, "");

for (const [key, value] of Object.entries(map)) {
  out = out.replaceAll(`src: ${key}`, `src: image("${value}")`);
}

out = `const image = (name: string) => \`/images/\${name}.jpg\`;\n\n${out}`;

const destDir = path.join(root, "src/data");
fs.mkdirSync(destDir, { recursive: true });
fs.writeFileSync(path.join(destDir, "products.ts"), out);
console.log("wrote src/data/products.ts");
