"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface JsonTreeProps {
  value: unknown;
  name?: string;
  depth?: number;
  defaultOpen?: boolean;
}

/** Collapsible viewer so a big payload can be explored instead of scrolled. */
export function JsonTree({ value, name, depth = 0, defaultOpen = true }: JsonTreeProps) {
  const [open, setOpen] = useState(defaultOpen || depth < 2);

  const isArray = Array.isArray(value);
  const isObject = value !== null && typeof value === "object";

  if (!isObject) {
    return (
      <div className="flex gap-2 font-mono text-xs leading-6">
        {name !== undefined && <span className="text-muted-foreground">{name}:</span>}
        <span className={primitiveClass(value)}>{formatPrimitive(value)}</span>
      </div>
    );
  }

  const entries = isArray
    ? (value as unknown[]).map((v, i) => [String(i), v] as const)
    : Object.entries(value as Record<string, unknown>);

  return (
    <div className="font-mono text-xs leading-6">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 hover:text-primary"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        {name !== undefined && <span className="text-muted-foreground">{name}:</span>}
        <span className="text-muted-foreground">
          {isArray ? `Array(${entries.length})` : `Object(${entries.length})`}
        </span>
      </button>

      {open && (
        <div className="ml-3 border-l border-border pl-3">
          {entries.map(([key, child]) => (
            <JsonTree key={key} name={key} value={child} depth={depth + 1} />
          ))}
          {entries.length === 0 && <span className="text-muted-foreground">empty</span>}
        </div>
      )}
    </div>
  );
}

function formatPrimitive(value: unknown): string {
  if (typeof value === "string") return `"${value}"`;
  return String(value);
}

function primitiveClass(value: unknown): string {
  if (typeof value === "string") return "text-emerald-700 dark:text-emerald-400";
  if (typeof value === "number") return "text-blue-700 dark:text-blue-400";
  if (typeof value === "boolean") return "text-purple-700 dark:text-purple-400";
  return "text-muted-foreground";
}
