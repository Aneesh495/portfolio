import { PROFILE } from "@/lib/content";

const links = [
  { href: PROFILE.github, label: "GitHub" },
  { href: PROFILE.linkedin, label: "LinkedIn" },
  { href: `mailto:${PROFILE.email}`, label: "Email" },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative pt-28 pb-16 md:pt-36 md:pb-20"
    >
      <div className="mx-auto w-full max-w-page px-6 md:px-10 lg:px-12">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground">
          {PROFILE.location}
        </p>

        <h1 className="mt-6 font-display text-[2.6rem] leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[5.5rem]">
          {PROFILE.name}
        </h1>

        <p className="mt-8 max-w-3xl text-[17px] leading-relaxed text-muted-foreground md:text-lg">
          I study computer science at Purdue. Recently I worked on systems at
          Amazon, alignment at Handshake, and forecasting at Caterpillar.
        </p>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-foreground underline decoration-border underline-offset-[6px] transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
