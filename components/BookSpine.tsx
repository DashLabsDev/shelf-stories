"use client";

import type { Book } from "@/lib/types";
import { spineMetrics } from "@/lib/data";

/** Pick readable text color for a hex background. */
function textColorFor(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 150 ? "rgba(30,25,20,0.85)" : "rgba(250,247,240,0.92)";
}

export default function BookSpine({
  book,
  onClick,
}: {
  book: Book;
  onClick: () => void;
}) {
  const { height, width } = spineMetrics(book);
  const label = book.identified ? book.title ?? book.spineLabel : book.spineLabel;

  return (
    <button
      onClick={onClick}
      title={book.identified ? `${book.title} — ${book.author}` : "Unidentified spine"}
      aria-label={
        book.identified
          ? `${book.title} by ${book.author}`
          : `Unidentified book, spine reads ${book.spineLabel}`
      }
      className={`group relative shrink-0 rounded-t-sm shadow-spine outline-offset-2 transition-transform duration-150 ease-out hover:-translate-y-3 focus-visible:-translate-y-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brass ${
        book.identified ? "" : "opacity-90"
      }`}
      style={{ height, width, backgroundColor: book.color }}
    >
      <span
        className="spine-text absolute inset-0 flex items-center justify-center overflow-hidden px-1 py-2 text-[11px] font-medium leading-none tracking-wide"
        style={{ color: textColorFor(book.color) }}
      >
        <span className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      </span>

      {!book.identified && (
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full border border-brass bg-parchment px-1 text-[10px] leading-4 text-walnut-dark shadow-sm"
        >
          ?
        </span>
      )}

      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-full rounded-t-sm bg-gradient-to-b from-white/10 via-transparent to-black/15"
      />
    </button>
  );
}
