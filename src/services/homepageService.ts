import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import type { ApiSuccessResponse } from "./api/errors";

export type HomepageBanner = {
  id: string;
  source: "offer" | "category";
  title: string;
  subtitle: string;
  image: string | null;
  desktopImage: string | null;
  tabletImage: string | null;
  mobileImage: string | null;
  link: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080/backend/api";

export async function fetchHomepageBanners(): Promise<HomepageBanner[]> {
  const response = await fetch(
    `${API_BASE_URL}/${API_ENDPOINTS.CUSTOMER.BANNERS}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(
      `Homepage banners request failed with status ${response.status}.`,
    );
  }

  const payload = (await response.json()) as ApiSuccessResponse<
    HomepageBanner[]
  >;
  if (!payload.success || !Array.isArray(payload.data)) {
    throw new Error("Homepage banners response was invalid.");
  }

  return payload.data;
}
