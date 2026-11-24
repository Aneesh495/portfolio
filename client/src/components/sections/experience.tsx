import {
  BulletList,
  ExpandablePanel,
  ExpandIndicator,
  TechList,
} from "@/components/fx/expandable-panel";
import { PageSection } from "@/components/layout/page-shell";
import { useExpandedSet } from "@/hooks/use-expanded-set";
import { EXPERIENCES } from "@/lib/content";

export default function Experience() {
  const { isOpen, toggle } = useExpandedSet();

  return (
    <PageSection id="experience" index="01" title="Experience">
      <div className="divide-y divide-border border-y border-border">
        {EXPERIENCES.map((job) => {
          const open = isOpen(job.id);
          return (
            <article key={job.id}>
              <button
                type="button"
                onClick={() => toggle(job.id)}
                className="group flex w-full items-start gap-6 py-4 text-left transition-colors md:gap-8 md:py-5"
                aria-expanded={open}
              >
                <span className="hidden w-24 shrink-0 pt-0.5 font-mono text-[11px] leading-relaxed text-muted-foreground md:block">
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
                </span>

                <ExpandIndicator open={open} className="mt-1 shrink-0" />
              </button>

              <ExpandablePanel open={open}>
                <div className="pb-6 md:pl-32">
                  <p className="max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
                    {job.summary}
                  </p>
                  <BulletList
                    bullets={job.bullets}
                    className="mt-3 max-w-2xl space-y-2 text-[14px]"
                  />
                  <TechList technologies={job.technologies} className="mt-4" />
                </div>
              </ExpandablePanel>
            </article>
          );
        })}
      </div>
    </PageSection>
  );
}
