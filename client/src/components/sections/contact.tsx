import { PageSection } from "@/components/layout/page-shell";
import { logEvent } from "@/hooks/useGoogleAnalytics";
import { PROFILE } from "@/lib/content";

const linkClass =
  "block w-fit max-w-full break-all text-left font-display text-xl italic tracking-tight text-foreground transition-opacity hover:opacity-70 sm:text-3xl";

export default function Contact() {
  const githubLabel = PROFILE.github
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");
  const linkedinLabel = PROFILE.linkedin
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "");

  return (
    <PageSection
      id="contact"
      index="03"
      title="Contact"
      className="pb-16 md:pb-20"
    >
      <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground">
        Reach me by email.
      </p>

      <div className="mt-6 space-y-3">
        <a
          href={`mailto:${PROFILE.email}`}
          onClick={() =>
            logEvent({
              action: "click_email",
              category: "Contact",
              label: "Email",
            })
          }
          className={linkClass}
        >
          {PROFILE.email}
        </a>
        <a
          href={PROFILE.github}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {githubLabel}
        </a>
        <a
          href={PROFILE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {linkedinLabel}
        </a>
      </div>
    </PageSection>
  );
}
