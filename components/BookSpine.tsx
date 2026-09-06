"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import type { Book } from "@/lib/types";
import { spineMetrics } from "@/lib/data";
import BookCover, { textColorFor } from "./BookCover";

type TipSide = "right" | "left" | "above";

/** Shorten long spine labels so vertical text stays readable. */
function spineTitle(book: Book): string {
  const raw = book.identified
    ? book.title ?? book.spineLabel
    : book.spineLabel;
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 42) return cleaned;
  return cleaned.slice(0, 40).trimEnd() + "…";
}

export default function BookSpine({
  book,
  onClick,
}: {
  book: Book;
  photo?: string | null;
  onClick: () => void;
}) {
  const { height, width, depth, lean } = spineMetrics(book);
  const faceOut = Boolean(book.faceOut);
  const label = spineTitle(book);
  const tipTitle = book.identified
    ? book.title ?? book.spineLabel
    : "Unidentified spine";
  const tipSub = book.identified
    ? book.author ?? "Author unknown"
    : "Needs a closer look";
  const ink = textColorFor(book.color);

  const slotRef = useRef<HTMLDivElement>(null);
  const [tipSide, setTipSide] = useState<TipSide>("right");

  const placeTip = useCallback(() => {
    const el = slotRef.current;
    if (!el) return;
    const bay = el.closest(".book-row") as HTMLElement | null;
    const slotRect = el.getBoundingClientRect();
    const bayRect = bay?.getBoundingClientRect();
    const tipW = 240;
    const tipH = 64;
    const pad = 10;

    const spaceRight = bayRect
      ? bayRect.right - slotRect.right
      : window.innerWidth - slotRect.right;
    const spaceLeft = bayRect
      ? slotRect.left - bayRect.left
      : slotRect.left;
    const spaceAbove = bayRect
      ? slotRect.top - bayRect.top
      : slotRect.top;

    if (spaceRight >= tipW + pad) {
      setTipSide("right");
    } else if (spaceLeft >= tipW + pad) {
      setTipSide("left");
    } else if (spaceAbove >= tipH + pad) {
      setTipSide("above");
    } else {
      setTipSide(spaceLeft > spaceRight ? "left" : "right");
    }
  }, []);

  const cssVars = {
    ["--book-w" as string]: `${width}px`,
    ["--book-h" as string]: `${height}px`,
    ["--book-d" as string]: `${depth}px`,
    ["--book-lean" as string]: `${lean}deg`,
    ["--book-color" as string]: book.color,
  } as CSSProperties;

  const tipClass =
    tipSide === "left"
      ? "book-tip book-tip--left"
      : tipSide === "above"
        ? "book-tip book-tip--above"
        : "book-tip";

  return (
    <div
      ref={slotRef}
      className={`book-slot${faceOut ? " book-slot--faceout" : ""}`}
      style={cssVars}
      onMouseEnter={placeTip}
      onFocus={placeTip}
    >
      <button
        type="button"
        className="book-object outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sage"
        onClick={onClick}
        aria-label={
          book.identified
            ? `Open ${book.title ?? book.spineLabel}${book.author ? ` by ${book.author}` : ""}`
            : `Open unidentified book, spine reads ${book.spineLabel}`
        }
      >
        <span className="book-face book-face--front" aria-hidden>
          <BookCover book={book} />
        </span>

        {/* Spine: solid sampled color + CLEAN typographic text (never photo-garbled) */}
        <span
          className="book-face book-face--spine"
          style={{ backgroundColor: book.color }}
          aria-hidden
        >
          <span className="spine-label" style={{ color: ink }}>
            <span className="spine-label__title" title={label}>
              {label}
            </span>
            <span className="spine-label__mark">s.</span>
          </span>
        </span>

        <span className="book-face book-face--back" aria-hidden />
        <span className="book-face book-face--pages" aria-hidden />
        <span className="book-face book-face--top" aria-hidden />
        <span className="book-face book-face--bottom" aria-hidden />

        {!book.identified && (
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 z-[2] rounded-full border border-sage/50 bg-parchment px-1 text-[10px] leading-4 text-walnut-dark shadow-sm"
            style={{ transform: "translateX(-50%) translateZ(20px)" }}
          >
            ?
          </span>
        )}
      </button>

      <div className={tipClass} role="tooltip">
        <strong>{tipTitle}</strong>
        <span>{tipSub}</span>
      </div>
    </div>
  );
}
