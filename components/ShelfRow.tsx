"use client";

import type { Book, Shelf } from "@/lib/types";
import BookSpine from "./BookSpine";

export default function ShelfRow({
  shelf,
  onSelect,
}: {
  shelf: Shelf;
  onSelect: (book: Book) => void;
}) {
  return (
    <section aria-label={shelf.label}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="font-display text-xl text-walnut-dark">{shelf.label}</h2>
        <span className="text-sm text-ink/50">
          {shelf.books.length} {shelf.books.length === 1 ? "book" : "books"}
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-shelf">
        <div className="shelf-back min-w-full px-4 pt-8 sm:px-6">
          {shelf.books.length === 0 ? (
            <p className="pb-6 pt-10 text-center text-sm italic text-ink/40">
              Nothing on this shelf matches the current filter.
            </p>
          ) : (
            <div className="flex min-h-[230px] items-end gap-[3px]">
              {shelf.books.map((book) => (
                <BookSpine
                  key={book.id}
                  book={book}
                  onClick={() => onSelect(book)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="shelf-ledge h-4" />
      </div>
    </section>
  );
}
