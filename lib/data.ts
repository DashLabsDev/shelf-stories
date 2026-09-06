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
 * Lean + depth tuned for denser photoreal variation.
 */
export function spineMetrics(book: Book): SpineMetrics {
  let hash = 0;
  for (let i = 0; i < book.id.length; i++) {
    hash = (hash * 31 + book.id.charCodeAt(i)) & 0xffff;
  }
  // Varied heights for organic top line (ref: dense photoreal spines)
  const height = 168 + (hash % 58); // 168–225
  const width = 118 + ((hash >> 2) % 38); // 118–155 cover width

  // Chunkier hardcover/paperback depths — never wafer-thin paper.
  // Floor 22px pamphlets / 24px books; typical 26–36; hefty to ~44.
  let depth: number;
  if (book.spineCrop) {
    depth = Math.round(22 + book.spineCrop.w * 1.55 + ((hash >> 3) % 4));
  } else {
    depth = 26 + ((hash >> 4) % 12); // 26–37
  }
  const isPamphlet =
    !book.identified ||
    /reader|papers|binder|curriculum|envelopes/i.test(book.spineLabel);
  const floor = isPamphlet ? 22 : 24;
  depth = Math.max(floor, Math.min(44, depth));

  // Lived-in lean (~40% lean lightly; occasional stronger)
  const leanRoll = hash % 100;
  let lean = 0;
  if (leanRoll < 40) {
    const mag = 1 + ((hash >> 6) % 5); // 1–5°
    lean = (hash >> 9) % 2 === 0 ? -mag : mag;
    if (leanRoll < 8) lean = lean > 0 ? lean + 2 : lean - 2;
  }

  if (book.faceOut) {
    return {
      height: Math.max(height, 196),
      width: 110 + ((hash >> 4) % 28),
      depth: Math.max(depth, 30),
      lean: lean === 0 ? -2 : Math.max(-5, Math.min(3, lean)),
    };
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
  // Clamp positions so narrow crops don't drift off-edge
  const denomX = Math.max(0.01, 100 - crop.w);
  const denomY = Math.max(0.01, 100 - crop.h);
  const posX = crop.w >= 99.9 ? 0 : Math.max(0, Math.min(100, (crop.x / denomX) * 100));
  const posY = crop.h >= 99.9 ? 0 : Math.max(0, Math.min(100, (crop.y / denomY) * 100));
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
