import { Container } from "@/components/layout/page-shell";
import { PROFILE } from "@/lib/content";

const LINKS = [
  { href: PROFILE.github, label: "GitHub" },
  { href: PROFILE.linkedin, label: "LinkedIn" },
  { href: `mailto:${PROFILE.email}`, label: "Email" },
];

export default function Hero() {
  return (
    <section id="home" className="relative pt-24 pb-10 md:pt-28 md:pb-12">
      <Container>
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
          {PROFILE.location}
        </p>

        <h1 className="mt-5 font-display text-[2.75rem] leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          {PROFILE.name}
        </h1>

        <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-muted-foreground md:text-lg">
          Incoming @ Optiver. CS at Purdue. Previously Amazon, Handshake,
          and Caterpillar.
        </p>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="text-foreground underline decoration-border underline-offset-[6px] transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
