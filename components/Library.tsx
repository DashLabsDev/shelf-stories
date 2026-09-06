"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Book, Category, Shelf } from "@/lib/types";
import { CATEGORIES, CATEGORY_LABELS } from "@/lib/types";
import type { FlatBook } from "@/lib/data";
import { bookMatchesQuery, filterShelves, flattenBooks } from "@/lib/data";
import ShelfRow from "./ShelfRow";
import BookModal from "./BookModal";

type Filter = Category | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All books" },
  { value: "fiction", label: CATEGORY_LABELS.fiction },
  { value: "fantasy-horror", label: CATEGORY_LABELS["fantasy-horror"] },
  { value: "crime-mystery", label: CATEGORY_LABELS["crime-mystery"] },
  { value: "nonfiction", label: CATEGORY_LABELS.nonfiction },
  { value: "unidentified", label: CATEGORY_LABELS.unidentified },
];

export default function Library({ shelves }: { shelves: Shelf[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [shelfFilter, setShelfFilter] = useState<string>("all");
  const searchRef = useRef<HTMLInputElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const scopedShelves = useMemo(() => {
    if (shelfFilter === "all") return shelves;
    return shelves.filter((s) => s.id === shelfFilter);
  }, [shelves, shelfFilter]);

  const visibleShelves = useMemo(
    () => filterShelves(scopedShelves, filter, query),
    [scopedShelves, filter, query]
  );

  const orderedBooks = useMemo(
    () => flattenBooks(visibleShelves),
    [visibleShelves]
  );

  const filterCounts = useMemo(() => {
    const byCategory = Object.fromEntries(
      CATEGORIES.map((c) => [c, 0])
    ) as Record<Category, number>;
    let total = 0;
    for (const shelf of scopedShelves) {
      for (const book of shelf.books) {
        if (!bookMatchesQuery(book, query)) continue;
        total += 1;
        byCategory[book.category] += 1;
      }
    }
    return { total, byCategory };
  }, [scopedShelves, query]);

  const totalVisible = orderedBooks.length;
  const hasActiveFilters =
    filter !== "all" || query.trim().length > 0 || shelfFilter !== "all";

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

  const clearFilters = () => {
    setFilter("all");
    setQuery("");
    setShelfFilter("all");
  };

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-lg border border-sage/25 bg-white/80 px-4 py-3 shadow-soft sm:flex-row sm:items-center">
        <label htmlFor="shelf-search" className="sr-only">
          Find a title or author
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-3">
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
          <kbd className="hidden h-[22px] items-center rounded border border-ink/10 bg-parchment px-1.5 text-[11px] text-ink/40 sm:inline-flex">
            /
          </kbd>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="hidden text-sm text-ink/45 sm:inline">Browse</span>
          <label htmlFor="shelf-select" className="sr-only">
            Filter by shelf
          </label>
          <select
            id="shelf-select"
            value={shelfFilter}
            onChange={(e) => setShelfFilter(e.target.value)}
            className="rounded-md border border-ink/10 bg-parchment/80 px-3 py-1.5 text-sm text-ink/70 outline-none"
          >
            <option value="all">All shelves</option>
            {shelves.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3" style={{ paddingTop: 4, paddingBottom: 8 }}>
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
            if (f.value !== "all" && count === 0) return null;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                disabled={count === 0}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border border-sage/30 bg-sage-muted text-ink"
                    : "text-ink/55 hover:bg-ink/[0.04] hover:text-ink"
                }`}
                style={{ padding: "8px 12px", borderRadius: 6, fontSize: 14 }}
              >
                {f.label}
                {f.value === "all" && (
                  <span
                    className={`ml-1.5 inline-block rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                      active ? "bg-sage/20 text-ink/70" : "text-ink/40"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <p className="ml-auto hidden items-center gap-1.5 text-xs text-ink/40 sm:flex">
          <span aria-hidden>↖</span> Hover to browse · Click to open
        </p>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-ink/45">
          {query.trim()
            ? `${totalVisible} ${totalVisible === 1 ? "book" : "books"} found for “${query.trim()}”`
            : filter !== "all"
              ? `${totalVisible} ${totalVisible === 1 ? "book" : "books"} found`
              : `Showing ${totalVisible} ${totalVisible === 1 ? "book" : "books"}`}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-ink/50 underline-offset-2 hover:text-ink hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-8 space-y-6">
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
              showNav={orderedBooks.length > 10}
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
