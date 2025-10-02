import { NextRequest } from "next/server";

export async function GET(_request: NextRequest) {
  const cdnUrl =
    "https://da8nru77lsio9.cloudfront.net/Terms+and+Conditions.pdf";

  const res = await fetch(cdnUrl, { cache: "no-store" });
  if (!res.ok) {
    return new Response("Failed to fetch file", { status: 502 });
  }

  const arrayBuffer = await res.arrayBuffer();

  return new Response(Buffer.from(arrayBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Terms and Conditions.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
