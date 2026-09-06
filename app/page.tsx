import Library from "@/components/Library";
import { getShelfData, getStats } from "@/lib/data";

export default function HomePage() {
  const data = getShelfData();
  const stats = getStats(data);

  return (
    <main className="mx-auto w-full max-w-[1450px] px-[4.6%] pb-16 pt-[46px]">
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
            A collection, one book at a time
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
        <div className="flex items-end gap-8 sm:text-right">
          <div>
            <p className="font-display text-5xl text-ink sm:text-6xl">
              {stats.identified}
            </p>
            <p className="mt-1 text-sm text-ink/45">identified books</p>
          </div>
          <div className="hidden h-14 w-px bg-ink/10 sm:block" aria-hidden />
          <div>
            <p className="font-display text-5xl text-ink sm:text-6xl">
              {stats.totalShelves}
            </p>
            <p className="mt-1 text-sm text-ink/45">shelves to explore</p>
          </div>
        </div>
      </header>

      <Library shelves={data.shelves} />

      <footer className="mt-20 border-t border-ink/10 pt-8 text-sm text-ink/40">
        <span>
          The bookshelf · {stats.unidentified} awaiting a closer look
        </span>
        <span className="ml-2 text-ink/25">Dash Labs</span>
      </footer>
    </main>
  );
}
