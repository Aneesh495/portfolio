import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EXPERIENCES } from "@/lib/content";
import SectionHeading from "@/components/fx/section-heading";
import { cn } from "@/lib/utils";

export default function Experience() {
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(EXPERIENCES[0] ? [EXPERIENCES[0].id] : [])
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="mx-auto max-w-page px-6 md:px-10 lg:px-12">
        <SectionHeading index="01" title="Experience" />

        <div className="divide-y divide-border border-y border-border">
          {EXPERIENCES.map((job) => {
            const open = openIds.has(job.id);
            return (
              <article key={job.id}>
                <button
                  type="button"
                  onClick={() => toggle(job.id)}
                  className="group flex w-full items-start gap-6 py-6 text-left transition-colors md:gap-10 md:py-7"
                  aria-expanded={open}
                >
                  <span className="hidden w-36 shrink-0 pt-1 font-mono text-[11px] leading-relaxed text-muted-foreground md:block">
                    {job.period}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      <span className="text-[15px] font-semibold text-foreground md:text-base">
                        {job.company}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-[15px] text-foreground/80 md:text-base">
                        {job.role}
                      </span>
                    </span>
                    <span className="mt-1 block font-mono text-[11px] text-muted-foreground md:hidden">
                      {job.period}
                    </span>
                    <span
                      className={cn(
                        "mt-2 block max-w-2xl text-[14px] leading-relaxed text-muted-foreground transition-colors",
                        open && "text-foreground/80"
                      )}
                    >
                      {job.summary}
                    </span>
                  </span>

                  <span
                    className={cn(
                      "mt-1 font-mono text-[11px] text-muted-foreground transition-transform duration-200",
                      open && "rotate-45"
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 md:pl-[10.5rem]">
                        <ul className="max-w-2xl space-y-2.5 text-[14px] leading-relaxed text-muted-foreground">
                          {job.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3">
                              <span className="mt-[9px] h-px w-3 shrink-0 bg-border" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-5 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-muted-foreground">
                          {job.technologies.map((tech, i) => (
                            <span key={tech} className="flex items-center gap-x-2">
                              {i > 0 && <span aria-hidden>·</span>}
                              <span>{tech}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
