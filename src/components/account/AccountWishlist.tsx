"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Icon } from "@/components/Icon";
import { formatPrice } from "@/data/products";
import {
  fetchWishlist,
  removeWishlistItem,
  type WishlistEntry,
} from "@/services/wishlistService";
import type { AppDispatch } from "@/services/redux";
import { removeWishlistProduct, setWishlistProducts } from "@/services/redux/slices/wishlistSlice";

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Wishlist request failed.";
}

export function AccountWishlist() {
  const dispatch = useDispatch<AppDispatch>();
  const [items, setItems] = useState<WishlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void fetchWishlist()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message || "Wishlist could not be loaded.");
        }
        if (active) {
          setItems(response.data);
          dispatch(setWishlistProducts(response.data.map((item) => item.variationId)));
          setError("");
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
  }, [dispatch, reloadKey]);

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

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Wishlist</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Products you have saved for later.
          </p>
        </div>
        {!loading && !error && items.length > 0 && (
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {error && items.length > 0 && (
        <p className="mt-5 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground" role="status">Loading wishlist…</p>
      ) : error && items.length === 0 ? (
        <div className="mt-6 rounded-lg border border-border p-6 text-center">
          <p className="text-sm text-destructive" role="alert">{error}</p>
          <button
            type="button"
            className="button button-brand-outline mt-4"
            onClick={() => {
              setLoading(true);
              setError("");
              setReloadKey((key) => key + 1);
            }}
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <Icon name="heart" className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold text-foreground">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Save products with the heart button to find them here.
          </p>
          <Link className="button button-brand mt-5 inline-flex" href="/products">
            Browse products
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-3 rounded-lg border border-border p-3"
            >
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded-md bg-secondary object-cover"
                />
              ) : (
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-md bg-secondary">
                  <Icon name="heart" className="h-6 w-6 text-muted-foreground" />
                </span>
              )}
              <div className="flex min-w-0 flex-1 flex-col">
                {item.productSlug ? (
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="line-clamp-2 text-sm font-semibold text-foreground hover:text-brand"
                  >
                    {item.productName}
                  </Link>
                ) : (
                  <p className="line-clamp-2 text-sm font-semibold text-foreground">
                    {item.productName}
                  </p>
                )}
                {item.variantName && (
                  <p className="mt-1 text-xs text-muted-foreground">{item.variantName}</p>
                )}
                <p className="mt-2 text-sm font-bold text-foreground">
                  {formatPrice(item.finalPrice)}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className={`text-xs font-semibold ${item.inStock ? "text-emerald-700" : "text-destructive"}`}>
                    {item.inStock ? "In stock" : "Out of stock"}
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-destructive hover:underline disabled:opacity-50"
                    disabled={pendingId !== null}
                    onClick={() => void removeItem(item)}
                  >
                    {pendingId === item.id ? "Removing…" : "Remove"}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
