import { ImageResponse } from "next/og";
import { tools } from "@/lib/tools";
import { siteName } from "@/lib/toolSeo";

export const runtime = "edge";

const categoryColors: Record<string, string> = {
  Images: "#3b82f6",
  PDFs: "#f97316",
  Documents: "#8b5cf6",
  "Data & Text": "#10b981",
  "Security & Privacy": "#f43f5e",
  Developer: "#06b6d4",
  Calculators: "#f59e0b",
  Fun: "#ec4899",
  "Audio & Video": "#6366f1",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return new Response("Not found", { status: 404 });
  }

  const accent = categoryColors[tool.category] ?? "#10b981";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "sans-serif",
          padding: 60,
        }}
      >
        {/* Top: brand + category */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: "linear-gradient(135deg, #10b981, #3b82f6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 800,
                color: "white",
              }}
            >
              G
            </div>
            <span style={{ fontSize: 28, fontWeight: 700, color: "white" }}>
              {siteName}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 999,
              background: `${accent}22`,
              border: `1px solid ${accent}55`,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: accent,
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 600, color: accent }}>
              {tool.category}
            </span>
          </div>
        </div>

        {/* Middle: tool title + description */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.15,
              maxWidth: 1000,
            }}
          >
            {tool.title}
          </div>
          <div
            style={{
              fontSize: 26,
              color: "#94a3b8",
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {tool.description}
          </div>
        </div>

        {/* Bottom: value props */}
        <div style={{ display: "flex", gap: 32, fontSize: 22, color: "#10b981", fontWeight: 600 }}>
          <span>Free</span>
          <span>Private</span>
          <span>No Sign-up</span>
          <span>Browser-based</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
