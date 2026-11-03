import Link from "next/link";
import { Icon } from "@/components/Icon";

function Logo() {
  return (
    <span className="brand-logo" aria-label="India Decor">
      <span className="brand-mark"><Icon name="leaf" /></span>
      <span className="brand-wordmark"><strong>INDIA</strong><small>DÉCOR</small></span>
    </span>
  );
}

export function SiteFooter() {
  const columns = [
    { heading: "Shop", links: ["Wall Art", "Car Wall Art", "Spiritual Wall Art", "Planters", "Lamps", "Desk Organizers", "Gym Wall Art"] },
    { heading: "Customer Care", links: ["Track Order", "Returns & Refunds", "Shipping Policy", "FAQs", "Help Center", "Contact Us"] },
    { heading: "About", links: ["Our Story", "Blog", "Wall Art Ideas", "Careers", "Become a Partner"] },
  ];

  return (
    <footer className="site-footer" id="footer">
      <div className="page-width footer-main">
        <div className="footer-about">
          <Link href="/"><Logo /></Link>
          <p>Handcrafted metal wall art and home décor to make every space beautiful and meaningful.</p>
          <div className="social-links">
            {["f", "◎", "▶", "𝕏"].map((icon, index) => (
              <a href="/#footer" aria-label={["Facebook", "Instagram", "YouTube", "Twitter"][index]} key={icon}>{icon}</a>
            ))}
          </div>
        </div>
        {columns.map((column) => (
          <nav className="footer-column" aria-label={column.heading} key={column.heading}>
            <h3>{column.heading}</h3>
            {column.links.map((link) => <Link href="/#categories" key={link}>{link}</Link>)}
          </nav>
        ))}
        <div className="footer-column app-column">
          <h3>Download Our App</h3>
          <p>Shop faster, right from your phone.</p>
          <a className="store-link" href="/#footer"><Icon name="shield" /> Download on the App Store</a>
          <a className="store-link" href="/#footer"><Icon name="shield" /> Get it on Google Play</a>
        </div>
      </div>
      <div className="footer-legal">
        <div className="page-width">
          <span>© 2026 The India Decor. All rights reserved.</span>
          <div>
            <a href="/#footer">Privacy Policy</a>
            <a href="/#footer">Terms &amp; Conditions</a>
            <strong><Icon name="shield" /> Secure Payments</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
