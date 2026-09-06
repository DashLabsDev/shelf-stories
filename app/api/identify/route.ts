import { NextResponse } from "next/server";

/**
 * POST /api/identify — stub for future spine identification.
 *
 * Planned flow: accept a shelf photo reference (a path under public/shelves/)
 * plus optional crop coordinates for one spine, run it through a vision model,
 * and return candidate { title, author, confidence } matches so unidentified
 * entries in data/shelves.json can be filled in.
 *
 * Currently returns 501 with the expected request/response contract so the
 * frontend can be wired up before the real implementation lands.
 */
export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    // No/invalid JSON body is fine for the stub.
  }

  return NextResponse.json(
    {
      implemented: false,
      message:
        "Spine identification is not implemented yet. This endpoint will accept a shelf photo and return candidate book matches.",
      expectedRequest: {
        shelfId: "shelf-1",
        photo: "/shelves/shelf-1.jpg",
        bookId: "bk-004 (optional — identify one spine instead of the whole shelf)",
        crop: { x: 0, y: 0, width: 0, height: 0 },
      },
      expectedResponse: {
        candidates: [
          { bookId: "bk-004", title: "…", author: "…", confidence: 0.0 },
        ],
      },
      received: body,
    },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json({
    implemented: false,
    message: "Use POST with a shelf photo reference. See route.ts for the planned contract.",
  });
}
