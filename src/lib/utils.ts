import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_CONFIG } from "./api.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageUrl(url: string | undefined | null) {
  if (!url) return undefined;

  // Clean base URL (remove trailing slash)
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");

  // If it's a relative path (starts with /), prepend base URL
  if (url.startsWith("/")) {
    return `${baseUrl}${url}`;
  }

  // Replace localhost URL if present
  return url.replace("https://localhost:7012", baseUrl);
}

export function formatDate(date: string | Date | undefined | null) {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "Invalid Date";
  return d.toISOString().split("T")[0];
}

export function formatDateArabic(date: string | Date | undefined | null) {
  if (!date) return "غير متوفر";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "تاريخ غير صالح";
  return d.toLocaleDateString("ar-EG", {
    month: "long",
    year: "numeric",
  });
}

export function extractRelativeImageUrl(url: string | undefined | null): string {
  if (!url) return "";

  // Clean base URL (remove trailing slash)
  const baseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");

  let relativePath = url;

  if (url.startsWith(baseUrl)) {
    relativePath = url.replace(baseUrl, "");
  } else if (url.includes("localhost:7012")) {
    relativePath = url.replace("https://localhost:7012", "");
  } else if (url.startsWith("http")) {
    try {
      const urlObj = new URL(url);
      relativePath = urlObj.pathname;
    } catch {
      relativePath = url;
    }
  }

  // Remove leading slash if exists
  return relativePath.replace(/^\//, "");
}
