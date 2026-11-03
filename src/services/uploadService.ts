import { axiosInstance } from "./api/config";
import { API_ENDPOINTS } from "./api/API_ENDPOINT";

export type UploadResponse = {
  success: boolean;
  message?: string;
  data?: {
    Location?: string;
    Key?: string;
    Bucket?: string;
    [key: string]: unknown;
  };
};

export async function uploadFile(
  file: File,
  path?: string,
): Promise<UploadResponse["data"]> {
  const formData = new FormData();
  formData.append("file", file, file.name);
  if (path) formData.append("path", path.replace(/^\/+|\/+$/g, ""));

  const response = await axiosInstance.post<UploadResponse>(
    API_ENDPOINTS.UPLOAD,
    formData,
    { headers: { "Content-Type": undefined } },
  );
  if (!response.data.success || !response.data.data?.Location) {
    throw new Error(response.data.message || "Upload failed");
  }
  return response.data.data;
}

export async function deleteUploadedFile(url: string): Promise<void> {
  const response = await axiosInstance.delete<UploadResponse>(
    API_ENDPOINTS.UPLOAD,
    { data: { url } },
  );
  if (!response.data.success) {
    throw new Error(response.data.message || "Could not delete uploaded file");
  }
}
