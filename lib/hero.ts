import fs from "fs";
import path from "path";
import type { ShelfData } from "./types";

/**
 * Resolve the main hero image: explicit heroPhoto, else public/hero.{jpg,webp,png}.
 * Server-only — do not import from client components.
 */
export function resolveHeroPhoto(data: ShelfData): string | null {
  if (data.heroPhoto) return data.heroPhoto;
  for (const name of ["hero.jpg", "hero.webp", "hero.png"] as const) {
    if (fs.existsSync(path.join(process.cwd(), "public", name))) {
      return `/${name}`;
    }
  }
  return null;
}
