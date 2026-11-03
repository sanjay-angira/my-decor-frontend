import { Icon } from "@/components/Icon";
import Image from "next/image";

const CollectionTile = ({ title, blurb, cta, src, alt, large = false }: { title: string; blurb: string; cta: string; src: string; alt: string; large?: boolean }) => {
  return (
    <a className={`collection-tile${large ? " collection-tile-large" : ""}`} href="#featured">
      <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 50vw" />
      <span className="tile-shade" />
      <span className="tile-copy">
        <strong>{title}</strong><span>{blurb}</span><b>{cta}<Icon name="arrow" /></b>
      </span>
    </a>
  );
}

export default CollectionTile;