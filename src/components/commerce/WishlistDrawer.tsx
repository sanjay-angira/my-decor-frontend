"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@/components/Icon";
import { formatPrice } from "@/data/products";
import { addCartItem, fetchCart } from "@/services/cartService";
import {
  fetchWishlist,
  removeWishlistItem,
  type WishlistEntry,
} from "@/services/wishlistService";
import type { AppDispatch, RootState } from "@/services/redux";
import {
  setCartOpen,
  setWishlistOpen,
} from "@/services/redux/slices/modalSlice";
import { setCartContents } from "@/services/redux/slices/cartSlice";
import { removeWishlistProduct, setWishlistProducts } from "@/services/redux/slices/wishlistSlice";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Wishlist request failed.";
}

export function WishlistDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.wishlistOpen);
  const isAuthenticated = useSelector(
    (state: RootState) => state.userAuth.isAuthenticated,
  );
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;
    let active = true;
    void fetchWishlist()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message || "Wishlist could not be loaded.");
        }
        if (active) {
          setItems(response.data);
          setError("");
          dispatch(setWishlistProducts(response.data.map((item) => item.variationId)));
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(errorMessage(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch, isAuthenticated, isOpen, reloadKey]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(setWishlistOpen(false));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [dispatch, isOpen]);

  async function removeItem(item: WishlistEntry) {
    setPendingId(item.id);
    setError("");
    try {
      const response = await removeWishlistItem(item.id);
      if (!response.success) {
        throw new Error(response.message || "Wishlist item could not be removed.");
      }
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      dispatch(removeWishlistProduct(item.variationId));
    } catch (removeError) {
      setError(errorMessage(removeError));
    } finally {
      setPendingId(null);
    }
  }

  async function addItemToCart(item: WishlistEntry) {
    setPendingId(item.id);
    setError("");
    try {
      await addCartItem(item.variationId, 1);
      dispatch(setCartContents(await fetchCart()));
      dispatch(setWishlistOpen(false));
      dispatch(setCartOpen(true));
    } catch (cartError) {
      setError(errorMessage(cartError));
    } finally {
      setPendingId(null);
    }
  }

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[120] bg-black/40"
      role="presentation"
      onClick={() => dispatch(setWishlistOpen(false))}
    >
      <section
        className="ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Your wishlist</h2>
            <p className="text-sm text-muted-foreground">{items.length} saved products</p>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
            aria-label="Close wishlist"
            onClick={() => dispatch(setWishlistOpen(false))}
          >
            <Icon name="close" />
          </button>
        </header>

        {error && items.length > 0 && (
          <p className="mx-5 mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="p-6 text-sm text-muted-foreground" role="status">Loading your wishlist…</p>
        ) : error && items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="font-semibold text-foreground">Your wishlist could not be loaded</p>
            <p className="text-sm text-destructive" role="alert">{error}</p>
            <button
              type="button"
              className="button button-brand-outline"
              onClick={() => {
                setError("");
                setLoading(true);
                setReloadKey((key) => key + 1);
              }}
            >
              Try again
            </button>
          </div>
        ) : !isAuthenticated || items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <Icon name="heart" className="h-8 w-8 text-muted-foreground" />
            <p className="font-semibold text-foreground">
              {isAuthenticated ? "Your wishlist is empty" : "Sign in to view your wishlist"}
            </p>
            <button
              type="button"
              className="button button-brand-outline"
              onClick={() => dispatch(setWishlistOpen(false))}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
            {items.map((item) => (
              <li key={item.id} className="flex gap-3 py-4">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-lg bg-secondary object-cover"
                  />
                ) : (
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-lg bg-secondary">
                    <Icon name="heart" className="h-6 w-6 text-muted-foreground" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  {item.productSlug ? (
                    <Link
                      className="line-clamp-2 text-sm font-semibold text-foreground hover:text-brand"
                      href={`/product/${item.productSlug}`}
                      onClick={() => dispatch(setWishlistOpen(false))}
                    >
                      {item.productName}
                    </Link>
                  ) : (
                    <p className="line-clamp-2 text-sm font-semibold text-foreground">{item.productName}</p>
                  )}
                  {item.variantName && (
                    <p className="mt-1 text-xs text-muted-foreground">{item.variantName}</p>
                  )}
                  <p className="mt-1 text-sm font-bold text-foreground">{formatPrice(item.finalPrice)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs font-semibold ${item.inStock ? "text-emerald-700" : "text-destructive"}`}>
                      {item.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      className="text-xs font-semibold text-destructive hover:underline"
                      disabled={pendingId === item.id}
                      onClick={() => void removeItem(item)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className="text-xs font-semibold text-brand hover:underline disabled:opacity-50"
                      disabled={pendingId === item.id || !item.inStock}
                      onClick={() => void addItemToCart(item)}
                    >
                      {pendingId === item.id ? "Updating…" : "Add to cart"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>,
    document.body,
  );
}
