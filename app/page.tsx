import Library from "@/components/Library";
import { getShelfData, getStats } from "@/lib/data";

export default function HomePage() {
  const data = getShelfData();
  const stats = getStats(data);

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-10 sm:py-14">
      <div className="mb-8 flex items-center justify-between border-b border-ink/10 pb-5">
        <p className="text-sm tracking-wide text-ink/70">
          <span className="mr-1.5 inline-block align-[-2px]" aria-hidden>
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
              <path
                d="M1.5 2.5C3.2 1.6 5.2 1.6 7 2.5V13C5.2 12.1 3.2 12.1 1.5 13V2.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M16.5 2.5C14.8 1.6 12.8 1.6 11 2.5V13C12.8 12.1 14.8 12.1 16.5 13V2.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </span>
          shelf stories
        </p>
        <p className="text-sm text-ink/40">The collection</p>
      </div>

      <header className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-ink/40">
            A collection, one book at a time.
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl md:text-[3.25rem]">
            The bookshelf<span className="text-walnut">.</span>
          </h1>
          <p className="mt-3 max-w-md text-base text-ink/50 sm:text-lg">
            Click any book to take a closer look.
          </p>
          {data.demo && (
            <p className="mt-4 inline-block rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-xs text-walnut-dark">
              Demo data — sample books only.
            </p>
          )}
        </div>
        <div className="sm:text-right">
          <p className="font-display text-5xl text-ink sm:text-6xl">
            {stats.identified}
          </p>
          <p className="mt-1 text-sm text-ink/45">identified books</p>
        </div>
      </header>

      <Library shelves={data.shelves} stats={stats} />

      <footer className="mt-20 border-t border-ink/10 pt-8 text-sm text-ink/40">
        The bookshelf · Shelf Stories · Dash Labs
      </footer>
    </main>
  );
}
