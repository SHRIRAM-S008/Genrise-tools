"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  label?: string;
}

export default function DownloadButton({ blob, filename, label = "Download" }: DownloadButtonProps) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="inline-block"
    >
      <Button size="lg" className="rounded-full" nativeButton={false} render={<a href={url} download={filename} />}>
        <Download className="size-4" />
        {label}
      </Button>
    </motion.div>
  );
}
