import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EXPAND_TRANSITION = {
  duration: 0.24,
  ease: [0.22, 1, 0.36, 1] as const,
};

/**
 * Rotating '+' indicator for collapsible rows.
 */
export function ExpandIndicator({
  open,
  className,
}: {
  open: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[11px] text-muted-foreground transition-[transform,color] duration-200 group-hover:text-foreground",
        open && "rotate-45 text-foreground",
        className
      )}
      aria-hidden
    >
      +
    </span>
  );
}

/**
 * Animated vertical collapse/expand container for row details.
 */
export function ExpandablePanel({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={EXPAND_TRANSITION}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Editorial bulleted list used inside expanded experience and project rows.
 */
export function BulletList({
  bullets,
  className,
}: {
  bullets: readonly string[];
  className?: string;
}) {
  if (bullets.length === 0) return null;

  return (
    <ul
      className={cn(
        "space-y-1.5 text-[13.5px] leading-relaxed text-muted-foreground",
        className
      )}
    >
      {bullets.map((bullet) => (
        <li key={bullet} className="flex gap-2.5">
          <span className="mt-[9px] h-px w-2.5 shrink-0 bg-border" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Inline dot-separated technical tag strip.
 */
export function TechList({
  technologies,
  className,
}: {
  technologies: readonly string[];
  className?: string;
}) {
  if (technologies.length === 0) return null;

  return (
    <div
      className={cn(
        "mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground",
        className
      )}
    >
      {technologies.map((tech, i) => (
        <span key={tech} className="flex items-center gap-x-2">
          {i > 0 && <span aria-hidden>·</span>}
          <span>{tech}</span>
        </span>
      ))}
    </div>
  );
}
