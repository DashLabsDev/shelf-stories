import Library from "@/components/Library";
import { getShelfData, getStats } from "@/lib/data";

export default function HomePage() {
  const data = getShelfData();
  const stats = getStats(data);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-walnut">
          Dash Labs
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          Shelf Stories
        </h1>
        <p className="mt-3 max-w-xl text-lg text-ink/70">
          A collection, one book at a time.
        </p>
        {data.demo && (
          <p className="mt-4 inline-block rounded-full border border-brass/50 bg-brass/10 px-3 py-1 text-xs text-walnut-dark">
            Demo data — sample books only. Swap in real shelves via{" "}
            <code className="font-mono">data/shelves.json</code>.
          </p>
        )}
      </header>

      <Library shelves={data.shelves} stats={stats} />

      <footer className="mt-16 border-t border-ink/10 pt-6 text-sm text-ink/50">
        The bookshelf · Shelf Stories, a Dash Labs project.
      </footer>
    </main>
  );
}
