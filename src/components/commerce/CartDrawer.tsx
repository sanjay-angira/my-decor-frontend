"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@/components/Icon";
import { formatPrice } from "@/data/products";
import {
  clearRemoteCart,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cartService";
import type { AppDispatch, RootState } from "@/services/redux";
import { setCartContents, setCartCount } from "@/services/redux/slices/cartSlice";
import { setCartOpen } from "@/services/redux/slices/modalSlice";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Cart request failed.";
}

export function CartDrawer() {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.modal.cartOpen);
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    void fetchCart()
      .then((cart) => {
        if (active) {
          dispatch(setCartContents(cart));
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
  }, [dispatch, isOpen, reloadKey]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") dispatch(setCartOpen(false));
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [dispatch, isOpen]);

  async function mutateCart(mutation: () => Promise<unknown>) {
    setPending(true);
    setError("");
    try {
      await mutation();
      dispatch(setCartContents(await fetchCart()));
    } catch (mutationError) {
      setError(errorMessage(mutationError));
    } finally {
      setPending(false);
    }
  }

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="commerce-drawer-backdrop fixed inset-0 z-[120] bg-black/40"
      role="presentation"
      onClick={() => dispatch(setCartOpen(false))}
    >
      <section
        className="commerce-drawer-panel ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Your cart</h2>
            <p className="text-sm text-muted-foreground">{items.length} products</p>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-secondary"
            aria-label="Close cart"
            onClick={() => dispatch(setCartOpen(false))}
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
          <p className="p-6 text-sm text-muted-foreground" role="status">Loading your cart…</p>
        ) : error && items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="font-semibold text-foreground">Your cart could not be loaded</p>
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
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <Icon name="bag" className="h-8 w-8 text-muted-foreground" />
            <p className="font-semibold text-foreground">Your cart is empty</p>
            <button
              type="button"
              className="button button-brand-outline"
              onClick={() => dispatch(setCartOpen(false))}
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => {
                const stock = item.variant?.stock ?? 10;
                const unitPrice = Number(item.finalPrice ?? item.priceAtTime);
                const sellingPrice = Number(item.sellingPrice);
                const hasOfferPrice =
                  Number.isFinite(sellingPrice) && sellingPrice > unitPrice;
                return (
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
                        <Icon name="bag" className="h-6 w-6 text-muted-foreground" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-foreground">{item.productName}</p>
                      {item.variantName && (
                        <p className="mt-1 text-xs text-muted-foreground">{item.variantName}</p>
                      )}
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <p className="text-sm font-bold text-foreground">
                          {formatPrice(unitPrice)}
                          <span className="ml-1 text-xs font-normal text-muted-foreground">
                            each
                          </span>
                        </p>
                        {hasOfferPrice && (
                          <>
                            <del className="text-xs text-muted-foreground">
                              {formatPrice(sellingPrice)}
                            </del>
                            <span className="rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand">
                              {item.appliedOffer?.offerName || "Offer applied"}
                            </span>
                          </>
                        )}
                      </div>
                      {hasOfferPrice && (
                        <p className="mt-1 text-xs font-medium text-brand">
                          You save {formatPrice((sellingPrice - unitPrice) * item.quantity)}
                          {item.quantity > 1 ? ` on ${item.quantity} items` : ""}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.productName} quantity`}
                            disabled={pending}
                            className="grid h-7 w-7 place-items-center rounded-full border border-border disabled:opacity-50"
                            onClick={() => {
                              if (item.quantity <= 1) {
                                void mutateCart(() => removeCartItem(item.id));
                              } else {
                                void mutateCart(() => updateCartItem(item.id, item.quantity - 1));
                              }
                            }}
                          >
                            <Icon name="minus" className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-4 text-center text-sm">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase ${item.productName} quantity`}
                            disabled={pending || item.quantity >= stock}
                            className="grid h-7 w-7 place-items-center rounded-full border border-border disabled:opacity-50"
                            onClick={() => void mutateCart(() => updateCartItem(item.id, item.quantity + 1))}
                          >
                            <Icon name="plus" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-xs font-semibold text-destructive hover:underline"
                          disabled={pending}
                          onClick={() => void mutateCart(() => removeCartItem(item.id))}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <footer className="border-t border-border p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Subtotal</span>
                <span className="font-bold text-foreground">{formatPrice(total)}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="button button-brand-outline flex-1"
                  disabled={pending}
                  onClick={() =>
                    void mutateCart(async () => {
                      await clearRemoteCart();
                      dispatch(setCartContents({ items: [], total: 0 }));
                      dispatch(setCartCount(0));
                    })
                  }
                >
                  Clear cart
                </button>
                <button
                  type="button"
                  className="button button-brand flex-1"
                  onClick={() => dispatch(setCartOpen(false))}
                >
                  Continue shopping
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>,
    document.body,
  );
}
