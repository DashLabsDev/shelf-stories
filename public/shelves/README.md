# Shelf photos

Drop real shelf photos here, e.g.:

```
public/shelves/shelf-thomas-1.jpg
```

Then point each shelf's `photo` field in `data/shelves.json` at it and optionally add per-book `spineCrop` regions (percent of the photo):

```json
{
  "id": "bk-024",
  "title": "Little House on the Prairie",
  "spineCrop": { "x": 52.1, "y": 29.8, "w": 2.4, "h": 16.4 }
}
```

Spines render as CSS background crops of the shelf photo. Hover lifts the spine and shows a title/author tooltip.

## Main / hero picture

Optional: `public/hero.jpg` + `"heroPhoto": "/hero.jpg"` in shelves.json.

## Guidelines

- One photo per physical shelf unit, shot straight-on.
- JPEG or WebP, ideally 2000px+ on the long edge.
- More photos can be added later — keep the JSON additive (new shelf objects).
