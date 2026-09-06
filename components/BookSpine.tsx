"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import type { Book } from "@/lib/types";
import { spineCropBackground, spineMetrics } from "@/lib/data";
import BookCover, { textColorFor } from "./BookCover";

type TipSide = "right" | "left" | "above";

export default function BookSpine({
  book,
  photo,
  onClick,
}: {
  book: Book;
  photo?: string | null;
  onClick: () => void;
}) {
  const { height, width, depth, lean } = spineMetrics(book);
  const faceOut = Boolean(book.faceOut);
  const hasCrop = Boolean(photo && book.spineCrop);
  const label = book.identified ? book.title ?? book.spineLabel : book.spineLabel;
  const tipTitle = book.identified
    ? book.title ?? book.spineLabel
    : "Unidentified spine";
  const tipSub = book.identified
    ? book.author ?? "Author unknown"
    : "Needs a closer look";

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
      // Prefer the side with more room inside the bay
      setTipSide(spaceLeft > spaceRight ? "left" : "right");
    }
  }, []);

  const spineStyle: CSSProperties = hasCrop
    ? { ...spineCropBackground(photo!, book.spineCrop!), backgroundColor: book.color }
    : { backgroundColor: book.color };

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
        {/* front / cover */}
        <span className="book-face book-face--front" aria-hidden>
          <BookCover book={book} />
        </span>

        {/* spine */}
        <span className="book-face book-face--spine" style={spineStyle} aria-hidden>
          {!hasCrop && (
            <span
              className="spine-text absolute inset-0 z-[1] flex items-center justify-center overflow-hidden px-0.5 py-3 font-display text-[11px] font-medium leading-none tracking-wide"
              style={{ color: textColorFor(book.color), maxHeight: "calc(100% - 42px)" }}
            >
              <span className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap">
                {label}
              </span>
            </span>
          )}
        </span>

        {/* back */}
        <span className="book-face book-face--back" aria-hidden />

        {/* pages (fore-edge) */}
        <span className="book-face book-face--pages" aria-hidden />

        {/* top */}
        <span className="book-face book-face--top" aria-hidden />

        {/* bottom */}
        <span className="book-face book-face--bottom" aria-hidden />

        {!book.identified && (
          <span
            aria-hidden
            className="absolute -top-2 left-1/2 z-[2] -translate-x-1/2 rounded-full border border-sage/50 bg-parchment px-1 text-[10px] leading-4 text-walnut-dark shadow-sm"
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
