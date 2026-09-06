"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Book, Category, Shelf } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";
import type { FlatBook } from "@/lib/data";
import { bookMatchesQuery, filterShelves, flattenBooks } from "@/lib/data";
import ShelfRow from "./ShelfRow";
import BookModal from "./BookModal";
import PhotoShelf from "./PhotoShelf";

type Filter = Category | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All books" },
  { value: "fiction", label: CATEGORY_LABELS.fiction },
  { value: "fantasy-horror", label: CATEGORY_LABELS["fantasy-horror"] },
  { value: "crime-mystery", label: CATEGORY_LABELS["crime-mystery"] },
  { value: "nonfiction", label: CATEGORY_LABELS.nonfiction },
  { value: "unidentified", label: CATEGORY_LABELS.unidentified },
];

export default function Library({
  shelves,
}: {
  shelves: Shelf[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [showPhoto, setShowPhoto] = useState(true);
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const visibleShelves = useMemo(
    () => filterShelves(shelves, filter, query),
    [shelves, filter, query]
  );

  /** Filtered shelf order — drives modal prev/next. */
  const orderedBooks = useMemo(
    () => flattenBooks(visibleShelves),
    [visibleShelves]
  );

  const allFlat = useMemo(() => flattenBooks(shelves), [shelves]);

  /** Query-aware category counts so pills match what a filter would show. */
  const filterCounts = useMemo(() => {
    const byCategory = Object.fromEntries(
      CATEGORIES.map((c) => [c, 0])
    ) as Record<Category, number>;
    let total = 0;
    for (const shelf of shelves) {
      for (const book of shelf.books) {
        if (!bookMatchesQuery(book, query)) continue;
        total += 1;
        byCategory[book.category] += 1;
      }
    }
    return { total, byCategory };
  }, [shelves, query]);

  const activeIds = useMemo(() => {
    const ids = new Set<string>();
    for (const b of orderedBooks) ids.add(b.id);
    return ids;
  }, [orderedBooks]);

  const photo =
    shelves.find((s) => s.photo)?.photo ?? "/shelves/shelf-thomas-1.jpg";

  const totalVisible = orderedBooks.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Keep selection valid when filter/query changes.
  useEffect(() => {
    if (selectedIndex == null) return;
    if (selectedIndex >= orderedBooks.length) {
      setSelectedIndex(orderedBooks.length > 0 ? orderedBooks.length - 1 : null);
    }
  }, [orderedBooks.length, selectedIndex]);

  const openById = (id: string) => {
    const idx = orderedBooks.findIndex((b) => b.id === id);
    if (idx >= 0) setSelectedIndex(idx);
  };

  const openBook = (book: Book) => openById(book.id);
  const openFlat = (book: FlatBook) => openById(book.id);

  return (
    <div>
      <div className="relative">
        <label htmlFor="shelf-search" className="sr-only">
          Find a title or author
        </label>
        <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-sm">
          <svg
            aria-hidden
            className="h-5 w-5 shrink-0 text-ink/35"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.75}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.6-5.4a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={searchRef}
            id="shelf-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a title or author"
            className="min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink/35"
          />
          <kbd className="hidden rounded-md border border-ink/10 bg-parchment px-1.5 py-0.5 text-[11px] text-ink/40 sm:inline">
            /
          </kbd>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          role="toolbar"
          aria-label="Filter books by category"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const count =
              f.value === "all"
                ? filterCounts.total
                : filterCounts.byCategory[f.value];
            // Hide empty genre pills (never show empty Fiction stubs).
            if (f.value !== "all" && count === 0) return null;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                disabled={count === 0}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-sage-muted text-ink"
                    : "bg-ink/[0.04] text-ink/55 hover:bg-ink/[0.07] hover:text-ink"
                }`}
              >
                {f.label}
                <span
                  className={`ml-1.5 inline-block rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                    active ? "bg-sage/20 text-ink/70" : "text-ink/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="ml-auto hidden items-center gap-1.5 text-xs text-ink/40 sm:flex">
          <span aria-hidden>↖</span> Hover to browse · Click to open
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink/40">
          Showing {totalVisible} {totalVisible === 1 ? "book" : "books"}
          {query.trim() ? ` matching “${query.trim()}”` : ""}
          {visibleShelves.length > 0
            ? ` across ${visibleShelves.length} ${
                visibleShelves.length === 1 ? "shelf" : "shelves"
              }`
            : ""}
        </p>
        <button
          type="button"
          onClick={() => setShowPhoto((v) => !v)}
          className="rounded-full border border-ink/10 bg-white/60 px-3 py-1 text-xs text-ink/55 transition hover:border-sage/30 hover:text-ink"
        >
          {showPhoto ? "Hide photo map" : "Show photo map"}
        </button>
      </div>

      {showPhoto && (
        <div className="mt-6">
          <PhotoShelf
            photo={photo}
            books={allFlat}
            activeIds={activeIds}
            onSelect={openFlat}
          />
        </div>
      )}

      <div className="mt-10 space-y-10">
        {visibleShelves.length === 0 ? (
          <p className="rounded-xl border border-ink/10 bg-white/40 px-6 py-10 text-center text-sm text-ink/50">
            No books match this filter
            {query.trim() ? ` for “${query.trim()}”` : ""}.
          </p>
        ) : (
          visibleShelves.map((shelf) => (
            <ShelfRow
              key={shelf.id}
              shelf={shelf}
              onSelect={openBook}
            />
          ))
        )}
      </div>

      {selectedIndex != null && orderedBooks[selectedIndex] && (
        <BookModal
          books={orderedBooks}
          index={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onNavigate={setSelectedIndex}
        />
      )}

    </div>
  );
}
