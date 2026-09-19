export interface ScanResult {
  /** Raw decoded payload. */
  text: string;
  /** Recognised payload shape, for friendlier display. */
  kind: "url" | "wifi" | "vcard" | "email" | "sms" | "phone" | "text";
  fields?: { label: string; value: string }[];
  /** Safe to render as a link (http/https only). */
  href?: string;
}

interface BarcodeDetectorLike {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
  getSupportedFormats?: () => Promise<string[]>;
}

function nativeDetector(): BarcodeDetectorConstructor | null {
  const ctor = (globalThis as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
  return typeof ctor === "function" ? ctor : null;
}

export function isCameraSupported(): boolean {
  return typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
}

export interface CameraFailure {
  message: string;
  /** Extra guidance shown under the message, when we can be specific. */
  hint?: string;
}

/**
 * getUserMedia fails for half a dozen genuinely different reasons and they
 * need genuinely different fixes — "denied or unavailable" helps nobody.
 */
export function describeCameraError(error: unknown): CameraFailure {
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return {
      message: "Your browser blocks camera access on this connection.",
      hint: "Cameras only work on HTTPS or on localhost. If you opened this page over plain http:// (for example a local IP like 192.168.x.x), reopen it via https:// or localhost.",
    };
  }

  if (!isCameraSupported()) {
    return {
      message: "This browser doesn't expose a camera API.",
      hint: "Try Chrome, Edge, Firefox or Safari — or scan a saved image instead.",
    };
  }

  const name = error instanceof DOMException ? error.name : "";

  switch (name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return {
        message: "Camera permission was denied.",
        hint: "Click the camera or lock icon in the address bar and allow camera access for this site, then try again. On macOS also check System Settings → Privacy & Security → Camera.",
      };
    case "NotFoundError":
    case "DevicesNotFoundError":
      return {
        message: "No camera was found on this device.",
        hint: "Connect a webcam, or scan a saved image instead.",
      };
    case "NotReadableError":
    case "TrackStartError":
      return {
        message: "The camera is already in use by another app.",
        hint: "Close any app that might be holding it — video calls, camera or streaming software — then try again.",
      };
    case "OverconstrainedError":
      return {
        message: "No camera matched the requested settings.",
        hint: "Pick a different camera from the list and try again.",
      };
    case "SecurityError":
      return {
        message: "Camera access was blocked by your browser's security settings.",
        hint: "Check site permissions for this page, or scan a saved image instead.",
      };
    case "AbortError":
      return { message: "The camera stopped unexpectedly. Try starting it again." };
    default:
      return {
        message: "Couldn't start the camera.",
        hint: error instanceof Error && error.message ? error.message : undefined,
      };
  }
}

/**
 * Asks for the rear camera when there is one, but falls back to any camera:
 * a strict facingMode can fail outright on desktops and external webcams.
 */
export async function requestCameraStream(deviceId?: string): Promise<MediaStream> {
  if (!isCameraSupported()) {
    throw new DOMException("Camera API unavailable", "NotFoundError");
  }

  if (deviceId) {
    return navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } });
  }

  try {
    return await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  } catch (error) {
    const name = error instanceof DOMException ? error.name : "";
    if (name === "OverconstrainedError" || name === "NotFoundError") {
      return navigator.mediaDevices.getUserMedia({ video: true });
    }
    throw error;
  }
}

export interface CameraOption {
  deviceId: string;
  label: string;
}

/** Labels are only populated once permission has been granted at least once. */
export async function listCameras(): Promise<CameraOption[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) return [];
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter((d) => d.kind === "videoinput")
      .map((d, i) => ({ deviceId: d.deviceId, label: d.label || `Camera ${i + 1}` }));
  } catch {
    return [];
  }
}

/**
 * Decodes a QR code from pixel data. Uses the browser's native
 * BarcodeDetector where it exists (Chrome, Edge, Android) and falls back to
 * jsQR everywhere else (Safari, Firefox), so the tool works the same
 * offline in every browser.
 */
export async function decodeImageData(imageData: ImageData, canvas?: HTMLCanvasElement): Promise<string | null> {
  const Detector = nativeDetector();
  if (Detector && canvas) {
    try {
      const detector = new Detector({ formats: ["qr_code"] });
      const [first] = await detector.detect(canvas);
      if (first?.rawValue) return first.rawValue;
    } catch {
      // Native detection unavailable for this source — fall through to jsQR.
    }
  }

  const { default: jsQR } = await import("jsqr");
  const result = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });
  return result?.data ?? null;
}

export async function decodeFromFile(file: File): Promise<string | null> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  // Large photos are downscaled: decoding is more reliable and much faster
  // when the code isn't spread over 12 megapixels.
  const maxDim = 1400;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return decodeImageData(ctx.getImageData(0, 0, width, height), canvas);
}

/** Splits `WIFI:`/vCard style payloads into labelled fields for display. */
export function describeScan(text: string): ScanResult {
  const trimmed = text.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return { text, kind: "url", href: trimmed };
  }

  if (/^WIFI:/i.test(trimmed)) {
    // Drop the scheme first: the first field is "WIFI:T:WPA", so a
    // (?:^|;) anchor would never match the leading T.
    const body = trimmed.replace(/^WIFI:/i, "");
    const get = (key: string) => {
      const match = new RegExp(`(?:^|;)${key}:((?:\\\\.|[^;])*)`, "i").exec(body);
      return match ? match[1].replace(/\\(.)/g, "$1") : "";
    };
    const encryption = get("T") || "nopass";
    return {
      text,
      kind: "wifi",
      fields: [
        { label: "Network (SSID)", value: get("S") },
        { label: "Password", value: get("P") || "(none)" },
        { label: "Security", value: encryption === "nopass" ? "Open" : encryption },
        { label: "Hidden", value: /(?:^|;)H:true/i.test(body) ? "Yes" : "No" },
      ].filter((f) => f.value),
    };
  }

  if (/^BEGIN:VCARD/i.test(trimmed)) {
    const line = (key: string) => {
      const match = new RegExp(`^${key}[^:\\n]*:(.*)$`, "im").exec(trimmed);
      return match ? match[1].replace(/\\(.)/g, "$1").trim() : "";
    };
    return {
      text,
      kind: "vcard",
      fields: [
        { label: "Name", value: line("FN") },
        { label: "Organisation", value: line("ORG") },
        { label: "Title", value: line("TITLE") },
        { label: "Phone", value: line("TEL") },
        { label: "Email", value: line("EMAIL") },
        { label: "Website", value: line("URL") },
      ].filter((f) => f.value),
    };
  }

  if (/^mailto:/i.test(trimmed)) {
    const [address, query] = trimmed.slice(7).split("?");
    const params = new URLSearchParams(query ?? "");
    return {
      text,
      kind: "email",
      fields: [
        { label: "To", value: decodeURIComponent(address) },
        { label: "Subject", value: params.get("subject") ?? "" },
        { label: "Message", value: params.get("body") ?? "" },
      ].filter((f) => f.value),
    };
  }

  if (/^SMSTO:/i.test(trimmed) || /^sms:/i.test(trimmed)) {
    const rest = trimmed.replace(/^(SMSTO|sms):/i, "");
    const [number, ...message] = rest.split(":");
    return {
      text,
      kind: "sms",
      fields: [
        { label: "Number", value: number },
        { label: "Message", value: message.join(":") },
      ].filter((f) => f.value),
    };
  }

  if (/^tel:/i.test(trimmed)) {
    return { text, kind: "phone", fields: [{ label: "Number", value: trimmed.slice(4) }] };
  }

  return { text, kind: "text" };
}
