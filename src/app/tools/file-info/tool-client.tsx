"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import FileDropzone from "@/components/FileDropzone";
import { inspectFile, type FileInfoResult } from "@/lib/fileInfo";
import { formatBytes } from "@/lib/imageCore";

export default function FileInfoPage() {
  const [info, setInfo] = useState<FileInfoResult | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(file: File) {
    setBusy(true);
    try {
      const result = await inspectFile(file);
      setInfo(result);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ToolLayout title="File Info Checker" description="Inspect a file's type, size, dimensions, or page count.">
      <FileDropzone onFiles={(files) => run(files[0])} label="Click or drop any file here" />

      {busy && <p className="text-sm text-muted-foreground">Reading file…</p>}

      {info && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border border-border p-5 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="break-all">{info.name}</dd>
          <dt className="text-muted-foreground">Type</dt>
          <dd>{info.type}</dd>
          <dt className="text-muted-foreground">Size</dt>
          <dd>{formatBytes(info.sizeBytes)}</dd>
          <dt className="text-muted-foreground">Last modified</dt>
          <dd>{info.lastModified}</dd>
          {info.width && info.height && (
            <>
              <dt className="text-muted-foreground">Dimensions</dt>
              <dd>{info.width} × {info.height}px</dd>
            </>
          )}
          {info.pageCount !== undefined && (
            <>
              <dt className="text-muted-foreground">Pages</dt>
              <dd>{info.pageCount}</dd>
            </>
          )}
        </dl>
      )}
    </ToolLayout>
  );
}
