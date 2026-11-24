import { ArrowUpRight } from "lucide-react";
import {
  BulletList,
  ExpandablePanel,
  ExpandIndicator,
  TechList,
} from "@/components/fx/expandable-panel";
import { PageSection } from "@/components/layout/page-shell";
import { useExpandedSet } from "@/hooks/use-expanded-set";
import { PROJECTS } from "@/lib/content";

export default function Projects() {
  const { isOpen, toggle } = useExpandedSet();

  return (
    <PageSection id="projects" index="02" title="Selected work">
      <div className="divide-y divide-border border-y border-border">
        {PROJECTS.map((project, i) => {
          const open = isOpen(project.title);
          return (
            <article key={project.title}>
              <div className="flex items-start justify-between gap-4 py-4 md:py-5">
                <button
                  type="button"
                  onClick={() => toggle(project.title)}
                  className="group min-w-0 flex-1 text-left"
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
                    className="group p-0.5"
                    aria-label={
                      open
                        ? `Collapse ${project.title}`
                        : `Expand ${project.title}`
                    }
                    aria-expanded={open}
                  >
                    <ExpandIndicator open={open} />
                  </button>
                </div>
              </div>

              <ExpandablePanel open={open}>
                <div className="pb-6 sm:pl-7">
                  <p className="mb-2 text-[13px] text-muted-foreground sm:hidden">
                    {project.blurb}
                  </p>
                  <p className="font-mono text-[12px] text-muted-foreground">
                    {project.signal}
                  </p>
                  <BulletList
                    bullets={project.bullets}
                    className="mt-3 max-w-2xl space-y-2 text-[14px]"
                  />
                  <TechList technologies={project.technologies} className="mt-4" />
                </div>
              </ExpandablePanel>
            </article>
          );
        })}
      </div>
    </PageSection>
  );
}
