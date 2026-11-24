import { cn } from "@/lib/utils";

export default function SectionHeading({
  index,
  title,
  className,
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-7 md:mb-9", className)}>
      <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
        {index}
      </p>
      <h2 className="mt-2 font-display text-3xl italic text-foreground md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
