import Library from "@/components/Library";
import HeroBanner from "@/components/HeroBanner";
import { getShelfData, getStats } from "@/lib/data";
import { resolveHeroPhoto } from "@/lib/hero";

export default function HomePage() {
  const data = getShelfData();
  const stats = getStats(data);
  const hero = resolveHeroPhoto(data);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 sm:px-10 sm:py-16">
      <header className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-sage">
            A collection, one book at a time
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">
            The bookshelf<span className="text-terracotta">.</span>
          </h1>
          <p className="mt-3 max-w-md text-base text-ink/55 sm:text-lg">
            Click any book to take a closer look.
          </p>
          {data.demo && (
            <p className="mt-4 inline-block rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs text-walnut-dark">
              Demo data — sample books only. Swap in real shelves via{" "}
              <code className="font-mono">data/shelves.json</code>.
            </p>
          )}
        </div>
        <div className="sm:text-right">
          <p className="font-display text-4xl text-ink sm:text-5xl">
            {stats.identified}
          </p>
          <p className="mt-1 text-sm text-ink/45">identified books</p>
        </div>
      </header>

      {hero && <HeroBanner src={hero} />}

      <Library shelves={data.shelves} stats={stats} />

      <footer className="mt-20 border-t border-ink/10 pt-8 text-sm text-ink/40">
        The bookshelf · Shelf Stories, a Dash Labs project.
      </footer>
    </main>
  );
}
