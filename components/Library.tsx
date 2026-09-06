"use client";

import { useMemo, useState } from "react";
import type { Book, Category, Shelf } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/types";
import type { LibraryStats } from "@/lib/data";
import { filterShelves } from "@/lib/data";
import ShelfRow from "./ShelfRow";
import BookModal from "./BookModal";
import StatsBar from "./StatsBar";

type Filter = Category | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fiction", label: CATEGORY_LABELS.fiction },
  { value: "fantasy-horror", label: CATEGORY_LABELS["fantasy-horror"] },
  { value: "crime-mystery", label: CATEGORY_LABELS["crime-mystery"] },
  { value: "nonfiction", label: CATEGORY_LABELS.nonfiction },
  { value: "unidentified", label: CATEGORY_LABELS.unidentified },
];

export default function Library({
  shelves,
  stats,
}: {
  shelves: Shelf[];
  stats: LibraryStats;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<{
    book: Book;
    shelfLabel: string;
  } | null>(null);

  const visibleShelves = useMemo(
    () => filterShelves(shelves, filter),
    [shelves, filter]
  );

  return (
    <div>
      <StatsBar stats={stats} />

      <div
        role="toolbar"
        aria-label="Filter books by category"
        className="mt-8 flex flex-wrap gap-2"
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-walnut bg-walnut text-parchment"
                  : "border-ink/20 bg-white/60 text-ink/70 hover:border-walnut/60 hover:text-ink"
              }`}
            >
              {f.label}
              {f.value !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  {stats.byCategory[f.value]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-10 space-y-12">
        {visibleShelves.map((shelf) => (
          <ShelfRow
            key={shelf.id}
            shelf={shelf}
            onSelect={(book) =>
              setSelected({ book, shelfLabel: shelf.label })
            }
          />
        ))}
      </div>

      {selected && (
        <BookModal
          book={selected.book}
          shelfLabel={selected.shelfLabel}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
