"use client";

import { useState } from "react";
import Image from "next/image";
import type { FlatBook } from "@/lib/data";

export default function PhotoShelf({
  photo,
  books,
  activeIds,
  onSelect,
}: {
  photo: string;
  books: FlatBook[];
  /** Book ids that match current filter/search; others dim. */
  activeIds: Set<string>;
  onSelect: (book: FlatBook) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hotBooks = books.filter((b) => b.spineCrop && b.photo === photo);
  const hoveredBook = hotBooks.find((b) => b.id === hovered) ?? null;

  return (
    <section aria-label="Interactive shelf photo" className="relative">
      <div className="shelf-frame shelf-recess">
        <div className="shelf-back relative overflow-hidden">
          <div className="relative aspect-[4/3] w-full sm:aspect-[5/3.6]">
            <Image
              src={photo}
              alt="Thomas’s bookshelf — click a spine"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 1152px"
            />
            {/* soft top lighting + edge vignette over photo */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,248,235,0.12), transparent 18%), radial-gradient(ellipse 80% 70% at 50% 45%, transparent 50%, rgba(20,14,10,0.35) 100%)",
              }}
            />

            {hotBooks.map((book) => {
              const c = book.spineCrop!;
              const active = activeIds.has(book.id);
              const isHot = hovered === book.id;
              return (
                <button
                  key={book.id}
                  type="button"
                  aria-label={
                    book.identified
                      ? `${book.title}${book.author ? ` by ${book.author}` : ""}`
                      : `Unidentified book, spine reads ${book.spineLabel}`
                  }
                  className={`absolute z-[2] origin-bottom rounded-[2px] transition-all duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${
                    active ? "cursor-pointer" : "cursor-default"
                  }`}
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                    width: `${c.w}%`,
                    height: `${c.h}%`,
                    transform: isHot
                      ? "translateY(-4%) scale(1.04)"
                      : "translateY(0) scale(1)",
                    boxShadow: isHot
                      ? "0 14px 28px -8px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,248,235,0.35)"
                      : "none",
                    background: isHot
                      ? "linear-gradient(180deg, rgba(255,248,235,0.18), rgba(255,248,235,0.04))"
                      : active
                        ? "transparent"
                        : "rgba(20,14,10,0.45)",
                    filter: active ? "none" : "grayscale(50%)",
                    opacity: active ? 1 : 0.55,
                  }}
                  onMouseEnter={() => setHovered(book.id)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(book.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => onSelect(book)}
                />
              );
            })}

            {hoveredBook && (
              <div
                className="pointer-events-none absolute z-30 hidden max-w-[240px] -translate-x-1/2 rounded-xl border border-ink/10 bg-parchment/95 px-3.5 py-2.5 shadow-lg backdrop-blur-sm sm:block"
                style={{
                  left: `${hoveredBook.spineCrop!.x + hoveredBook.spineCrop!.w / 2}%`,
                  top: `${Math.max(2, hoveredBook.spineCrop!.y - 2)}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <p className="font-display text-sm leading-snug text-ink">
                  {hoveredBook.identified
                    ? hoveredBook.title ?? hoveredBook.spineLabel
                    : "Unidentified spine"}
                </p>
                <p className="mt-0.5 text-xs text-ink/55">
                  {hoveredBook.identified
                    ? hoveredBook.author ?? "Author unknown"
                    : "Needs a closer look"}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="shelf-ledge" />
      </div>
      <p className="mt-3 text-center text-xs text-ink/40 sm:text-sm">
        Hover a spine for its title · click for details
      </p>
    </section>
  );
}
