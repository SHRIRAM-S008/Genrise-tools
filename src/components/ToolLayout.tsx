"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ShareButtons } from "@/components/share-buttons";
import { ToolSample } from "@/components/tool-sample";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() ?? "";

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:py-10">
      <Link
        href="/tools"
        className="mb-4 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary active:text-primary sm:mb-6"
      >
        <ArrowLeft className="size-3.5" />
        All tools
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>

        <div className="mt-4">
          <ShareButtons title={title} slug={slug} />
        </div>

        <div className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6">{children}</div>

        <ToolSample slug={slug} />
      </motion.div>
    </main>
  );
}
