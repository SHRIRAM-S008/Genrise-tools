"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ShareButtons } from "@/components/share-buttons";
import { ToolSample } from "@/components/tool-sample";
import { tools } from "@/lib/tools";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { categoryTileClass } from "@/lib/categoryStyles";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  const pathname = usePathname();
  const slug = pathname.split("/").pop() ?? "";
  const tool = tools.find((t) => t.slug === slug);
  const reducedMotion = useReducedMotion();

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
      >
        {tool && (
          <div className="mb-3 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${categoryTileClass[tool.category]}`}
            >
              <tool.icon className="size-3.5" strokeWidth={2} />
              {tool.category}
            </span>
          </div>
        )}

        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>

        <div className="mt-4">
          <ShareButtons title={title} slug={slug} />
        </div>
      </motion.div>

      <motion.div
        className="mt-6 flex flex-col gap-5 sm:mt-8 sm:gap-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition, delay: reducedMotion ? 0 : 0.08 }}
      >
        {children}
      </motion.div>

      <ToolSample slug={slug} />
    </main>
  );
}
