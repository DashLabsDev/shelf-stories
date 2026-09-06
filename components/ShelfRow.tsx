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

  const scrollByDir = (dir: -1 | 1) => {
    const el = railRef.current;
    if (!el) return;
    const amount = Math.max(280, Math.floor(el.clientWidth * 0.85));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (shelf.books.length === 0) return null;

  const needsNav = showNav && shelf.books.length > 8;

  return (
    <section aria-label={shelf.label} className="relative">
      <div className="shelf-bay">
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

        <div className="shelf-board">
          <p className="shelf-plaque">
            {shelf.label}
            <span className="mx-1.5 opacity-40">/</span>
            {shelf.books.length} {shelf.books.length === 1 ? "book" : "books"}
          </p>
        </div>
      </div>
    </section>
  );
}
