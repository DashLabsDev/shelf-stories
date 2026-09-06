"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Book, Shelf } from "@/lib/types";
import BookSpine from "./BookSpine";

export default function ShelfRow({
  shelf,
  onSelect,
  showNav = true,
}: {
  shelf: Shelf;
  onSelect: (book: Book) => void;
  showNav?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const scrollingRef = useRef(false);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows, shelf.books.length]);

  /** Smooth page scroll without snap fighting; rAF-coalesce double-clicks. */
  const scrollByDir = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el || scrollingRef.current) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 4) return;

    const amount = Math.max(280, Math.floor(el.clientWidth * 0.85));
    const target = Math.max(0, Math.min(max, el.scrollLeft + dir * amount));
    if (Math.abs(target - el.scrollLeft) < 2) return;

    scrollingRef.current = true;
    el.scrollTo({ left: target, behavior: "smooth" });

    let frames = 0;
    let last = el.scrollLeft;
    const watch = () => {
      frames += 1;
      const cur = el.scrollLeft;
      if (
        Math.abs(cur - target) < 2 ||
        (frames > 8 && cur === last) ||
        frames > 90
      ) {
        scrollingRef.current = false;
        updateArrows();
        return;
      }
      last = cur;
      requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
  };

  if (shelf.books.length === 0) return null;

  const needsNav = showNav && shelf.books.length > 8;
  const n = shelf.books.length;

  return (
    <section aria-label={shelf.label} className="relative">
      <div className="shelf-bay">
        <div className="shelf-bay-inner">
          {needsNav && (
            <div className="shelf-nav">
              <button
                type="button"
                aria-label={`Scroll ${shelf.label} left`}
                disabled={!canPrev}
                onClick={() => scrollByDir(-1)}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                aria-label={`Scroll ${shelf.label} right`}
                disabled={!canNext}
                onClick={() => scrollByDir(1)}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          <div ref={railRef} className="book-row">
            {shelf.books.map((book) => (
              <BookSpine
                key={book.id}
                book={book}
                photo={shelf.photo}
                onClick={() => onSelect(book)}
              />
            ))}
          </div>
        </div>

        <div className="shelf-board">
          <p className="shelf-plaque">
            {shelf.label}
            <span className="mx-1.5 opacity-45">/</span>
            {n} {n === 1 ? "book" : "books"}
          </p>
        </div>
      </div>
    </section>
  );
}
