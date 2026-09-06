"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Book, Shelf } from "@/lib/types";
import BookSpine from "./BookSpine";

export default function ShelfRow({
  shelf,
  onSelect,
}: {
  shelf: Shelf;
  onSelect: (book: Book) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
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
    const amount = Math.max(220, Math.floor(el.clientWidth * 0.7));
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (shelf.books.length === 0) return null;

  return (
    <section aria-label={shelf.label} className="relative">
      <div className="mb-2 flex items-center justify-end gap-2 pr-1">
        <button
          type="button"
          aria-label={`Scroll ${shelf.label} left`}
          disabled={!canPrev}
          onClick={() => scrollByDir(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink/70 shadow-soft transition enabled:hover:border-sage/40 enabled:hover:bg-sage-muted enabled:hover:text-ink disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          aria-label={`Scroll ${shelf.label} right`}
          disabled={!canNext}
          onClick={() => scrollByDir(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink/70 shadow-soft transition enabled:hover:border-sage/40 enabled:hover:bg-sage-muted enabled:hover:text-ink disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="shelf-frame shelf-recess">
        <div className="shelf-back relative">
          <div
            ref={railRef}
            className="spine-rail relative z-[1] flex snap-x snap-mandatory items-end gap-px overflow-x-auto overflow-y-visible scroll-smooth px-4 pb-0 pt-8 sm:px-6"
          >
            {shelf.books.map((book) => (
              <div key={book.id} className="snap-start shrink-0">
                <BookSpine
                  book={book}
                  photo={shelf.photo}
                  onClick={() => onSelect(book)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="shelf-ledge" />
      </div>

      <div className="mt-3 flex justify-center">
        <p className="rounded-full bg-ink/70 px-3 py-1 text-[11px] tracking-wide text-parchment/90">
          {shelf.label}
          <span className="mx-1.5 text-parchment/40">/</span>
          {shelf.books.length} {shelf.books.length === 1 ? "book" : "books"}
        </p>
      </div>
    </section>
  );
}
