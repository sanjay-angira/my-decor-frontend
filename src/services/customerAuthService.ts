import { API_ENDPOINTS } from "./api/API_ENDPOINT";
import { postData } from "./api/apiService";
import { tokenStorage } from "./api/storage";
import type { StoreUser } from "./redux/slices/userAuthSlice";

type AuthResponse = {
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

function saveAuthTokens(response: AuthResponse) {
  const { accessToken, refreshToken } = response.data ?? {};
  if (!response.success || !accessToken) {
    throw new Error(response.message || "Authentication failed");
  }
  tokenStorage.setAccessToken(accessToken);
  if (refreshToken) tokenStorage.setRefreshToken(refreshToken);
}

export const customerAuthService = {
  sendWhatsappOtp(phoneNumber: string) {
    return postData(
      API_ENDPOINTS.CUSTOMER_AUTH.SEND_WHATSAPP_OTP,
      { phoneNumber },
      { auth: false },
    );
  },

  async verifyWhatsappOtp(phoneNumber: string, otp: string) {
    const response = await postData<AuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.VERIFY_WHATSAPP_OTP,
      { phoneNumber, otp },
      { auth: false },
    );
    if (response.data?.profileCompleted) saveAuthTokens(response);
    return response;
  },

  completeProfile(payload: {
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  }) {
    return postData<AuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.COMPLETE_PROFILE,
      payload,
      { auth: false },
    );
  },

  async verifyEmailOtp(phoneNumber: string, otp: string) {
    const response = await postData<AuthResponse>(
      API_ENDPOINTS.CUSTOMER_AUTH.VERIFY_EMAIL_OTP,
      { phoneNumber, otp },
      { auth: false },
    );
    if (response.data?.profileCompleted) saveAuthTokens(response);
    return response;
  },

  resendEmailOtp(phoneNumber: string) {
    return postData(
      API_ENDPOINTS.CUSTOMER_AUTH.RESEND_EMAIL_OTP,
      { phoneNumber },
      { auth: false },
    );
  },

  mapUser(user: NonNullable<AuthResponse["data"]>["user"]): StoreUser {
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

  logout() {
    tokenStorage.clearTokens();
  },
};
