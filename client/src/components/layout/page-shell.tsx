import type { ReactNode } from "react";
import SectionHeading from "@/components/fx/section-heading";
import { cn } from "@/lib/utils";

/**
 * Shared horizontal page measure and responsive gutter.
 */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-page px-6 md:px-10", className)}>
      {children}
    </div>
  );
}

/**
 * Numbered portfolio section with consistent vertical cadence and heading.
 */
export function PageSection({
  id,
  index,
  title,
  children,
  className,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-12 md:py-16", className)}>
      <Container>
        <SectionHeading index={index} title={title} />
        {children}
      </Container>
    </section>
  );
}
