"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/Icon";
import { API_ENDPOINTS } from "@/services/api/API_ENDPOINT";
import { getData } from "@/services/api/apiService";
import type { ApiSuccessResponse } from "@/services/api/errors";

function Logo() {
  return (
    <span className="brand-logo" aria-label="India Decor">
      <span className="brand-mark"><Icon name="leaf" /></span>
      <span className="brand-wordmark"><strong>INDIA</strong><small>DÉCOR</small></span>
    </span>
  );
}

type HeaderCategory = {
  id: number;
  name: string;
  slug?: string | null;
  parentId?: number | null;
};

type HeaderCategoriesResponse =
  | HeaderCategory[]
  | {
      rows?: HeaderCategory[];
    };

const HEADER_HIDE_THRESHOLD = 120;
const HEADER_SHOW_THRESHOLD = 20;

function categoryHref(category: HeaderCategory): string {
  const slug = category.slug?.trim();
  return slug
    ? `/category/${encodeURIComponent(slug)}`
    : "/products";
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categories, setCategories] = useState<HeaderCategory[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    const loadCategories = async () => {
      try {
        const response = await getData<
          ApiSuccessResponse<HeaderCategoriesResponse>
        >(API_ENDPOINTS.CUSTOMER.CATEGORIES, undefined, {
          auth: false,
          signal: controller.signal,
        });

        if (response.success) {
          const rows = Array.isArray(response.data)
            ? response.data
            : Array.isArray(response.data?.rows)
              ? response.data.rows
              : [];
          setCategories(
            rows.filter(
              (category) =>
                Number.isInteger(category.id) &&
                category.id > 0 &&
                Boolean(category.name?.trim()),
            ),
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load header categories.", error);
        }
      }
    };

    void loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      setIsScrolled((scrolled) =>
        scrollY > (scrolled ? HEADER_SHOW_THRESHOLD : HEADER_HIDE_THRESHOLD),
      );
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  const topLevelCategories = categories.filter(
    (category) => category.parentId === null || category.parentId === undefined,
  );
  const headerCategories =
    topLevelCategories.length > 0 ? topLevelCategories : categories;

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
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
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
            <button className="icon-button header-wishlist-button sign-in" type="button" aria-label="Sign in" title="Sign in">
              <Icon name="user" />
            </button>
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

        <div className="category-navigation-divider" aria-hidden="true" />
        <nav className="page-width category-navigation" aria-label="Categories">
          <div className="category-nav-links">
            {headerCategories.map((category) => (
              <Link href={categoryHref(category)} key={category.id}>
                {category.name}
              </Link>
            ))}
            <Link href="/products">All Products</Link>
          </div>
          <Link className="all-categories" href="/categories">View All Categories</Link>
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
                  <Link href="/products" onClick={() => setMenuOpen(false)}><Icon name="tag" /> All Products</Link>
                  <Link href="/" onClick={() => setMenuOpen(false)}><Icon name="home" /> Store</Link>
                </nav>
                <h2 className="mobile-menu-section-title">
                  <Icon name="tag" /> Product Categories
                </h2>
                <nav className="mobile-category-links" aria-label="Product categories">
                  {headerCategories.map((category) => (
                    <Link href={categoryHref(category)} key={category.id} onClick={() => setMenuOpen(false)}>
                      {category.name}
                    </Link>
                  ))}
                  <Link href="/products" onClick={() => setMenuOpen(false)}>All Products</Link>
                </nav>
                <Link className="mobile-all-categories" href="/categories" onClick={() => setMenuOpen(false)}>
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
