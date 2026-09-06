"use client";

import { useEffect, useRef } from "react";
import type { FlatBook } from "@/lib/data";
import { spineCropBackground } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";

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
  const book = books[index];
  const hasPrev = index > 0;
  const hasNext = index < books.length - 1;
  const hasCrop = Boolean(book?.photo && book?.spineCrop);
  const q = book ? searchQuery(book) : "";

  useEffect(() => {
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
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, index, hasPrev, hasNext]);

  if (!book) return null;

  const leftFace = hasCrop
    ? spineCropBackground(book.photo!, book.spineCrop!)
    : { backgroundColor: book.color };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-3 backdrop-blur-[2px] sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={book.title ?? "Unidentified book"}
    >
      <div
        className="relative grid w-full max-w-3xl overflow-hidden rounded-2xl border border-ink/10 bg-parchment shadow-2xl sm:grid-cols-[minmax(140px,240px)_1fr]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-ink/90 sm:min-h-[420px]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 40% 30%, rgba(255,248,235,0.18), transparent 55%), linear-gradient(180deg, #2e2219, #1a130e)",
            }}
          />
          <div
            className="relative z-[1] h-[78%] w-[42%] max-w-[120px] rounded-sm shadow-[0_18px_40px_-10px_rgba(0,0,0,0.65)] sm:w-[46%] sm:max-w-[140px]"
            style={{
              ...leftFace,
              boxShadow:
                "inset -3px 0 6px rgba(0,0,0,0.35), inset 2px 0 3px rgba(255,255,255,0.2), 0 16px 32px -8px rgba(0,0,0,0.55)",
            }}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage: hasCrop
                  ? "linear-gradient(90deg, rgba(0,0,0,0.28), transparent 18%, transparent 82%, rgba(0,0,0,0.34)), linear-gradient(180deg, rgba(255,255,255,0.16), transparent 22%, transparent 75%, rgba(0,0,0,0.3))"
                  : "linear-gradient(90deg, rgba(255,255,255,0.2), transparent 14%, transparent 86%, rgba(0,0,0,0.35))",
              }}
            />
          </div>
          {!book.identified && (
            <p className="absolute bottom-4 left-0 right-0 z-[2] px-4 text-center text-[11px] uppercase tracking-[0.18em] text-parchment/70">
              Needs a closer look
            </p>
          )}
        </div>

        <div className="flex flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sage">
              {CATEGORY_LABELS[book.category]}
            </p>
            <p className="text-[11px] tabular-nums text-ink/35">
              {index + 1} / {books.length}
            </p>
          </div>

          {book.identified ? (
            <>
              <h3 className="mt-3 font-display text-2xl leading-snug text-ink sm:text-3xl">
                {book.title}
              </h3>
              {book.author && (
                <p className="mt-2 text-base text-ink/60 sm:text-lg">{book.author}</p>
              )}
            </>
          ) : (
            <>
              <h3 className="mt-3 font-display text-2xl leading-snug text-ink/75 sm:text-3xl">
                Needs a closer look
              </h3>
              <p className="mt-2 text-base text-ink/55">
                This spine isn&apos;t matched to a book yet.
              </p>
            </>
          )}

          <dl className="mt-6 space-y-3.5 border-t border-ink/10 pt-5 text-sm sm:text-base">
            <div>
              <dt className="text-xs text-ink/40 sm:text-sm">Spine reads</dt>
              <dd className="mt-1 font-mono text-xs text-ink/80 sm:text-sm">
                {book.spineLabel}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink/40 sm:text-sm">Shelf location</dt>
              <dd className="mt-1 text-ink/80">{book.shelfLabel}</dd>
            </div>
            {(book.year || book.publisher) && (
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {book.year != null && (
                  <div>
                    <dt className="text-xs text-ink/40 sm:text-sm">Year</dt>
                    <dd className="mt-1 text-ink/80">{book.year}</dd>
                  </div>
                )}
                {book.publisher && (
                  <div>
                    <dt className="text-xs text-ink/40 sm:text-sm">Publisher</dt>
                    <dd className="mt-1 text-ink/80">{book.publisher}</dd>
                  </div>
                )}
              </div>
            )}
            {book.notes && (
              <div>
                <dt className="text-xs text-ink/40 sm:text-sm">
                  {book.identified ? "Notes" : "Notes / clues"}
                </dt>
                <dd className="mt-1 text-ink/80">{book.notes}</dd>
              </div>
            )}
          </dl>

          {book.identified && book.title && (
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`https://www.goodreads.com/search?q=${q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/12 bg-white/70 px-3.5 py-1.5 text-xs text-ink/65 transition hover:border-sage/40 hover:bg-sage-muted hover:text-ink"
              >
                Search Goodreads ↗
              </a>
              <a
                href={`https://openlibrary.org/search?q=${q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink/12 bg-white/70 px-3.5 py-1.5 text-xs text-ink/65 transition hover:border-sage/40 hover:bg-sage-muted hover:text-ink"
              >
                Search Open Library ↗
              </a>
            </div>
          )}

          <div className="mt-auto flex items-center gap-2 pt-8">
            <button
              type="button"
              disabled={!hasPrev}
              onClick={() => onNavigate(index - 1)}
              aria-label="Previous book"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink/70 transition enabled:hover:border-sage/40 enabled:hover:bg-sage-muted enabled:hover:text-ink disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              disabled={!hasNext}
              onClick={() => onNavigate(index + 1)}
              aria-label="Next book"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/12 text-ink/70 transition enabled:hover:border-sage/40 enabled:hover:bg-sage-muted enabled:hover:text-ink disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              ref={closeRef}
              onClick={onClose}
              className="ml-auto rounded-full border border-ink/15 px-5 py-2 text-sm text-ink/70 transition-colors hover:border-sage/40 hover:bg-sage-muted hover:text-ink"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
