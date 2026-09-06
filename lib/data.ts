import type { CSSProperties } from "react";
import type { Book, Category, Shelf, ShelfData, SpineCrop } from "./types";
import { CATEGORIES } from "./types";
import raw from "@/data/shelves.json";

/**
 * Loads the canonical shelf data from data/shelves.json.
 * Swap in real shelves by editing that file (and dropping photos in
 * public/shelves/) — no code changes required.
 */
export function getShelfData(): ShelfData {
  const data = raw as ShelfData;
  for (const shelf of data.shelves) {
    for (const book of shelf.books) {
      if (!CATEGORIES.includes(book.category)) {
        throw new Error(
          `Unknown category "${book.category}" on book ${book.id} (shelf ${shelf.id})`
        );
      }
    }
  }
  return data;
}

export interface LibraryStats {
  totalBooks: number;
  totalShelves: number;
  identified: number;
  unidentified: number;
  byCategory: Record<Category, number>;
}

export function getStats(data: ShelfData): LibraryStats {
  const byCategory = Object.fromEntries(
    CATEGORIES.map((c) => [c, 0])
  ) as Record<Category, number>;
  let identified = 0;
  let totalBooks = 0;

  for (const shelf of data.shelves) {
    for (const book of shelf.books) {
      totalBooks += 1;
      byCategory[book.category] += 1;
      if (book.identified) identified += 1;
    }
  }

  return {
    totalBooks,
    totalShelves: data.shelves.length,
    identified,
    unidentified: totalBooks - identified,
    byCategory,
  };
}

/**
 * Filter books by category + search query.
 * Empty shelves are dropped so filters never show empty voids.
 */
export function filterShelves(
  shelves: Shelf[],
  category: Category | "all",
  query = ""
): Shelf[] {
  const q = query.trim().toLowerCase();
  return shelves
    .map((shelf) => ({
      ...shelf,
      books: shelf.books.filter((b) => {
        if (category !== "all" && b.category !== category) return false;
        if (!q) return true;
        const hay = [b.title, b.author, b.spineLabel, b.notes]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      }),
    }))
    .filter((shelf) => shelf.books.length > 0);
}

export function bookMatchesQuery(book: Book, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [book.title, book.author, book.spineLabel, book.notes]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export interface SpineMetrics {
  /** Cover width (--book-w). */
  width: number;
  /** Cover/spine height (--book-h). */
  height: number;
  /** Spine thickness / slot depth (--book-d). */
  depth: number;
  /** Resting lean in degrees. */
  lean: number;
}

/**
 * Metrics for CSS 3D book meshes.
 * Slot width = depth; object size = width x height x depth.
 * Defaults ≈ 140 / 210 / 30 per REBUILD-SPEC.
 */
export function spineMetrics(book: Book): SpineMetrics {
  let hash = 0;
  for (let i = 0; i < book.id.length; i++) {
    hash = (hash * 31 + book.id.charCodeAt(i)) & 0xffff;
  }
  const height = 178 + (hash % 48); // 178–225
  const width = 118 + ((hash >> 2) % 36); // 118–153 cover width

  // Spine thickness from crop, or hash; denser continuous rows.
  let depth: number;
  if (book.spineCrop) {
    depth = Math.max(14, Math.min(42, Math.round(book.spineCrop.w * 5.6)));
  } else {
    depth = 16 + ((hash >> 4) % 20); // 16–35
  }

  const leanSeed = (hash >> 3) % 20;
  const lean = leanSeed < 5 ? ((hash >> 9) % 13) - 6 : 0; // −6…+6

  if (book.faceOut) {
    return { height, width: 96 + ((hash >> 4) % 28), depth, lean: -2 };
  }
  return { height, width, depth, lean };
}

/** CSS background props to show a % crop of a photo as the element face. */
export function spineCropBackground(
  photo: string,
  crop: SpineCrop
): CSSProperties {
  const sizeX = 100 / (crop.w / 100);
  const sizeY = 100 / (crop.h / 100);
  const posX = crop.w >= 99.9 ? 0 : (crop.x / (100 - crop.w)) * 100;
  const posY = crop.h >= 99.9 ? 0 : (crop.y / (100 - crop.h)) * 100;
  return {
    backgroundImage: `url(${photo})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${sizeX}% ${sizeY}%`,
    backgroundPosition: `${posX}% ${posY}%`,
  };
}

export type FlatBook = Book & {
  shelfId: string;
  shelfLabel: string;
  photo: string | null;
  /** 1-based position of the book on its shelf (left to right). */
  positionInShelf: number;
};

export function flattenBooks(shelves: Shelf[]): FlatBook[] {
  const out: FlatBook[] = [];
  for (const shelf of shelves) {
    shelf.books.forEach((book, i) => {
      out.push({
        ...book,
        shelfId: shelf.id,
        shelfLabel: shelf.label,
        photo: shelf.photo,
        positionInShelf: i + 1,
      });
    });
  }
  return out;
}
