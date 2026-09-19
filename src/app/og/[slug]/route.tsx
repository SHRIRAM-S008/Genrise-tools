import { ImageResponse } from "next/og";
import { kits, tools } from "@/lib/tools";
import { getToolSeoOverride } from "@/lib/toolSeoOverrides";
import { siteName, siteUrl } from "@/lib/toolSeo";

export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return [
    { slug: "tools" },
    ...tools.map((t) => ({ slug: t.slug })),
    ...kits.map((k) => ({ slug: k.slug })),
  ];
}

const size = { width: 1200, height: 630 };

function toKebab(pascal: string): string {
  return pascal
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Za-z])([0-9])/g, "$1-$2")
    .toLowerCase();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let headline: string;
  let description: string;
  let chip: string;
  let iconName: string;

  const tool = tools.find((t) => t.slug === slug);
  const kit = kits.find((k) => k.slug === slug);

  if (tool) {
    const override = getToolSeoOverride(slug);
    headline = override?.title?.split("—")[0].trim() ?? tool.title;
    description = tool.description;
    chip = tool.category;
    iconName = tool.icon.displayName ?? "";
  } else if (kit) {
    headline = kit.title;
    description = `${kit.description} ${tools.filter((t) => t.kits?.includes(kit.slug)).length} tools included.`;
    chip = "Toolkit";
    iconName = kit.icon.displayName ?? "";
  } else if (slug === "tools") {
    headline = "All Tools";
    description = `${tools.length} free browser-based tools — compress, convert, merge and organize files, images and PDFs.`;
    chip = "Tools";
    iconName = "LayoutGrid";
  } else {
    return new Response("Not found", { status: 404 });
  }

  const headlineSize =
    headline.length > 34 ? 46 : headline.length > 24 ? 56 : 64;

  // lucide-react icon components are client components, so satori can't call
  // them — but each icon module exports its raw `__iconNode` SVG data, which we
  // render directly. displayName is the PascalCase icon name ("ScanQrCode").
  const kebab = toKebab(iconName);
  const iconNode: [string, Record<string, string>][] = kebab
    ? (await import(`lucide-react/dist/esm/icons/${kebab}.mjs`)).__iconNode
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 800,
              color: "white",
            }}
          >
            G
          </div>
          <span style={{ fontSize: 30, fontWeight: 700, color: "white" }}>
            {siteName}
          </span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: 20,
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: 999,
              padding: "8px 20px",
            }}
          >
            {chip}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#10b981",
              flexShrink: 0,
            }}
          >
            <svg
              width={56}
              height={56}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {iconNode.map(([tag, attrs], i) =>
                tag === "path" ? (
                  <path key={i} d={attrs.d} fill={attrs.fill ?? "none"} />
                ) : tag === "circle" ? (
                  <circle key={i} cx={attrs.cx} cy={attrs.cy} r={attrs.r} />
                ) : tag === "rect" ? (
                  <rect
                    key={i}
                    x={attrs.x}
                    y={attrs.y}
                    width={attrs.width}
                    height={attrs.height}
                    rx={attrs.rx}
                  />
                ) : tag === "line" ? (
                  <line
                    key={i}
                    x1={attrs.x1}
                    y1={attrs.y1}
                    x2={attrs.x2}
                    y2={attrs.y2}
                  />
                ) : tag === "polyline" ? (
                  <polyline key={i} points={attrs.points} />
                ) : tag === "polygon" ? (
                  <polygon key={i} points={attrs.points} />
                ) : tag === "ellipse" ? (
                  <ellipse
                    key={i}
                    cx={attrs.cx}
                    cy={attrs.cy}
                    rx={attrs.rx}
                    ry={attrs.ry}
                  />
                ) : null
              )}
            </svg>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 880,
            }}
          >
            <div
              style={{
                fontSize: headlineSize,
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
              }}
            >
              {headline}
            </div>
            <div
              style={{
                fontSize: 28,
                color: "#94a3b8",
                marginTop: 16,
                maxWidth: 880,
                lineHeight: 1.35,
              }}
            >
              {description}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ display: "flex", gap: 28, fontSize: 22, color: "#10b981" }}
          >
            <span>Free</span>
            <span>Private</span>
            <span>No Sign-up</span>
          </div>
          <span style={{ fontSize: 20, color: "#64748b" }}>
            {siteUrl.replace("https://", "")}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
