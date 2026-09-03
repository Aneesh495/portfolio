import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Contact from "@/components/sections/contact";

export default function Home() {
  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes("#")) {
        const id = target.href.split("#")[1];
        if (!id) return;
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };

    const updateActiveNav = () => {
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-link");
      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = (section as HTMLElement).clientHeight;
        if (sectionTop <= 160 && sectionTop + sectionHeight > 160) {
          current = section.getAttribute("id") || "";
        }
      });
      navLinks.forEach((link) => {
        const href = (link as HTMLAnchorElement).getAttribute("href");
        if (href === `#${current}`) {
          link.classList.add("text-foreground");
          link.classList.remove("text-muted-foreground");
        } else {
          link.classList.remove("text-foreground");
          link.classList.add("text-muted-foreground");
        }
      });
    };

    document.addEventListener("click", handleNavClick);
    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();

    return () => {
      document.removeEventListener("click", handleNavClick);
      window.removeEventListener("scroll", updateActiveNav);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
