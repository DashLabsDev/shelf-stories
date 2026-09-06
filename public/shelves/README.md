# Shelf photos

Drop real shelf photos here, e.g.:

```
public/shelves/shelf-1.jpg
public/shelves/shelf-2.jpg
```

Then point each shelf's `photo` field in `data/shelves.json` at it:

```json
{ "id": "shelf-1", "label": "Living Room — Top Shelf", "photo": "/shelves/shelf-1.jpg", "books": [...] }
```

Guidelines:

- One photo per shelf row, shot straight-on so spines are readable.
- JPEG or WebP, ideally 2000px+ on the long edge (the identify pipeline will want legible spine text).
- Name files after the shelf `id` to keep things obvious.

The current sample data uses `"photo": null` because no real photos exist yet —
the UI renders stylized spines from the JSON either way, so photos are optional.
