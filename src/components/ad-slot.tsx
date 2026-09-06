interface AdSlotProps {
  label?: string;
  className?: string;
  /** Reserve the layout space without rendering a visible placeholder box. */
  visible?: boolean;
}

export function AdSlot({ label = "Advertisement", className = "", visible = false }: AdSlotProps) {
  return (
    <div
      className={`hidden xl:sticky xl:top-24 xl:flex xl:h-[600px] xl:w-[160px] xl:shrink-0 xl:flex-col xl:items-center xl:justify-center xl:text-center ${
        visible ? "xl:rounded-2xl xl:border xl:border-dashed xl:border-border xl:bg-muted/30" : ""
      } ${className}`}
      aria-hidden
    >
      {visible && (
        <>
          <span className="text-xs tracking-wide text-muted-foreground uppercase">{label}</span>
          <span className="mt-1 text-[10px] text-muted-foreground/70">160 × 600</span>
        </>
      )}
    </div>
  );
}
