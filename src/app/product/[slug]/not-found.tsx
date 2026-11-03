import Link from "next/link";

export default function ProductNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="m-0 font-display text-3xl font-extrabold">Product not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">This piece isn’t in our catalogue anymore.</p>
      <Link className="button button-dark mt-6" href="/">
        Back to home
      </Link>
    </main>
  );
}
