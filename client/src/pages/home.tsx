import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Projects from "@/components/sections/projects";
import Experience from "@/components/sections/experience";
import Skills from "@/components/sections/skills";
import Games from "@/components/sections/games";
import Contact from "@/components/sections/contact";

export default function Home() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#')) {
        e.preventDefault();
        const id = target.href.split('#')[1];
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Navigation active state
    const updateActiveNav = () => {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');
      
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 200 && sectionTop + sectionHeight > 200) {
          current = section.getAttribute('id') || '';
        }
      });

      navLinks.forEach(link => {
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href === `#${current}`) {
          link.classList.add('text-foreground');
          link.classList.remove('text-muted-foreground');
        } else {
          link.classList.remove('text-foreground');
          link.classList.add('text-muted-foreground');
        }
      });
    };

    document.addEventListener('click', handleNavClick);
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Call once on load

    return () => {
      document.removeEventListener('click', handleNavClick);
      window.removeEventListener('scroll', updateActiveNav);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Games />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
