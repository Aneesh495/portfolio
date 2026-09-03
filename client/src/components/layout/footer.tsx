import { PROFILE } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-page flex-col gap-2 px-6 py-8 text-[12px] text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10 lg:px-12">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <span className="font-mono">{PROFILE.university}</span>
      </div>
    </footer>
  );
}
