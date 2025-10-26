import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE; // e.g. https://simply-yaswanth.onrender.com

export const api = axios.create({ baseURL: `${API_BASE}/api` });

export function setToken(token?: string) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export function resolvePublicUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const baseCandidates = [
    API_BASE,
    typeof window !== "undefined" ? window.location.origin : undefined,
  ].filter((candidate): candidate is string => Boolean(candidate));

  for (const base of baseCandidates) {
    try {
      return new URL(url, base).toString();
    } catch {
      // fall through to next base candidate
    }
  }
  return url;
}

type UploadResponse = {
  file_id: string;
  public_url?: string;
  public_path?: string;
};

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await api.post<UploadResponse>("/uploads", formData);
  const url =
    resolvePublicUrl(data.public_url) ??
    resolvePublicUrl(data.public_path) ??
    data.public_url ??
    data.public_path;
  if (!url) {
    throw new Error("Upload failed: missing public URL");
  }
  return url;
}
