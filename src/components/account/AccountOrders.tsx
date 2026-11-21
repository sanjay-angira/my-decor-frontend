"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/data/products";
import { fetchOrders, type CustomerOrder } from "@/services/checkoutService";

function displayStatus(value: string | null | undefined): string {
  const words = value?.trim().replace(/[_-]+/g, " ").split(/\s+/).filter(Boolean);
  return words?.length
    ? words.map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ")
    : "Unknown";
}

function formatOrderDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function AccountOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void fetchOrders()
      .then((response) => {
        if (!response.success) {
          throw new Error(response.message || "Orders could not be loaded.");
        }
        if (active) {
          setOrders(response.data);
          setError("");
        }
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Orders could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Orders</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Review your recent orders and their current status.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground" role="status">
          Loading orders…
        </p>
      ) : error ? (
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
      ) : orders.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="font-semibold text-foreground">No orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your orders will appear here after you place one.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid list-none gap-4 p-0">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-lg border border-border p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Placed {formatOrderDate(order.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                  {displayStatus(order.orderStatus)}
                </span>
              </div>

              <ul className="mt-4 grid list-none gap-2 border-t border-border pt-4 p-0">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-foreground">
                      {item.productName}
                      {item.variantName ? ` · ${item.variantName}` : ""}
                      <span className="ml-2 text-muted-foreground">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <p className="text-xs text-muted-foreground">
                  Payment: {displayStatus(order.paymentStatus)}
                  {order.paymentMethod
                    ? ` · ${displayStatus(order.paymentMethod)}`
                    : ""}
                </p>
                <p className="text-sm font-bold text-foreground">
                  Total: {formatPrice(order.total)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
