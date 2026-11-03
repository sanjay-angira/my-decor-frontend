"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icon";

function Logo() {
  return (
    <span className="brand-logo" aria-label="India Decor">
      <span className="brand-mark"><Icon name="leaf" /></span>
      <span className="brand-wordmark"><strong>INDIA</strong><small>DÉCOR</small></span>
    </span>
  );
}

const navItems = [
  ["Wall Art", "/#featured"],
  ["Planters", "/#featured"],
  ["Lamps", "/#featured"],
  ["Desk Organizers", "/#featured"],
  ["Gym Wall Art", "/#best-sellers"],
  ["Car Wall Art", "/#best-sellers"],
  ["Spiritual Wall Art", "/#best-sellers"],
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="announcement">
        <div className="page-width announcement-inner">
          <p>Sculptural Metal Wall Art – Bring Positivity to Your Space</p>
          <div className="announcement-links">
            <a href="tel:+919800000000"><Icon name="phone" /> +91 98000 00000</a>
            <a href="mailto:info@indiadecor.com"><Icon name="mail" /> info@indiadecor.com</a>
            <Link href="/#footer"><Icon name="shield" /> Help Center</Link>
          </div>
        </div>
      </div>

      <div className="navigation-wrap">
        <div className="page-width main-navigation">
          <Link className="logo-link" href="/" aria-label="India Decor home"><Logo /></Link>
          <label className="search-field">
            <Icon name="search" />
            <input type="search" placeholder={'Search "Modern Wall Art"'} aria-label="Search products" />
          </label>
          <div className="header-actions">
            <Link className="header-action-label" href="/#featured"><Icon name="sparkles" /> Offers</Link>
            <Link className="header-action-label" href="/#footer"><Icon name="tag" /> Track Order</Link>
            <button className="icon-button" type="button" aria-label="Wishlist"><Icon name="heart" /></button>
            <button className="icon-button cart-button" type="button" aria-label="Cart, 2 items">
              <Icon name="bag" /><span className="cart-count">2</span>
            </button>
            <button className="sign-in" type="button"><Icon name="user" /> Sign In</button>
            <button className="icon-button mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}>
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        <nav className="page-width category-navigation" aria-label="Categories">
          <div className="category-nav-links">
            {navItems.map(([label, href]) => (
              <Link href={href} key={label}>{label}{["Wall Art", "Planters"].includes(label) && <Icon name="chevronDown" />}</Link>
            ))}
            <Link href="/#shop-by-room">More <Icon name="chevronDown" /></Link>
          </div>
          <Link className="all-categories" href="/#categories">View All Categories</Link>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            <div className="page-width">
              <label className="search-field mobile-search"><Icon name="search" /><input type="search" placeholder="Search décor…" aria-label="Search décor" /></label>
              <nav aria-label="Mobile categories">
                {navItems.map(([label, href]) => <Link href={href} key={label} onClick={() => setMenuOpen(false)}>{label}</Link>)}
                <Link href="/#shop-by-room" onClick={() => setMenuOpen(false)}>More</Link>
              </nav>
              <button className="sign-in mobile-sign-in" type="button"><Icon name="user" /> Sign In</button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
