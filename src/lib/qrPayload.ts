export type QrContentType = "url" | "text" | "wifi" | "vcard" | "email" | "sms" | "phone";

export interface WifiPayload {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VCardPayload {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  email: string;
  website: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
}

export interface SmsPayload {
  number: string;
  message: string;
}

export const CONTENT_TYPES: { id: QrContentType; label: string; hint: string }[] = [
  { id: "url", label: "URL", hint: "Open a website when scanned" },
  { id: "text", label: "Text", hint: "Show plain text when scanned" },
  { id: "wifi", label: "Wi-Fi", hint: "Join a network without typing the password" },
  { id: "vcard", label: "Contact", hint: "Save a contact card (vCard)" },
  { id: "email", label: "Email", hint: "Start a pre-filled email" },
  { id: "sms", label: "SMS", hint: "Start a pre-filled text message" },
  { id: "phone", label: "Phone", hint: "Dial a number" },
];

/** Wi-Fi and vCard payloads are delimited formats, so separators must be escaped. */
function escapeWifi(value: string): string {
  return value.replace(/([\;,:"])/g, "\\$1");
}

function escapeVCard(value: string): string {
  return value.replace(/([\;,])/g, "\\$1").replace(/\n/g, "\\n");
}

/** Adds a scheme when the user typed a bare domain like "example.com". */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function buildWifiPayload(wifi: WifiPayload): string {
  const parts = [`T:${wifi.encryption}`, `S:${escapeWifi(wifi.ssid)}`];
  if (wifi.encryption !== "nopass") parts.push(`P:${escapeWifi(wifi.password)}`);
  if (wifi.hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

export function buildVCardPayload(card: VCardPayload): string {
  const name = `${escapeVCard(card.lastName)};${escapeVCard(card.firstName)};;;`;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${name}`,
    `FN:${escapeVCard(`${card.firstName} ${card.lastName}`.trim())}`,
  ];
  if (card.organization) lines.push(`ORG:${escapeVCard(card.organization)}`);
  if (card.title) lines.push(`TITLE:${escapeVCard(card.title)}`);
  if (card.phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(card.phone)}`);
  if (card.email) lines.push(`EMAIL:${escapeVCard(card.email)}`);
  if (card.website) lines.push(`URL:${normalizeUrl(card.website)}`);
  lines.push("END:VCARD");
  return lines.join("\n");
}

export function buildEmailPayload(email: EmailPayload): string {
  // URLSearchParams would encode spaces as "+", which several mail clients
  // show literally in a mailto subject — percent-encoding is safer here.
  const params: string[] = [];
  if (email.subject) params.push(`subject=${encodeURIComponent(email.subject)}`);
  if (email.body) params.push(`body=${encodeURIComponent(email.body)}`);
  return `mailto:${email.to.trim()}${params.length ? `?${params.join("&")}` : ""}`;
}

export function buildSmsPayload(sms: SmsPayload): string {
  const number = sms.number.replace(/[^\d+]/g, "");
  return sms.message ? `SMSTO:${number}:${sms.message}` : `SMSTO:${number}`;
}

export function buildPhonePayload(number: string): string {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
