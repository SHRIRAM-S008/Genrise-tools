"use client";

import { useEffect, useMemo } from "react";

/**
 * Creates an object URL for a Blob/File and revokes it when the source
 * changes or the component unmounts. Always prefer this over calling
 * URL.createObjectURL inline in JSX, which mints a fresh URL every render.
 */
export function useObjectUrl(source: Blob | File | null | undefined): string | null {
  const url = useMemo(() => (source ? URL.createObjectURL(source) : null), [source]);

  useEffect(() => {
    if (!url) return;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}
