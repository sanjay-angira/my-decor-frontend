import { Icon } from "@/components/Icon";
import Image from "next/image";
import Link from "next/link";

type CollectionTileProps = {
  title: string;
  blurb: string;
  cta: string;
  src: string;
  alt: string;
  href: string;
  large?: boolean;
};

const CollectionTile = ({
  title,
  blurb,
  cta,
  src,
  alt,
  href,
  large = false,
}: CollectionTileProps) => {
  return (
    <Link
      className={`collection-tile${large ? " collection-tile-large" : ""}`}
      href={href}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 700px) 100vw, 50vw"
        unoptimized
      />
      <span className="tile-shade" />
      <span className="tile-copy">
        <strong>{title}</strong>
        <span>{blurb}</span>
        <b>
          {cta}
          <Icon name="arrow" />
        </b>
      </span>
    </Link>
  );
};

export default CollectionTile;