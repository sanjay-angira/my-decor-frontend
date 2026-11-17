"use client";

import { useEffect } from "react";
import { recordRecentlyViewedProduct } from "@/services/recentlyViewedService";

export function RecentlyViewedTracker({ productId }: { productId: number }) {
  useEffect(() => {
    let active = true;

    recordRecentlyViewedProduct(productId).catch((error: unknown) => {
      if (active) {
        console.error("Failed to record recently viewed product.", error);
      }
    });

    return () => {
      active = false;
    };
  }, [productId]);

  return null;
}
