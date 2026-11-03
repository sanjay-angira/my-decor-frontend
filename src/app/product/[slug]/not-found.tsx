import Link from "next/link";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="m-0 font-display text-3xl font-extrabold">Product not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">This piece isn’t in our catalogue anymore.</p>
        <Link className="button button-dark mt-6" href="/">
          Back to home
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
