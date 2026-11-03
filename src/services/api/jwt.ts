import axios from "axios";
import { API_ENDPOINTS } from "./API_ENDPOINT";
import { tokenStorage } from "./storage";

export async function getNewAccessToken(
  refreshToken: string,
  apiBaseUrl: string,
): Promise<string> {
  try {
    const response = await axios.post(
      `${apiBaseUrl}/${API_ENDPOINTS.CUSTOMER_AUTH.REFRESH_TOKEN}`,
      { refreshToken },
      { headers: { "Content-Type": "application/json" } },
    );
    const accessToken = response.data?.data?.accessToken;
    const nextRefreshToken = response.data?.data?.refreshToken;
    if (
      typeof accessToken !== "string" ||
      typeof nextRefreshToken !== "string"
    ) {
      throw new Error("Refresh token response was invalid");
    }

    tokenStorage.setAccessToken(accessToken);
    tokenStorage.setRefreshToken(nextRefreshToken);
    return accessToken;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      [401, 403].includes(error.response?.status ?? 0)
    ) {
      tokenStorage.clearTokens();
    }
    throw error;
  }
}
