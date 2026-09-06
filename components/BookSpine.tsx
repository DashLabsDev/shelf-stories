"use client";

import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
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

    let next: TipSide;
    if (spaceRight >= tipW + pad) {
      next = "right";
    } else if (spaceLeft >= tipW + pad) {
      next = "left";
    } else if (spaceAbove >= tipH + pad) {
      next = "above";
    } else {
      next = spaceLeft > spaceRight ? "left" : "right";
    }
    setTipSide((prev) => (prev === next ? prev : next));
  }, []);

  /** Reliable open — slot hit area, not the 3D mesh (avoids miss-clicks). */
  const open = useCallback(
    (e?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      onClick();
    },
    [onClick]
  );

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
  };

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

  const aria = book.identified
    ? `Open ${book.title ?? book.spineLabel}${book.author ? ` by ${book.author}` : ""}`
    : `Open unidentified book, spine reads ${book.spineLabel}`;

  return (
    <div
      ref={slotRef}
      className={`book-slot${faceOut ? " book-slot--faceout" : ""}`}
      style={cssVars}
      role="button"
      tabIndex={0}
      aria-label={aria}
      onMouseEnter={placeTip}
      onFocus={placeTip}
      onClick={open}
      onKeyDown={onKey}
    >
      <span className="book-slot__shadow" aria-hidden />

      {/* Visual-only 3D mesh — pointer-events none so clicks hit the slot */}
      <div className="book-object" aria-hidden>
        <span className="book-face book-face--front">
          <BookCover book={book} />
        </span>

        <span
          className="book-face book-face--spine"
          style={{ backgroundColor: book.color }}
        >
          <span className="spine-label" style={{ color: ink }}>
            <span className="spine-label__title" title={label}>
              {label}
            </span>
            <span className="spine-label__mark">s.</span>
          </span>
        </span>

        <span className="book-face book-face--back" />
        <span className="book-face book-face--pages" />
        <span className="book-face book-face--top" />
        <span className="book-face book-face--bottom" />

        {!book.identified && (
          <span
            className="absolute -top-2 left-1/2 z-[2] rounded-full border border-sage/50 bg-parchment px-1 text-[10px] leading-4 text-walnut-dark shadow-sm"
            style={{ transform: "translateX(-50%) translateZ(20px)" }}
          >
            ?
          </span>
        )}
      </div>

      <div className={tipClass} role="tooltip">
        <strong>{tipTitle}</strong>
        <span>{tipSub}</span>
      </div>
    </div>
  );
}
