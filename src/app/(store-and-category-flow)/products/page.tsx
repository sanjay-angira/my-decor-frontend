import type { Metadata } from "next";
import { StoreCatalogPage } from "@/components/store/StoreCatalogPage";

export const metadata: Metadata = {
  title: "Shop All Products | India Decor",
  description:
    "Explore the complete India Decor collection of metal wall art and home décor.",
};

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  return <StoreCatalogPage searchParams={searchParams} />;
}
