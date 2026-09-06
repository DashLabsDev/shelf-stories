# Shelf Stories

*A collection, one book at a time.* — The bookshelf, by Dash Labs.

A visual bookshelf browser: shelves render as rows of book spines you can hover,
click for details, filter by category, and browse across multiple shelves, with
library stats up top. Some spines are **unidentified** — photographed but not
yet matched to a book — and the app treats that as a first-class state.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS. No database — the library is
a single JSON file.

```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## How it's wired (photo-ready architecture)

| Piece | Purpose |
| --- | --- |
| `data/shelves.json` | Canonical library data. The only file to edit to change the collection. |
| `lib/types.ts` | TypeScript schema mirroring the JSON (shelves, books, categories). |
| `lib/data.ts` | Loader, stats, filtering, deterministic spine sizing. |
| `components/` | `Library` (filters + modal state), `ShelfRow`, `BookSpine`, `BookModal`, `StatsBar`. |
| `public/shelves/` | Real shelf photos go here (see its README). |
| `app/api/identify/route.ts` | Stub for the future photo → book identification pipeline (returns 501 with the planned contract). |


### Dropping in the main / hero picture

1. Save the main bookshelf photo as public/hero.jpg (or .webp / .png).
2. Set heroPhoto to /hero.jpg in data/shelves.json.
3. Optionally set each shelf photo for a soft backdrop.

The hero banner appears when the file exists or heroPhoto is set. Keep JSON additive for more shelves.

### Swapping in real shelves

1. Photograph each shelf and drop the images in `public/shelves/` (e.g. `shelf-1.jpg`).
2. Edit `data/shelves.json`: set each shelf's `photo` path and list its books.
   Spines you can't make out get `"identified": false`, `"category": "unidentified"`,
   a `spineLabel` with whatever text is legible, and `title`/`author` set to `null`.
3. Set the top-level `"demo"` flag to `false` to hide the demo banner.

No code changes required.

### Data schema

```jsonc
{
  "heroPhoto": "/hero.jpg",        // or null\n  "demo": false,                   // demo-data banner toggle
  "shelves": [
    {
      "id": "shelf-1",
      "label": "Living Room — Top Shelf",
      "photo": "/shelves/shelf-1.jpg",   // or null if no photo yet
      "books": [
        {
          "id": "bk-001",
          "title": "The Cartographer's Daughter",  // null when unidentified
          "author": "Elena Marsh",                 // null when unidentified
          "category": "fiction",  // fiction | fantasy-horror | crime-mystery | nonfiction | unidentified
          "spineLabel": "THE CARTOGRAPHER'S DAUGHTER · MARSH",
          "identified": true,
          "color": "#2f4858",     // spine color shown in the UI
          "notes": "optional freeform note"
        }
      ]
    }
  ]
}
```

## Note on the sample data

**All books in `data/shelves.json` are invented demo entries** — original
titles and authors made up for this project, not a real inventory. Replace them
with your actual shelves before treating any number in the stats bar as real.
