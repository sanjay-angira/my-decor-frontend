"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { ReactNode } from "react";
import type { AppDispatch, RootState } from "@/services/redux";
import { setAuthOpen } from "@/services/redux/slices/modalSlice";

const accountSections = [
  { href: "/my-account/profile", label: "Profile settings" },
  { href: "/my-account/wishlist", label: "Wishlist" },
  { href: "/my-account/orders", label: "Orders" },
];

export function MyAccountLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, user } = useSelector(
    (state: RootState) => state.userAuth,
  );
  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "My account";

  return (
    <main className="page-width min-h-[65vh] py-10 lg:py-14">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">
          Account
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          My account
        </h1>
      </header>

      {!isInitialized ? (
        <p className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground" role="status">
          Checking your account…
        </p>
      ) : !isAuthenticated ? (
        <section className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-lg font-bold text-foreground">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your profile settings and saved wishlist.
          </p>
          <button
            type="button"
            className="button button-brand mt-5"
            onClick={() => dispatch(setAuthOpen(true))}
          >
            Sign in
          </button>
        </section>
      ) : (
        <div className="grid gap-6 md:grid-cols-[230px_minmax(0,1fr)]">
          <aside className="h-fit rounded-xl border border-border bg-card p-4">
            <p className="truncate px-3 pb-4 pt-1 text-sm font-semibold text-foreground">
              {userName}
            </p>
            <nav className="flex gap-2 overflow-x-auto md:flex-col" aria-label="My account">
              {accountSections.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-brand text-brand-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <section className="min-w-0 rounded-xl border border-border bg-card p-5 sm:p-7">
            {children}
          </section>
        </div>
      )}
    </main>
  );
}
