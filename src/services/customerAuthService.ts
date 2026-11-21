import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { postData } from "./api/apiService";
import { API_BASE_URL } from "./api/config";
import { getNewAccessToken } from "./api/jwt";
import { tokenStorage } from "./api/storage";
import type { StoreUser } from "./redux/slices/userAuthSlice";

export type CustomerAuthResponse = {
  success: boolean;
  message?: string;
  data?: {
    profileCompleted?: boolean;
    nextStep?: "profile" | "email_otp" | null;
    user?: {
      id: number;
      firstName?: string | null;
      lastName?: string | null;
      email?: string | null;
      phoneNumber?: string;
      profileImage?: string | null;
    };
    accessToken?: string;
    refreshToken?: string;
  };
};

function saveAuthTokens(response: CustomerAuthResponse) {
  const { accessToken, refreshToken } = response.data ?? {};
  if (!response.success || !accessToken) {
    throw new Error(response.message || "Authentication failed");
  }
  tokenStorage.setAccessToken(accessToken);
  if (refreshToken) tokenStorage.setRefreshToken(refreshToken);
}

type AccessTokenPayload = {
  userRes?: {
    id?: unknown;
    firstName?: unknown;
    lastName?: unknown;
    email?: unknown;
    phoneNumber?: unknown;
    profileImage?: unknown;
  };
  exp?: unknown;
};

function decodeAccessTokenUser(token: string): StoreUser | null {
  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return null;

    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const binary = atob(paddedBase64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const payload = JSON.parse(
      new TextDecoder().decode(bytes),
    ) as AccessTokenPayload;
    const id = Number(payload.userRes?.id);
    const expiration = Number(payload.exp);

    if (
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      !Number.isFinite(expiration) ||
      expiration * 1000 <= Date.now()
    ) {
      return null;
    }

    const user = payload.userRes;
    return {
      id: String(id),
      firstName: typeof user?.firstName === "string" ? user.firstName : undefined,
      lastName: typeof user?.lastName === "string" ? user.lastName : undefined,
      email: typeof user?.email === "string" ? user.email : undefined,
      phoneNumber:
        typeof user?.phoneNumber === "string" ? user.phoneNumber : undefined,
      profileImage:
        typeof user?.profileImage === "string" ? user.profileImage : null,
    };
  } catch {
    return null;
  }
}

export const customerAuthService = {
  sendWhatsappOtp(phoneNumber: string): Promise<CustomerAuthResponse> {
    return postData<CustomerAuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.SEND_WHATSAPP_OTP,
      { phoneNumber },
      { auth: false },
    );
  },

  async verifyWhatsappOtp(phoneNumber: string, otp: string) {
    const response = await postData<CustomerAuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.VERIFY_WHATSAPP_OTP,
      { phoneNumber, otp },
      { auth: false },
    );
    if (response.data?.profileCompleted) saveAuthTokens(response);
    return response;
  },

  async completeProfile(payload: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<CustomerAuthResponse> {
    const response = await postData<CustomerAuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.COMPLETE_PROFILE,
      payload,
      { auth: false },
    );
    if (response.data?.profileCompleted) saveAuthTokens(response);
    return response;
  },

  async verifyEmailOtp(phoneNumber: string, otp: string) {
    const response = await postData<CustomerAuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.VERIFY_EMAIL_OTP,
      { phoneNumber, otp },
      { auth: false },
    );
    if (response.data?.profileCompleted) saveAuthTokens(response);
    return response;
  },

  resendEmailOtp(phoneNumber: string): Promise<CustomerAuthResponse> {
    return postData<CustomerAuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.RESEND_EMAIL_OTP,
      { phoneNumber },
      { auth: false },
    );
  },

  mapUser(user: NonNullable<CustomerAuthResponse["data"]>["user"]): StoreUser {
    if (!user) throw new Error("Authentication response did not include a user");
    return {
      id: String(user.id),
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      email: user.email ?? undefined,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
    };
  },

  async restoreUser(): Promise<StoreUser | null> {
    const accessToken = tokenStorage.getAccessToken();
    const userFromAccessToken = accessToken
      ? decodeAccessTokenUser(accessToken)
      : null;
    if (userFromAccessToken) return userFromAccessToken;

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      tokenStorage.clearTokens();
      return null;
    }

    const refreshedAccessToken = await getNewAccessToken(
      refreshToken,
      API_BASE_URL,
    );
    const userFromRefreshedToken = decodeAccessTokenUser(refreshedAccessToken);
    if (!userFromRefreshedToken) {
      tokenStorage.clearTokens();
      throw new Error("The refreshed login session was invalid.");
    }
    return userFromRefreshedToken;
  },

  logout() {
    tokenStorage.clearTokens();
  },
};
