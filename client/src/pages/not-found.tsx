import { PROFILE } from "@/lib/content";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground">
      <p className="font-mono text-[11px] tracking-[0.22em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl italic">Page not found.</h1>
      <a
        href="/"
        className="mt-8 text-[13px] text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
      >
        Back to {PROFILE.name}
      </a>
    </div>
  );
}
