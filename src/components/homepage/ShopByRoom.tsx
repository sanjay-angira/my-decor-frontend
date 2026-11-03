import SectionHeading from "./homePageUtilis/SectionHeading";
import { Icon } from "@/components/Icon";
import Image from "next/image";

type Room = {
  label: string;
  image: string;
};

type RoomsProps = {
  rooms: Room[];
};

const ShopByRoom = ({rooms}: RoomsProps) => {
  return (
    <section className="page-width content-section" id="shop-by-room">
      <SectionHeading title="Shop by Room" href="#new-arrivals" />
      <div className="room-grid">
        {rooms.map((room) => <a className="room-card" href="#featured" key={room.label}><Image src={room.image} alt={`${room.label} décor`} fill sizes="(max-width: 640px) 50vw, 25vw" /><span className="room-shade" /><strong>{room.label}</strong><i><Icon name="arrow" /></i></a>)}
      </div>
    </section>
  );
}

export default ShopByRoom;