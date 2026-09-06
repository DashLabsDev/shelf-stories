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
  return luminance > 150 ? "rgba(42,36,28,0.82)" : "rgba(247,243,236,0.92)";
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
      title={book.identified ? `${book.title} — ${book.author ?? "Unknown"}` : "Unidentified spine"}
      aria-label={
        book.identified
          ? `${book.title}${book.author ? ` by ${book.author}` : ""}`
          : `Unidentified book, spine reads ${book.spineLabel}`
      }
      className={`group relative shrink-0 rounded-t-[3px] shadow-spine outline-offset-2 transition-transform duration-200 ease-out hover:-translate-y-2.5 focus-visible:-translate-y-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage ${
        book.identified ? "" : "opacity-90"
      }`}
      style={{ height, width, backgroundColor: book.color }}
    >
      {/* paper / cloth texture hint */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-t-[3px] opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.04) 2px, rgba(255,255,255,0.04) 3px), linear-gradient(180deg, rgba(255,255,255,0.14), transparent 30%, transparent 70%, rgba(0,0,0,0.18))",
        }}
      />

      {/* edge bevels */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-[2px] bg-gradient-to-r from-white/25 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-[3px] bg-gradient-to-l from-black/30 to-transparent"
      />

      <span
        className="spine-text absolute inset-0 z-[1] flex items-center justify-center overflow-hidden px-1 py-3 font-display text-[10px] font-medium leading-none tracking-wide sm:text-[11px]"
        style={{ color: textColorFor(book.color) }}
      >
        <span className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap">
          {label}
        </span>
      </span>

      {!book.identified && (
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 z-[2] -translate-x-1/2 rounded-full border border-sage/50 bg-parchment px-1 text-[10px] leading-4 text-walnut-dark shadow-sm"
        >
          ?
        </span>
      )}
    </button>
  );
}
