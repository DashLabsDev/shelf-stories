"use client";

import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Book } from "@/lib/types";
import { spineCropBackground, spineMetrics } from "@/lib/data";

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
  photo,
  onClick,
}: {
  book: Book;
  photo?: string | null;
  onClick: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [tip, setTip] = useState<{ left: number; top: number } | null>(null);
  const { height, width } = spineMetrics(book);
  const hasCrop = Boolean(photo && book.spineCrop);
  const label = book.identified ? book.title ?? book.spineLabel : book.spineLabel;
  const previewTitle = book.identified
    ? book.title ?? book.spineLabel
    : "Unidentified spine";
  const previewSub = book.identified
    ? book.author ?? "Author unknown"
    : "Needs a closer look";

  const faceStyle = hasCrop
    ? { ...spineCropBackground(photo!, book.spineCrop!), height, width }
    : { backgroundColor: book.color, height, width };

  const showTip = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setTip({
      left: r.left + r.width / 2,
      top: r.top - 10,
    });
  }, []);

  const hideTip = useCallback(() => setTip(null), []);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={onClick}
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        onFocus={showTip}
        onBlur={hideTip}
        aria-label={
          book.identified
            ? `${book.title}${book.author ? ` by ${book.author}` : ""}`
            : `Unidentified book, spine reads ${book.spineLabel}`
        }
        className="spine-btn group relative z-0 shrink-0 origin-bottom outline-offset-2 focus-visible:z-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
        style={faceStyle}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-t-[2px]"
          style={{
            backgroundImage: hasCrop
              ? "linear-gradient(90deg, rgba(0,0,0,0.32), transparent 16%, transparent 84%, rgba(0,0,0,0.38)), linear-gradient(180deg, rgba(255,255,255,0.2), transparent 20%, transparent 75%, rgba(0,0,0,0.28))"
              : "repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 3px), linear-gradient(90deg, rgba(255,255,255,0.24), transparent 12%, transparent 88%, rgba(0,0,0,0.34)), linear-gradient(180deg, rgba(255,255,255,0.18), transparent 26%, transparent 70%, rgba(0,0,0,0.24))",
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-1 left-[8%] right-[8%] h-2 rounded-full bg-black/35 opacity-50 blur-[3px] transition-all duration-300 group-hover:left-[2%] group-hover:right-[2%] group-hover:opacity-70 group-hover:blur-[5px]"
        />

        {!hasCrop && (
          <span
            className="spine-text absolute inset-0 z-[1] flex items-center justify-center overflow-hidden px-0.5 py-3 font-display text-[10px] font-medium leading-none tracking-wide sm:text-[11px]"
            style={{ color: textColorFor(book.color) }}
          >
            <span className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap">
              {label}
            </span>
          </span>
        )}

        {!book.identified && (
          <span
            aria-hidden
            className="absolute -top-1.5 left-1/2 z-[2] -translate-x-1/2 rounded-full border border-sage/50 bg-parchment px-1 text-[10px] leading-4 text-walnut-dark shadow-sm"
          >
            ?
          </span>
        )}
      </button>

      {tip &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-[100] w-max max-w-[240px] -translate-x-1/2 -translate-y-full rounded-xl border border-ink/10 bg-parchment px-3.5 py-2.5 shadow-[0_12px_28px_-8px_rgba(42,36,28,0.45)]"
            style={{ left: tip.left, top: tip.top }}
          >
            <p className="font-display text-[15px] leading-snug text-ink">
              {previewTitle}
            </p>
            <p className="mt-0.5 text-xs text-ink/55">{previewSub}</p>
          </div>,
          document.body
        )}
    </>
  );
}
