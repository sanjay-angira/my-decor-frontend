type SluggedOption = {
  id: number;
  slug?: string | null;
};

export function getCategorySubtreeIds(
  categories: readonly { id: number; parentId: number | null }[],
  rootCategoryId: number,
): number[] {
  const categoryIds = new Set([rootCategoryId]);
  let hasNewDescendants = true;

  while (hasNewDescendants) {
    hasNewDescendants = false;
    for (const category of categories) {
      if (
        category.parentId !== null &&
        categoryIds.has(category.parentId) &&
        !categoryIds.has(category.id)
      ) {
        categoryIds.add(category.id);
        hasNewDescendants = true;
      }
    }
  }

  return [...categoryIds];
}

export function resolveSluggedOptions<T extends SluggedOption>(
  options: readonly T[] | undefined,
  values: readonly string[],
): T[] {
  const selectedValues = new Set(
    values
      .flatMap((value) => value.split(/[\/,]/))
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );

  return (options ?? []).filter((option) => {
    const slug = option.slug?.trim();
    if (!slug) return false;
    return (
      selectedValues.has(slug.toLowerCase()) ||
      selectedValues.has(String(option.id))
    );
  });
}
