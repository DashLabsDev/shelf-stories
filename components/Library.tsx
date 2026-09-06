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
  { value: "all", label: "All books" },
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

  const totalVisible =
    filter === "all"
      ? stats.totalBooks
      : stats.byCategory[filter];

  return (
    <div>
      <StatsBar stats={stats} />

      <div
        role="toolbar"
        aria-label="Filter books by category"
        className="mt-10 flex flex-wrap gap-2.5"
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const count =
            f.value === "all" ? stats.totalBooks : stats.byCategory[f.value];
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={active}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                active
                  ? "border-sage/40 bg-sage-muted text-ink"
                  : "border-ink/10 bg-white/50 text-ink/55 hover:border-sage/30 hover:text-ink"
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-xs tabular-nums opacity-60">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-ink/40">
        Showing {totalVisible} {totalVisible === 1 ? "book" : "books"}
      </p>

      <div className="mt-12 space-y-14">
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
