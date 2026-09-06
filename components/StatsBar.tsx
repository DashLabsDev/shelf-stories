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
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-ink/10 bg-white/40 px-4 py-3.5 shadow-soft backdrop-blur-sm"
        >
          <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/40">
            {item.label}
          </dt>
          <dd className="mt-1.5 font-display text-2xl text-ink sm:text-3xl">
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
