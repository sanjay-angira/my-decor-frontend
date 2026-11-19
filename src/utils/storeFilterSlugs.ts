type SluggedOption = {
  id: number;
  slug?: string | null;
};

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
