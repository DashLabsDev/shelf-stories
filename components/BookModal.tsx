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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={book.title ?? "Unidentified book"}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-xl bg-parchment shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="h-3"
          style={{ backgroundColor: book.color }}
          aria-hidden
        />
        <div className="p-6">
          <p className="text-xs uppercase tracking-widest text-walnut">
            {CATEGORY_LABELS[book.category]}
          </p>

          {book.identified ? (
            <>
              <h3 className="mt-2 font-display text-2xl leading-snug">
                {book.title}
              </h3>
              <p className="mt-1 text-ink/70">{book.author}</p>
            </>
          ) : (
            <>
              <h3 className="mt-2 font-display text-2xl leading-snug text-ink/70">
                Unidentified spine
              </h3>
              <p className="mt-1 text-sm text-ink/60">
                Not matched to a book yet. Know it? It can be identified from
                the shelf photo.
              </p>
            </>
          )}

          <dl className="mt-5 space-y-3 border-t border-ink/10 pt-4 text-sm">
            <div>
              <dt className="text-ink/50">Spine reads</dt>
              <dd className="mt-0.5 font-mono text-[13px]">{book.spineLabel}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Shelf</dt>
              <dd className="mt-0.5">{shelfLabel}</dd>
            </div>
            {book.notes && (
              <div>
                <dt className="text-ink/50">Notes</dt>
                <dd className="mt-0.5">{book.notes}</dd>
              </div>
            )}
          </dl>

          <button
            ref={closeRef}
            onClick={onClose}
            className="mt-6 w-full rounded-lg border border-walnut/40 py-2 text-sm text-walnut-dark transition-colors hover:bg-walnut hover:text-parchment"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
