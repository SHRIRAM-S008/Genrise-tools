export interface RecordingFormat {
  mimeType: string;
  extension: string;
  label: string;
}

const VIDEO_FORMATS: RecordingFormat[] = [
  { mimeType: "video/mp4;codecs=avc1", extension: "mp4", label: "MP4" },
  { mimeType: "video/mp4", extension: "mp4", label: "MP4" },
  { mimeType: "video/webm;codecs=vp9,opus", extension: "webm", label: "WebM (VP9)" },
  { mimeType: "video/webm", extension: "webm", label: "WebM" },
];

const AUDIO_FORMATS: RecordingFormat[] = [
  { mimeType: "audio/mp4", extension: "m4a", label: "M4A" },
  { mimeType: "audio/webm;codecs=opus", extension: "webm", label: "WebM (Opus)" },
  { mimeType: "audio/webm", extension: "webm", label: "WebM" },
  { mimeType: "audio/ogg;codecs=opus", extension: "ogg", label: "OGG" },
];

/**
 * Browsers disagree on what MediaRecorder can produce — Safari only does MP4,
 * Chrome/Firefox prefer WebM — so offer whatever this browser actually
 * supports rather than hardcoding one container.
 */
export function supportedFormats(kind: "audio" | "video"): RecordingFormat[] {
  if (typeof MediaRecorder === "undefined") return [];
  const candidates = kind === "video" ? VIDEO_FORMATS : AUDIO_FORMATS;
  const seen = new Set<string>();
  return candidates.filter((format) => {
    if (!MediaRecorder.isTypeSupported(format.mimeType)) return false;
    if (seen.has(format.extension)) return false;
    seen.add(format.extension);
    return true;
  });
}

const cache = new Map<string, RecordingFormat[]>();
export const NO_FORMATS: RecordingFormat[] = [];

/**
 * Stable-identity wrapper so components can read the list through
 * useSyncExternalStore without a hydration mismatch (the server snapshot is
 * always the empty list).
 */
export function cachedFormats(kind: "audio" | "video"): RecordingFormat[] {
  const existing = cache.get(kind);
  if (existing) return existing;
  const formats = supportedFormats(kind);
  cache.set(kind, formats);
  return formats;
}

export function subscribeToFormats() {
  // The supported list never changes for the life of the page.
  return () => {};
}

/** Mixes extra tracks (e.g. a microphone) into a display-capture stream. */
export function combineStreams(...streams: MediaStream[]): MediaStream {
  const combined = new MediaStream();
  for (const stream of streams) {
    stream.getTracks().forEach((track) => combined.addTrack(track));
  }
  return combined;
}
