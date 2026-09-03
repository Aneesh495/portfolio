import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/lib/content";
import SectionHeading from "@/components/fx/section-heading";
import { cn } from "@/lib/utils";

export default function Projects() {
  const [openTitles, setOpenTitles] = useState<Set<string>>(() => new Set());

  const toggle = (title: string) => {
    setOpenTitles((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  };

  return (
    <section id="projects" className="py-24 md:py-32">
      <div className="mx-auto max-w-page px-6 md:px-10 lg:px-12">
        <SectionHeading index="02" title="Selected work" />

        <div className="space-y-3">
          {PROJECTS.map((project, i) => {
            const open = openTitles.has(project.title);
            return (
              <article
                key={project.title}
                className="border-t border-border pt-6 last:border-b last:pb-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggle(project.title)}
                    className="min-w-0 flex-1 text-left"
                    aria-expanded={open}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        0{i + 1}
                      </span>
                      <h3 className="text-lg font-medium tracking-tight text-foreground md:text-xl">
                        {project.title}
                      </h3>
                      <span className="hidden text-[13px] text-muted-foreground sm:inline">
                        {project.blurb}
                      </span>
                    </div>
                  </button>

                  <div className="flex shrink-0 items-center gap-3 pt-1">
                    {project.href && (
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-0.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {project.hrefLabel}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => toggle(project.title)}
                      className={cn(
                        "font-mono text-[11px] text-muted-foreground transition-transform duration-200",
                        open && "rotate-45"
                      )}
                      aria-label={open ? "Collapse" : "Expand"}
                    >
                      +
                    </button>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-5 sm:pl-8">
                        <p className="sm:hidden mb-2 text-[13px] text-muted-foreground">
                          {project.blurb}
                        </p>
                        <p className="font-mono text-[12px] text-muted-foreground">
                          {project.signal}
                        </p>
                        <ul className="mt-3 max-w-2xl space-y-2.5 text-[14px] leading-relaxed text-muted-foreground">
                          {project.bullets.map((bullet) => (
                            <li key={bullet} className="flex gap-3">
                              <span className="mt-[9px] h-px w-3 shrink-0 bg-border" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 flex flex-wrap items-center gap-x-2 font-mono text-[11px] text-muted-foreground">
                          {project.technologies.map((tech, i) => (
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
