import Cookies from "js-cookie";

export const STORAGE_KEYS = {
  accessToken: "decor_access_token",
  refreshToken: "decor_refresh_token",
  sessionId: "decor_session_id",
} as const;

const cookieOptions = {
  expires: 7,
  path: "/",
  sameSite: "lax" as const,
};

export const tokenStorage = {
  getAccessToken: () => Cookies.get(STORAGE_KEYS.accessToken) ?? null,
  setAccessToken: (token: string) =>
    Cookies.set(STORAGE_KEYS.accessToken, token, cookieOptions),
  getRefreshToken: () => Cookies.get(STORAGE_KEYS.refreshToken) ?? null,
  setRefreshToken: (token: string) =>
    Cookies.set(STORAGE_KEYS.refreshToken, token, cookieOptions),
  clearTokens: () => {
    Cookies.remove(STORAGE_KEYS.accessToken, { path: "/" });
    Cookies.remove(STORAGE_KEYS.refreshToken, { path: "/" });
  },
};

export function getSessionId(): string | null {
  if (typeof window === "undefined") return null;

  let sessionId = window.localStorage.getItem(STORAGE_KEYS.sessionId);
  if (!sessionId) {
    sessionId =
      typeof window.crypto?.randomUUID === "function"
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
  }
  return sessionId;
}
