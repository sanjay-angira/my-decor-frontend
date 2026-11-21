"use client";

import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem as addCartItemRequest, fetchCart } from "@/services/cartService";
import {
  addWishlistItem,
  removeWishlistVariation,
} from "@/services/wishlistService";
import { resolveProductVariationId } from "@/services/productVariationService";
import type { AppDispatch, RootState } from "@/services/redux";
import { setCartContents } from "@/services/redux/slices/cartSlice";
import {
  setAuthOpen,
  setCartOpen,
} from "@/services/redux/slices/modalSlice";
import {
  addWishlistProduct,
  removeWishlistProduct,
} from "@/services/redux/slices/wishlistSlice";

type PendingAction = "cart" | "wishlist" | null;

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "The request could not be completed.";
}

export function useProductCommerce(
  slug: string,
  currentVariationId?: number,
  currentOptionLabel?: string,
) {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.userAuth.isAuthenticated,
  );
  const currentUserId = useSelector((state: RootState) =>
    Number(state.userAuth.user?.id),
  );
  const wishlistIds = useSelector(
    (state: RootState) => state.wishlist.productIds,
  );
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [error, setError] = useState("");
  const [resolvedVariationId, setResolvedVariationId] = useState<number>();

  const resolveVariationId = useCallback(async () => {
    if (currentVariationId && currentVariationId > 0) {
      return currentVariationId;
    }
    if (
      resolvedVariationId &&
      (!currentOptionLabel || currentOptionLabel.trim().toLowerCase() === "default")
    ) {
      return resolvedVariationId;
    }
    const id = await resolveProductVariationId(slug, currentOptionLabel);
    setResolvedVariationId(id);
    return id;
  }, [currentOptionLabel, currentVariationId, resolvedVariationId, slug]);

  const addToCart = useCallback(
    async (quantity = 1) => {
      setPendingAction("cart");
      setError("");
      try {
        const variationId = await resolveVariationId();
        await addCartItemRequest(variationId, quantity);
        const cart = await fetchCart();
        dispatch(setCartContents(cart));
        dispatch(setCartOpen(true));
        return true;
      } catch (requestError) {
        setError(errorMessage(requestError));
        return false;
      } finally {
        setPendingAction(null);
      }
    },
    [dispatch, resolveVariationId],
  );

  const toggleWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch(setAuthOpen(true));
      return false;
    }
    if (!Number.isSafeInteger(currentUserId) || currentUserId <= 0) {
      setError("Your account ID is unavailable. Please sign in again.");
      return false;
    }

    setPendingAction("wishlist");
    setError("");
    try {
      const variationId = await resolveVariationId();
      const alreadyWished = wishlistIds.includes(variationId);
      const response = alreadyWished
        ? await removeWishlistVariation(variationId)
        : await addWishlistItem(variationId, currentUserId);
      if (!response.success) {
        throw new Error(response.message || "Wishlist update failed.");
      }

      dispatch(
        alreadyWished
          ? removeWishlistProduct(variationId)
          : addWishlistProduct(variationId),
      );
      return true;
    } catch (requestError) {
      setError(errorMessage(requestError));
      return false;
    } finally {
      setPendingAction(null);
    }
  }, [currentUserId, dispatch, isAuthenticated, resolveVariationId, wishlistIds]);

  const wishedVariationId = currentVariationId || resolvedVariationId;

  return {
    addToCart,
    toggleWishlist,
    isWishlisted:
      wishedVariationId !== undefined && wishlistIds.includes(wishedVariationId),
    pendingAction,
    error,
  };
}
