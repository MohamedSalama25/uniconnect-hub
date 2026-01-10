import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { API_CONFIG } from "./api.config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatImageUrl(url: string | undefined | null) {
  if (!url) return undefined;
  // Replace localhost URL with the configured BASE_URL if present
  return url.replace("https://localhost:7012", API_CONFIG.BASE_URL.replace(/\/$/, ""));
}
