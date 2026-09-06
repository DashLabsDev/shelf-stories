# Shelf photos

Drop real shelf photos here, e.g.:

```
public/shelves/shelf-1.jpg
public/shelves/shelf-thomas-1.jpg
```

Then point each shelf's `photo` field in `data/shelves.json` at it:

```json
{ "id": "shelf-1", "label": "Top shelf — left", "photo": "/shelves/shelf-thomas-1.jpg", "books": [...] }
```

## Main / hero picture

Drop Thomas's main bookshelf picture as:

```
public/hero.jpg
```

(also accepts `hero.webp` or `hero.png`)

Then set in `data/shelves.json`:

```json
{ "heroPhoto": "/hero.jpg", "demo": false, "shelves": [...] }
```

If `heroPhoto` is set **or** `public/hero.jpg` (or .webp/.png) exists, the app renders a refined hero banner above the shelves (soft vignette, caption "The bookshelf").

Per-shelf `shelf.photo` still works as an optional soft backdrop behind that shelf's spines.

## Guidelines

- One photo per shelf row, shot straight-on so spines are readable.
- JPEG or WebP, ideally 2000px+ on the long edge.
- Name files after the shelf `id` when possible.
- More photos can be added later — keep the JSON additive.
