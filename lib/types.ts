/**
 * Canonical types for Shelf Stories data.
 * Mirrors the schema of data/shelves.json — keep the two in sync.
 */

export const CATEGORIES = [
  "fiction",
  "fantasy-horror",
  "crime-mystery",
  "nonfiction",
  "unidentified",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  fiction: "Fiction",
  "fantasy-horror": "Fantasy & horror",
  "crime-mystery": "Crime & mystery",
  nonfiction: "Nonfiction",
  unidentified: "Unidentified",
};

/** Crop region as percentages (0–100) of the shelf photo. */
export interface SpineCrop {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Book {
  /** Stable unique id, e.g. "bk-014". */
  id: string;
  /** Full title, or null when the spine has not been identified yet. */
  title: string | null;
  /** Author name, or null when unidentified. */
  author: string | null;
  category: Category;
  /** Text as it appears (or partially appears) on the spine. */
  spineLabel: string;
  /** False for spines that have not been matched to a real book yet. */
  identified: boolean;
  /** Spine color as a CSS hex value, sampled from the photo or chosen for demo data. */
  color: string;
  /** Optional freeform note (condition, provenance, legibility, ...). */
  notes?: string;
  /** Optional crop of the shelf photo used as the spine face. */
  spineCrop?: SpineCrop;
}

export interface Shelf {
  /** Stable unique id, e.g. "shelf-1". */
  id: string;
  /** Human-friendly shelf name shown as the shelf heading. */
  label: string;
  /**
   * Path to the shelf photo under public/, e.g. "/shelves/shelf-1.jpg".
   * Null when no photo exists yet (demo data). The UI renders spines either way.
   */
  photo: string | null;
  /** Books in left-to-right spine order. */
  books: Book[];
}

export interface ShelfData {
  /** Path to main hero photo under public/, e.g. "/hero.jpg". Null when not set. */
  heroPhoto: string | null;
  /** True while the bundled sample data is in use; flip to false for real shelves. */
  demo: boolean;
  shelves: Shelf[];
}
