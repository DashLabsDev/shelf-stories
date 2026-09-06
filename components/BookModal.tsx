"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FlatBook } from "@/lib/data";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [showSpine, setShowSpine] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const book = books[index];
  const hasPrev = index > 0;
  const hasNext = index < books.length - 1;
  const q = book ? searchQuery(book) : "";

  const requestClose = useCallback(() => {
    if (leaving) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onClose();
      return;
    }
    setLeaving(true);
    window.setTimeout(() => onClose(), 280);
  }, [leaving, onClose]);

  useEffect(() => {
    setShowSpine(false);
    setLeaving(false);
    closeRef.current?.focus();
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
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
      // Focus trap
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [requestClose, onNavigate, index, hasPrev, hasNext]);

  if (!book) return null;

  const about =
    book.notes?.trim() ||
    (book.identified
      ? "No synopsis recorded yet — open Goodreads for reader notes."
      : "Photographed on the shelf; identification still pending.");

  const ink = textColorFor(book.color);

  return (
    <div
      className={`detail-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] sm:p-8${leaving ? " is-leaving" : ""}`}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-label={book.title ?? "Unidentified book"}
    >
      <div
        ref={dialogRef}
        className="detail-dialog relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: cream stage ~40% */}
        <div className="detail-stage flex flex-col">
          <p className="absolute left-[29px] top-[29px] z-[1] text-[11px] font-medium uppercase tracking-[0.22em] text-ink/40">
            From {book.shelfLabel}
          </p>

          <div className="relative z-[1] flex flex-1 flex-col items-center justify-center pt-6">
            <div
              className={`detail-book${showSpine ? " is-spine" : ""}`}
              style={{ ["--book-color" as string]: book.color }}
            >
              <div className="detail-face detail-face--cover">
                <BookCover book={book} />
              </div>

              <div
                className="detail-face detail-face--spine"
                style={{ backgroundColor: book.color }}
              >
                <span
                  className="spine-text absolute inset-0 z-[1] flex items-center justify-center overflow-hidden px-0.5 py-4 font-display text-[12px] font-semibold"
                  style={{ color: ink }}
                >
                  <span className="max-h-full overflow-hidden text-ellipsis whitespace-nowrap">
                    {book.identified
                      ? book.title ?? book.spineLabel
                      : book.spineLabel}
                  </span>
                </span>
              </div>

              <div className="detail-face detail-face--pages" aria-hidden />
            </div>

            <div className="detail-shadow" aria-hidden />

            <button
              type="button"
              onClick={() => setShowSpine((v) => !v)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3.5 py-1.5 text-sm text-ink/60 shadow-sm transition hover:border-ink/20 hover:bg-white/90 hover:text-ink"
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

        {/* Right: white content ~60% */}
        <div className="detail-content relative">
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-ink/12 text-ink/50 transition hover:bg-ink/[0.04] hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M3 3l8 8M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <p
            className="inline-flex w-fit rounded-md px-2.5 py-0.5 text-xs text-ink/70"
            style={{ background: "#e9ece3" }}
          >
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
            <p className="mt-2 text-base leading-[1.7] text-ink/70">{about}</p>
            {!book.identified && (
              <p className="mt-3 rounded-lg border border-brass/30 bg-brass/10 px-3 py-2 text-sm text-walnut-dark">
                Uncertain identification — spine reads “{book.spineLabel}”.
              </p>
            )}
          </div>

          <div className="detail-meta">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
                Published
              </p>
              <p className="mt-1 text-sm text-ink/80">
                {book.year ?? (book.publisher ? "—" : "Unknown")}
                {book.publisher
                  ? book.year
                    ? ` · ${book.publisher}`
                    : book.publisher
                  : ""}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
                Location
              </p>
              <p className="mt-1 text-sm text-ink/80">
                {book.shelfLabel} · Book{" "}
                {String(book.positionInShelf).padStart(2, "0")}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
                Identification
              </p>
              <p
                className={`mt-1 text-sm ${
                  book.identified ? "text-sage" : "text-ink/60"
                }`}
              >
                {book.identified ? "✓ Matched to photo" : "Needs a closer look"}
              </p>
            </div>
          </div>

          {book.identified && book.title && (
            <div>
              <a
                href={`https://www.goodreads.com/search?q=${q}`}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-cta"
              >
                <span className="inline-flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-parchment/15 text-xs">
                    g
                  </span>
                  View on Goodreads
                </span>
                <span aria-hidden>↗</span>
              </a>
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
              className="flex h-9 w-[36px] items-center justify-center rounded-md border border-ink/15 text-ink/70 transition enabled:hover:border-sage/40 enabled:hover:bg-[#e9ece3] disabled:opacity-30"
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
              className="flex h-9 w-[36px] items-center justify-center rounded-md border border-ink/15 text-ink/70 transition enabled:hover:border-sage/40 enabled:hover:bg-[#e9ece3] disabled:opacity-30"
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
