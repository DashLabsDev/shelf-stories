import type { Book } from "@/lib/types";

/** Ink or cream, whichever reads against the given spine color. */
export function textColorFor(hex: string): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 150 ? "rgba(42,36,28,0.82)" : "rgba(247,243,236,0.92)";
}

/**
 * Typographic front cover from sampled spine color.
 * Original design — never a cloned asset. Spine imagery stays from Thomas photos.
 */
export default function BookCover({ book }: { book: Book }) {
  const color = textColorFor(book.color);
  const title = book.identified ? book.title ?? book.spineLabel : book.spineLabel;
  return (
    <span
      className="flex h-full w-full flex-col overflow-hidden p-[7%] text-center"
      style={{
        backgroundColor: book.color,
        color,
        backgroundImage:
          "linear-gradient(155deg, rgba(255,255,255,0.18), transparent 40%), linear-gradient(90deg, rgba(0,0,0,0.22), transparent 10%, transparent 90%, rgba(0,0,0,0.26))",
      }}
    >
      <span
        className="flex min-h-0 flex-1 flex-col items-center justify-between px-1.5 py-2.5"
        style={{ border: `1px solid ${color}`, opacity: 0.96 }}
      >
        <span aria-hidden className="text-[9px] tracking-[0.3em] opacity-60">
          ···
        </span>
        <span className="font-display text-[13px] leading-snug [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5] overflow-hidden">
          {title}
        </span>
        <span className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[9px] uppercase tracking-[0.14em] opacity-75">
          {book.identified ? book.author ?? "" : "Unidentified"}
        </span>
      </span>
    </span>
  );
}
