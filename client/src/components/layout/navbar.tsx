import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { Container } from "@/components/layout/page-shell";
import { useTheme } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "experience", href: "#experience", label: "Experience" },
  { id: "projects", href: "#projects", label: "Projects" },
  { id: "contact", href: "#contact", label: "Contact" },
] as const;

export default function Navbar({ activeId }: { activeId?: string }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "text-[13px] transition-colors hover:text-foreground",
                  active ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-2.5 py-3.5">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors",
                  activeId === item.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </Container>
        </div>
      )}
    </header>
  );
}
