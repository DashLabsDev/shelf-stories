"use client";

import { useEffect, useRef, useState } from "react";
import type { FlatBook } from "@/lib/data";
import { spineCropBackground } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import BookCover, { textColorFor } from "./BookCover";

function searchQuery(book: FlatBook): string {
  const parts = [book.title, book.author].filter(Boolean) as string[];
  return encodeURIComponent(parts.join(" "));
}

export default function BookModal({
  books,
  index,
  onClose,
  onNavigate,
}: {
  books: FlatBook[];
  index: number;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [showSpine, setShowSpine] = useState(false);
  const book = books[index];
  const hasPrev = index > 0;
  const hasNext = index < books.length - 1;
  const hasCrop = Boolean(book?.photo && book?.spineCrop);
  const q = book ? searchQuery(book) : "";

  useEffect(() => {
    setShowSpine(false);
    closeRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowLeft" && hasPrev) {
        e.preventDefault();
        onNavigate(index - 1);
      }
      if (e.key === "ArrowRight" && hasNext) {
        e.preventDefault();
        onNavigate(index + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onNavigate, index, hasPrev, hasNext]);

  if (!book) return null;

  const spineFace = hasCrop
    ? spineCropBackground(book.photo!, book.spineCrop!)
    : { backgroundColor: book.color };

  return (
    <div
      className="detail-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={book.title ?? "Unidentified book"}
    >
      <div
        className="detail-dialog relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: 3D stage */}
        <div className="detail-stage flex flex-col">
          <p className="absolute left-[29px] top-[29px] text-[11px] font-medium uppercase tracking-[0.22em] text-ink/40">
            From {book.shelfLabel}
          </p>

          <div className="flex flex-1 flex-col items-center justify-center pt-6">
            <div
              className={`detail-book${showSpine ? " is-spine" : ""}`}
              style={{ ["--book-color" as string]: book.color }}
            >
              <div
                className="absolute inset-0 overflow-hidden rounded-sm shadow-lg"
                style={{
                  transform: "translateZ(14px)",
                  backgroundColor: book.color,
                }}
              >
                {!showSpine ? (
                  <BookCover book={book} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={spineFace}>
                    {!hasCrop && (
                      <span
                        className="spine-text px-1 font-display text-sm"
                        style={{ color: textColorFor(book.color) }}
                      >
                        {book.spineLabel}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-5"
                style={{
                  background: book.color,
                  filter: "brightness(0.75)",
                  transform: "rotateY(-90deg) translateZ(0px)",
                  transformOrigin: "left center",
                }}
              />
            </div>
            <div className="detail-shadow" aria-hidden />

            <button
              type="button"
              onClick={() => setShowSpine((v) => !v)}
              className="mt-5 inline-flex items-center gap-2 text-sm text-ink/55 transition hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M3 8a5 5 0 019.5-2.2M13 8a5 5 0 01-9.5 2.2"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <path d="M12.5 3.5v2.2H10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M3.5 12.5v-2.2H6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              {showSpine ? "Show cover" : "Show spine"}
            </button>
          </div>
        </div>

        {/* Right: content */}
        <div className="relative flex max-h-[calc(100dvh-64px)] flex-col overflow-y-auto p-[57px_43px_22px]">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-ink/12 text-ink/50 transition hover:bg-ink/[0.04] hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <p className="inline-flex w-fit rounded-md bg-sage-muted px-2 py-0.5 text-xs text-ink/70">
            {CATEGORY_LABELS[book.category]}
          </p>

          {book.identified ? (
            <>
              <h3 className="mt-3 font-display text-[2rem] leading-tight text-ink sm:text-[37px]">
                {book.title}
              </h3>
              {book.author && (
                <p className="mt-2 text-[17px] text-ink/60">{book.author}</p>
              )}
            </>
          ) : (
            <>
              <h3 className="mt-3 font-display text-[2rem] leading-tight text-ink/75 sm:text-[37px]">
                Needs a closer look
              </h3>
              <p className="mt-2 text-[17px] text-ink/55">
                This spine isn&apos;t matched to a book yet.
              </p>
            </>
          )}

          <hr className="my-5 border-ink/10" />

          <div>
            <h4 className="text-sm font-semibold text-ink">About the book</h4>
            <p className="mt-2 text-base leading-[1.7] text-ink/70">
              {book.notes?.trim()
                ? book.notes
                : book.identified
                  ? "No synopsis recorded yet — open Goodreads for reader notes."
                  : "Photographed on the shelf; identification still pending."}
            </p>
            {!book.identified && (
              <p className="mt-3 rounded-lg border border-brass/30 bg-brass/10 px-3 py-2 text-sm text-walnut-dark">
                Uncertain identification — spine reads “{book.spineLabel}”.
              </p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">Published</p>
              <p className="mt-1 text-sm text-ink/80">
                {book.year ?? (book.publisher ? "—" : "Unknown")}
                {book.publisher ? (book.year ? ` · ${book.publisher}` : book.publisher) : ""}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">Location</p>
              <p className="mt-1 text-sm text-ink/80">
                {book.shelfLabel} · Book {String(book.positionInShelf).padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">Identification</p>
              <p className={`mt-1 text-sm ${book.identified ? "text-sage" : "text-ink/60"}`}>
                {book.identified ? "✓ Matched to photo" : "Needs a closer look"}
              </p>
            </div>
          </div>

          {book.identified && book.title && (
            <div className="mt-6">
              <a
                href={`https://www.goodreads.com/search?q=${q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-between gap-3 rounded-lg bg-chocolate px-4 py-3 text-sm font-medium text-parchment transition hover:bg-chocolate-soft"
              >
                <span className="inline-flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-parchment/15 text-xs">
                    g
                  </span>
                  View on Goodreads
                </span>
                <span aria-hidden>↗</span>
              </a>
              <p className="mt-2 text-center text-xs text-ink/40">
                Reviews, ratings, and reader recommendations.
              </p>
              <a
                href={`https://openlibrary.org/search?q=${q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center text-xs text-ink/45 underline-offset-2 hover:text-ink hover:underline"
              >
                Book information source ↗
              </a>
            </div>
          )}

          <div className="mt-auto flex items-center gap-[9px] border-t border-ink/10 pt-5">
            <p className="mr-auto text-sm tabular-nums text-ink/40">
              {index + 1} / {books.length}
            </p>
            <button
              type="button"
              disabled={!hasPrev}
              onClick={() => onNavigate(index - 1)}
              aria-label="Previous book"
              className="flex h-9 w-[36px] items-center justify-center rounded-md border border-ink/15 text-ink/70 transition enabled:hover:border-sage/40 enabled:hover:bg-sage-muted disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => onNavigate(index + 1)}
              aria-label="Next book"
              className="flex h-9 w-[36px] items-center justify-center rounded-md border border-ink/15 text-ink/70 transition enabled:hover:border-sage/40 enabled:hover:bg-sage-muted disabled:opacity-30"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
