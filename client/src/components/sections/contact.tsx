import { PROFILE } from "@/lib/content";
import SectionHeading from "@/components/fx/section-heading";
import { useToast } from "@/hooks/use-toast";
import { logEvent } from "@/hooks/useGoogleAnalytics";

const linkClass =
  "block max-w-full break-all text-left font-display text-xl italic tracking-tight text-foreground transition-opacity hover:opacity-70 sm:text-3xl";

export default function Contact() {
  const { toast } = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      toast({ title: "Copied", description: PROFILE.email });
      logEvent({
        action: "copy_email",
        category: "Contact",
        label: "Email",
      });
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const githubLabel = PROFILE.github.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const linkedinLabel = PROFILE.linkedin.replace(/^https?:\/\//, "").replace(/^www\./, "");

  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-page px-6 md:px-10 lg:px-12">
        <SectionHeading index="03" title="Contact" />

        <p className="max-w-md text-[17px] leading-relaxed text-muted-foreground">
          Reach me by email.
        </p>

        <div className="mt-8 space-y-4">
          <button type="button" onClick={copyEmail} className={linkClass}>
            {PROFILE.email}
          </button>
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
      </div>
    </section>
  );
}
