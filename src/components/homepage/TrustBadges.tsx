import { Icon } from "@/components/Icon";

const TrustBadges = () => {
  const badges = [
    { icon: "truck" as const, title: "Easy Returns", blurb: "Hassle-free exchanges" },
    { icon: "shield" as const, title: "Secure Checkout", blurb: "100% safe payments" },
    { icon: "check" as const, title: "Premium Quality", blurb: "Crafted with care" },
    { icon: "pin" as const, title: "Made in India", blurb: "Supporting local artisans" },
  ];

  return (
    <section className="page-width trust-badges" aria-label="Why shop with us">
      {badges.map(({ icon, title, blurb }) => <div className="trust-badge" key={title}><span className="badge-icon"><Icon name={icon} /></span><span><strong>{title}</strong><small>{blurb}</small></span></div>)}
    </section>
  );
}

export default TrustBadges;