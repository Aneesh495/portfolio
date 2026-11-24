import Navbar from "@/components/layout/navbar";
import Contact from "@/components/sections/contact";
import Experience from "@/components/sections/experience";
import Hero from "@/components/sections/hero";
import Projects from "@/components/sections/projects";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = ["experience", "projects", "contact"] as const;

export default function Home() {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar activeId={activeId} />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
