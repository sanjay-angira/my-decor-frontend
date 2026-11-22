import Image from "next/image";
import { Icon } from "@/components/Icon";
const image = (name: string) => `/images/${name}.png`;
const MidBanner = () => {
  return (
    <section className="page-width content-section">
      <a className="mid-banner" href="#shop-by-room">
        <Image src={image("premotional")} alt="Black metal mountain wall art above a dining table" fill sizes="100vw" />
        <span className="banner-shade" />
        <span className="banner-copy"><strong>Turn Walls Into Stories</strong><span>Discover unique metal wall art that reflects your personality.</span><b className="button button-dark">Explore Now<Icon name="arrow" /></b></span>
      </a>
    </section>
  );
}

export default MidBanner;