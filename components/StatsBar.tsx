"use client";

import type { LibraryStats } from "@/lib/data";

export default function StatsBar({ stats }: { stats: LibraryStats }) {
  const items = [
    { label: "Shelves", value: stats.totalShelves },
    { label: "Books", value: stats.totalBooks },
    { label: "Identified", value: stats.identified },
    { label: "Still a mystery", value: stats.unidentified },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-ink/10 bg-white/60 px-4 py-3"
        >
          <dt className="text-xs uppercase tracking-wider text-ink/50">
            {item.label}
          </dt>
          <dd className="mt-1 font-display text-2xl text-walnut-dark">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
