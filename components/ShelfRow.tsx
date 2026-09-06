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
    <section aria-label={shelf.label} className="relative">
      <div className="shelf-frame">
        <div
          className="shelf-back relative min-w-full px-4 pt-10 sm:px-6"
          style={
            shelf.photo
              ? {
                  backgroundImage: `linear-gradient(180deg, rgba(28,20,14,0.72), rgba(28,20,14,0.88)), url(${shelf.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {shelf.books.length === 0 ? (
            <p className="relative z-[1] pb-8 pt-12 text-center text-sm italic text-parchment/50">
              Nothing on this shelf matches the current filter.
            </p>
          ) : (
            <div className="relative z-[1] flex min-h-[230px] items-end gap-[2px]">
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
