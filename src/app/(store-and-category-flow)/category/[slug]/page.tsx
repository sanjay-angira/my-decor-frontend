import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreCatalogPage } from "@/components/store/StoreCatalogPage";
import { fetchStoreCategoryBySlug } from "@/services/homepageService";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  title: "Shop by Category | India Decor",
  description:
    "Explore home décor and wall art collections by category at India Decor.",
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const category = await fetchStoreCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <StoreCatalogPage
      category={category}
      searchParams={Promise.resolve(resolvedSearchParams)}
    />
  );
}
