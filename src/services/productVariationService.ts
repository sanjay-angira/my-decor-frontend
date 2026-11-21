import { fetchProductBySlug } from "./catalogService";

type RecordValue = Record<string, unknown>;

export type ProductVariation = {
  id: number;
  label: string;
};

const variationRequests = new Map<string, Promise<ProductVariation[]>>();

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLabel(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function variationLabel(variant: RecordValue): string {
  const attributes = Array.isArray(variant.variantAttributes)
    ? variant.variantAttributes.filter(isRecord)
    : [];
  const sizeAttribute = attributes.find((attribute) => {
    const definition = isRecord(attribute.attribute) ? attribute.attribute : {};
    return text(definition.name).toLowerCase() === "size";
  });
  return text(sizeAttribute?.value) || text(variant.name);
}

function loadProductVariations(slug: string): Promise<ProductVariation[]> {
  const cached = variationRequests.get(slug);
  if (cached) return cached;

  const request = fetchProductBySlug(slug, { auth: false }).then(
    (response: unknown) => {
      if (!isRecord(response) || response.success !== true || !isRecord(response.data)) {
        const message = isRecord(response) ? text(response.message) : "";
        throw new Error(message || "Product variations could not be loaded.");
      }

      const variants = Array.isArray(response.data.variants)
        ? response.data.variants.filter(isRecord)
        : [];
      const result = variants.flatMap((variant) => {
        const id = Number(variant.id);
        return Number.isInteger(id) && id > 0
          ? [{ id, label: variationLabel(variant) }]
          : [];
      });

      if (!result.length) {
        throw new Error("No purchasable product variations were found.");
      }
      return result;
    },
  );

  variationRequests.set(slug, request);
  void request.catch(() => variationRequests.delete(slug));
  return request;
}

export async function resolveProductVariationId(
  slug: string,
  preferredLabel?: string,
): Promise<number> {
  const variations = await loadProductVariations(slug);
  const normalizedLabel = preferredLabel ? normalizeLabel(preferredLabel) : "";
  if (!normalizedLabel) return variations[0].id;

  const matchingVariation = variations.find(
    (variation) => normalizeLabel(variation.label) === normalizedLabel,
  );
  if (matchingVariation) return matchingVariation.id;
  if (variations.length === 1) return variations[0].id;

  throw new Error(`The selected option "${preferredLabel}" is unavailable.`);
}
