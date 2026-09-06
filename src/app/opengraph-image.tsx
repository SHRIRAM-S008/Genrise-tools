import { ImageResponse } from "next/og";
import { siteName } from "@/lib/toolSeo";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = `${siteName} — Free Browser-Based Tools for Files, Images & PDFs`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #10b981, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 800,
              color: "white",
            }}
          >
            G
          </div>
          <span style={{ fontSize: 36, fontWeight: 700, color: "white" }}>
            {siteName}
          </span>
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.2,
          }}
        >
          Every tool you need, right in your browser
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#94a3b8",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          Compress, convert, and organize files — 100% free, nothing uploaded to a server
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            marginTop: 40,
            fontSize: 20,
            color: "#10b981",
          }}
        >
          <span>Free</span>
          <span>Private</span>
          <span>No Sign-up</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
