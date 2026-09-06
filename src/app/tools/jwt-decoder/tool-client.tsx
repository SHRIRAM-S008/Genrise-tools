"use client";

import { useMemo, useState } from "react";
import ToolLayout from "@/components/ToolLayout";

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(input.length + ((4 - (input.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

export default function JwtDecoderPage() {
  const [token, setToken] = useState("");

  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return null;
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return { header, payload };
    } catch {
      return "error" as const;
    }
  }, [token]);

  const [now] = useState(() => Math.floor(Date.now() / 1000));
  const exp = decoded && decoded !== "error" ? decoded.payload?.exp : undefined;
  const iat = decoded && decoded !== "error" ? decoded.payload?.iat : undefined;

  return (
    <ToolLayout title="JWT Decoder" description="Decode a JSON Web Token's header and payload instantly.">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">JWT</span>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={5}
          placeholder="eyJhbGciOi..."
          className="rounded-lg border border-border px-3 py-2 font-mono text-xs break-all"
        />
      </label>

      <p className="text-xs text-muted-foreground">
        This only decodes the token — it does not verify the signature. Never paste a token you don&apos;t trust into an
        untrusted site.
      </p>

      {decoded === "error" && <p className="text-destructive">Couldn&apos;t decode this token — check it&apos;s a valid JWT.</p>}

      {decoded && decoded !== "error" && (
        <>
          {typeof exp === "number" && (
            <p className={exp < now ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}>
              {exp < now ? "Expired" : "Valid"} — exp: {new Date(exp * 1000).toLocaleString()}
              {typeof iat === "number" && <span className="ml-2 text-muted-foreground">issued: {new Date(iat * 1000).toLocaleString()}</span>}
            </p>
          )}

          <div className="rounded-2xl border border-border p-5">
            <p className="mb-2 text-sm font-medium">Header</p>
            <pre className="overflow-x-auto rounded-lg bg-accent/40 p-3 text-xs">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>

          <div className="rounded-2xl border border-border p-5">
            <p className="mb-2 text-sm font-medium">Payload</p>
            <pre className="overflow-x-auto rounded-lg bg-accent/40 p-3 text-xs">{JSON.stringify(decoded.payload, null, 2)}</pre>
          </div>
        </>
      )}
    </ToolLayout>
  );
}
