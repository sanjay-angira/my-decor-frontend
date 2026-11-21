import SectionHeading from "./homePageUtilis/SectionHeading";
import { Icon } from "@/components/Icon";
import Image from "next/image";
import Link from "next/link";

type Room = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  mobileImage: string | null;
};

type RoomsProps = {
  rooms: Room[];
};

const ShopByRoom = ({rooms}: RoomsProps) => {
  return (
    <section className="page-width content-section" id="shop-by-room">
      <SectionHeading title="Shop by Room" href="#new-arrivals" />
      <div className="room-grid">
        {rooms.map((room) => {
          const imageUrl = room.mobileImage || room.image;
          if (!imageUrl) return null;

          return (
            <Link
              className="room-card"
              href={`/products?room=${encodeURIComponent(room.slug)}`}
              key={room.id}
            >
              <Image
                src={imageUrl}
                alt={`${room.name} décor`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                unoptimized
              />
              <span className="room-shade" />
              <strong>{room.name}</strong>
              <i><Icon name="arrow" /></i>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default ShopByRoom;