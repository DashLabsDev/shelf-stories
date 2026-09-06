"use client";

import { useEffect, useRef } from "react";
import type { Book } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";

export default function BookModal({
  book,
  shelfLabel,
  onClose,
}: {
  book: Book;
  shelfLabel: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={book.title ?? "Unidentified book"}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-parchment shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-2.5"
          style={{ backgroundColor: book.color }}
          aria-hidden
        />
        <div className="p-8 sm:p-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sage">
            {CATEGORY_LABELS[book.category]}
          </p>

          {book.identified ? (
            <>
              <h3 className="mt-3 font-display text-3xl leading-snug text-ink">
                {book.title}
              </h3>
              {book.author && (
                <p className="mt-2 text-lg text-ink/60">{book.author}</p>
              )}
            </>
          ) : (
            <>
              <h3 className="mt-3 font-display text-3xl leading-snug text-ink/70">
                Unidentified spine
              </h3>
              <p className="mt-2 text-base text-ink/55">
                Needs a closer look — not matched to a book yet.
              </p>
            </>
          )}

          <dl className="mt-8 space-y-4 border-t border-ink/10 pt-6 text-base">
            <div>
              <dt className="text-sm text-ink/40">Spine reads</dt>
              <dd className="mt-1 font-mono text-sm text-ink/80">
                {book.spineLabel}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-ink/40">Shelf</dt>
              <dd className="mt-1 text-ink/80">{shelfLabel}</dd>
            </div>
            {book.notes && (
              <div>
                <dt className="text-sm text-ink/40">Notes</dt>
                <dd className="mt-1 text-ink/80">{book.notes}</dd>
              </div>
            )}
          </dl>

          <button
            ref={closeRef}
            onClick={onClose}
            className="mt-8 w-full rounded-full border border-ink/15 py-2.5 text-sm text-ink/70 transition-colors hover:border-sage/40 hover:bg-sage-muted hover:text-ink"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
