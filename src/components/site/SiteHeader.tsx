"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

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
            <button
              className="icon-button mobile-search-button"
              type="button"
              aria-label={searchOpen ? "Close search" : "Open search"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((open) => !open)}
            >
              <Icon name={searchOpen ? "close" : "search"} />
            </button>
            <button className="icon-button header-wishlist-button" type="button" aria-label="Wishlist"><Icon name="heart" /></button>
            <button className="icon-button cart-button" type="button" aria-label="Cart, 2 items">
              <Icon name="bag" /><span className="cart-count">2</span>
            </button>
            <button className="sign-in" type="button"><Icon name="user" /> Sign In</button>
            <button className="icon-button mobile-account-button" type="button" aria-label="Sign in">
              <Icon name="user" />
            </button>
            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="mobile-search-row">
            <label className="search-field">
              <input autoFocus type="search" placeholder={'Search "Superhero Wall Art"'} aria-label="Search décor" />
              <button type="button" aria-label="Submit search">
                <Icon name="search" />
              </button>
            </label>
          </div>
        )}

        <nav className="page-width category-navigation" aria-label="Categories">
          <div className="category-nav-links">
            {navItems.map(([label, href]) => (
              <Link href={href} key={label}>{label}{["Wall Art", "Planters"].includes(label) && <Icon name="chevronDown" />}</Link>
            ))}
            <Link href="/#shop-by-room">More <Icon name="chevronDown" /></Link>
          </div>
          <Link className="all-categories" href="/#categories">View All Categories</Link>
        </nav>

        {menuOpen && typeof document !== "undefined" && createPortal(
          <div className="mobile-menu-backdrop" onClick={() => setMenuOpen(false)}>
            <aside
              className="mobile-menu"
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mobile-menu-header">
                <span><Icon name="menu" /> Menu</span>
                <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                  <Icon name="close" />
                </button>
              </div>
              <div className="mobile-menu-content">
                <nav className="mobile-quick-links" aria-label="Quick links">
                  <Link href="/#featured" onClick={() => setMenuOpen(false)}><Icon name="sparkles" /> Offers</Link>
                  <Link href="/" onClick={() => setMenuOpen(false)}><Icon name="home" /> Store</Link>
                </nav>
                <h2 className="mobile-menu-section-title">
                  <Icon name="tag" /> Product Categories
                </h2>
                <nav className="mobile-category-links" aria-label="Product categories">
                  {navItems.map(([label, href]) => (
                    <Link href={href} key={label} onClick={() => setMenuOpen(false)}>{label}</Link>
                  ))}
                  <Link href="/#shop-by-room" onClick={() => setMenuOpen(false)}>More</Link>
                </nav>
                <Link className="mobile-all-categories" href="/#categories" onClick={() => setMenuOpen(false)}>
                  View All Categories
                </Link>
                <Link className="mobile-menu-logo" href="/" aria-label="India Decor home" onClick={() => setMenuOpen(false)}>
                  <Logo />
                </Link>
              </div>
            </aside>
          </div>,
          document.body,
        )}
      </div>
    </header>
  );
}
