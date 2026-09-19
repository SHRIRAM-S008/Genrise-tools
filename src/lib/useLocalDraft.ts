"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  // Only fires for edits made in *other* tabs, which is exactly what we want
  // to pick up; our own writes go through setValue.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Like useState, but mirrored into localStorage so a long form (resume,
 * invoice) survives a refresh or an accidental tab close. The stored value is
 * read through useSyncExternalStore so the server render stays deterministic
 * and hydration doesn't mismatch.
 */
export function useLocalDraft<T>(key: string, initialValue: T) {
  const stored = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );

  const [edited, setEdited] = useState<T | null>(null);

  const storedValue = parse<T>(stored);
  const value = edited ?? storedValue ?? initialValue;

  function setValue(update: T | ((previous: T) => T)) {
    setEdited((previous) => {
      const base = previous ?? storedValue ?? initialValue;
      return typeof update === "function" ? (update as (previous: T) => T)(base) : update;
    });
  }

  // Sync the current value out to storage (an external system), never back in.
  useEffect(() => {
    if (edited === null) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(edited));
    } catch {
      // Quota exceeded or private mode — the draft just won't persist.
    }
  }, [key, edited]);

  const clearDraft = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
    setEdited(initialValue);
  }, [key, initialValue]);

  return {
    value,
    setValue,
    clearDraft,
    /** A saved draft was loaded and hasn't been touched yet. */
    restored: edited === null && storedValue !== null,
  } as const;
}
