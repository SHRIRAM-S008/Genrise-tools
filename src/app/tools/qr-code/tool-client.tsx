"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ToolLayout from "@/components/ToolLayout";
import DownloadButton from "@/components/DownloadButton";
import { CopyButton } from "@/components/copy-button";
import { generateQrPngBlob, generateQrSvgString, type QrOptions } from "@/lib/qrCode";
import {
  buildEmailPayload,
  buildPhonePayload,
  buildSmsPayload,
  buildVCardPayload,
  buildWifiPayload,
  CONTENT_TYPES,
  normalizeUrl,
  type QrContentType,
  type WifiPayload,
} from "@/lib/qrPayload";
import { useObjectUrl } from "@/lib/useObjectUrl";

const ERROR_LEVELS: { id: NonNullable<QrOptions["errorCorrection"]>; label: string; hint: string }[] = [
  { id: "L", label: "L", hint: "7% recoverable — smallest code" },
  { id: "M", label: "M", hint: "15% recoverable — good default" },
  { id: "Q", label: "Q", hint: "25% recoverable" },
  { id: "H", label: "H", hint: "30% recoverable — best for print or logos" },
];

const inputClass = "rounded-lg border border-border px-3 py-2";

export default function QrCodePage() {
  const [type, setType] = useState<QrContentType>("url");

  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [wifi, setWifi] = useState<WifiPayload>({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [card, setCard] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    phone: "",
    email: "",
    website: "",
  });
  const [email, setEmail] = useState({ to: "", subject: "", body: "" });
  const [sms, setSms] = useState({ number: "", message: "" });
  const [phone, setPhone] = useState("");

  const [size, setSize] = useState(512);
  const [color, setColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [errorCorrection, setErrorCorrection] = useState<NonNullable<QrOptions["errorCorrection"]>>("M");

  const [busy, setBusy] = useState(false);
  const [png, setPng] = useState<Blob | null>(null);
  const [svg, setSvg] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useObjectUrl(png);

  const payload = useMemo(() => {
    switch (type) {
      case "url":
        return normalizeUrl(url);
      case "text":
        return text;
      case "wifi":
        return wifi.ssid ? buildWifiPayload(wifi) : "";
      case "vcard":
        return card.firstName || card.lastName || card.phone || card.email ? buildVCardPayload(card) : "";
      case "email":
        return email.to ? buildEmailPayload(email) : "";
      case "sms":
        return sms.number ? buildSmsPayload(sms) : "";
      case "phone":
        return phone ? buildPhonePayload(phone) : "";
    }
  }, [type, url, text, wifi, card, email, sms, phone]);

  function invalidate() {
    setPng(null);
    setSvg(null);
  }

  async function run() {
    if (!payload.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const options: QrOptions = { size, color, background, errorCorrection };
      const [pngBlob, svgString] = await Promise.all([
        generateQrPngBlob(payload, options),
        generateQrSvgString(payload, options),
      ]);
      setPng(pngBlob);
      setSvg(new Blob([svgString], { type: "image/svg+xml" }));
    } catch {
      setError("Couldn't generate a QR code for that content — it may be too long.");
    } finally {
      setBusy(false);
    }
  }

  function field<T>(value: T, setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      invalidate();
    };
  }

  const setUrlField = field(url, setUrl);
  const setTextField = field(text, setText);

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Create a free static QR code for a link, text, Wi-Fi network, or contact card. It never expires and works offline."
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">What should the QR code do?</span>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setType(c.id);
                invalidate();
              }}
              title={c.hint}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                type === c.id ? "bg-primary text-primary-foreground" : "border border-border"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">{CONTENT_TYPES.find((c) => c.id === type)?.hint}</span>
      </div>

      {type === "url" && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Website address</span>
          <input
            value={url}
            onChange={(e) => setUrlField(e.target.value)}
            placeholder="example.com"
            inputMode="url"
            className={inputClass}
          />
          {url.trim() && <span className="text-xs text-muted-foreground">Encodes: {normalizeUrl(url)}</span>}
        </label>
      )}

      {type === "text" && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Text</span>
          <textarea
            value={text}
            onChange={(e) => setTextField(e.target.value)}
            rows={3}
            placeholder="Any text — a note, a code, a serial number…"
            className={inputClass}
          />
        </label>
      )}

      {type === "wifi" && (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Network name (SSID)</span>
            <input value={wifi.ssid} onChange={(e) => { setWifi({ ...wifi, ssid: e.target.value }); invalidate(); }} className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Password</span>
            <input
              value={wifi.password}
              onChange={(e) => { setWifi({ ...wifi, password: e.target.value }); invalidate(); }}
              disabled={wifi.encryption === "nopass"}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Security</span>
            <select
              value={wifi.encryption}
              onChange={(e) => { setWifi({ ...wifi, encryption: e.target.value as WifiPayload["encryption"] }); invalidate(); }}
              className={inputClass}
            >
              <option value="WPA">WPA / WPA2 / WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Open (no password)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 pb-2 text-sm sm:pt-7">
            <input type="checkbox" checked={wifi.hidden} onChange={(e) => { setWifi({ ...wifi, hidden: e.target.checked }); invalidate(); }} />
            Hidden network
          </label>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Scanning joins the network on iOS and Android without typing the password.
          </p>
        </div>
      )}

      {type === "vcard" && (
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["organization", "Company"],
            ["title", "Job title"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["website", "Website"],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex flex-col gap-2">
              <span className="text-sm font-medium">{label}</span>
              <input
                value={card[key]}
                onChange={(e) => { setCard({ ...card, [key]: e.target.value }); invalidate(); }}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      )}

      {type === "email" && (
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">To</span>
            <input value={email.to} onChange={(e) => { setEmail({ ...email, to: e.target.value }); invalidate(); }} inputMode="email" className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Subject</span>
            <input value={email.subject} onChange={(e) => { setEmail({ ...email, subject: e.target.value }); invalidate(); }} className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Message</span>
            <textarea value={email.body} onChange={(e) => { setEmail({ ...email, body: e.target.value }); invalidate(); }} rows={3} className={inputClass} />
          </label>
        </div>
      )}

      {type === "sms" && (
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Phone number</span>
            <input value={sms.number} onChange={(e) => { setSms({ ...sms, number: e.target.value }); invalidate(); }} inputMode="tel" placeholder="+1 555 000 1234" className={inputClass} />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Message</span>
            <textarea value={sms.message} onChange={(e) => { setSms({ ...sms, message: e.target.value }); invalidate(); }} rows={2} className={inputClass} />
          </label>
        </div>
      )}

      {type === "phone" && (
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Phone number</span>
          <input value={phone} onChange={(e) => { setPhone(e.target.value); invalidate(); }} inputMode="tel" placeholder="+1 555 000 1234" className={inputClass} />
        </label>
      )}

      <details className="rounded-2xl border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium">Design &amp; quality options</summary>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Size (px)</span>
            <input
              type="number"
              min={128}
              max={2048}
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); invalidate(); }}
              className={`w-28 ${inputClass}`}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Foreground</span>
            <input type="color" value={color} onChange={(e) => { setColor(e.target.value); invalidate(); }} className="h-10 w-16 rounded-lg border border-border" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Background</span>
            <input type="color" value={background} onChange={(e) => { setBackground(e.target.value); invalidate(); }} className="h-10 w-16 rounded-lg border border-border" />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <span className="text-sm font-medium">Error correction</span>
          <div className="flex flex-wrap gap-2">
            {ERROR_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => { setErrorCorrection(level.id); invalidate(); }}
                title={level.hint}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  errorCorrection === level.id ? "bg-primary text-primary-foreground" : "border border-border"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{ERROR_LEVELS.find((l) => l.id === errorCorrection)?.hint}</span>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Keep a light background behind dark modules — inverted or low-contrast codes often fail to scan.
        </p>
      </details>

      <button
        onClick={run}
        disabled={!payload.trim() || busy}
        className="w-fit rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground disabled:opacity-50"
      >
        {busy ? "Generating…" : "Generate QR Code"}
      </button>

      {error && <p className="text-destructive">{error}</p>}

      <p className="text-sm text-muted-foreground">
        Need to read a code instead?{" "}
        <Link href="/tools/qr-scanner" className="text-primary underline underline-offset-2">
          Scan a QR code
        </Link>{" "}
        with your camera or from an image.
      </p>

      {png && previewUrl && (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-border p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="Generated QR code" className="h-48 w-48" style={{ backgroundColor: background }} />
          <div className="flex flex-wrap gap-3">
            <DownloadButton blob={png} filename="qr-code.png" label="Download PNG" />
            {svg && <DownloadButton blob={svg} filename="qr-code.svg" label="Download SVG" />}
            <CopyButton value={payload} label="Copy encoded data" />
          </div>
          <p className="text-xs text-muted-foreground">
            This is a static QR code: the data lives in the pattern itself, so it never expires and needs no
            account or tracking redirect. SVG stays sharp at any print size.
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
