import type { Book, Category, Shelf, ShelfData } from "./types";
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

export function filterShelves(
  shelves: Shelf[],
  category: Category | "all"
): Shelf[] {
  if (category === "all") return shelves;
  return shelves.map((shelf) => ({
    ...shelf,
    books: shelf.books.filter((b) => b.category === category),
  }));
}

/**
 * Deterministic pseudo-random helpers so spine heights/widths vary
 * naturally but render identically on server and client.
 */
export function spineMetrics(book: Book): { height: number; width: number } {
  let hash = 0;
  for (let i = 0; i < book.id.length; i++) {
    hash = (hash * 31 + book.id.charCodeAt(i)) & 0xffff;
  }
  const height = 168 + (hash % 56); // 168–223 px
  const width = 34 + ((hash >> 4) % 22); // 34–55 px
  return { height, width };
}
