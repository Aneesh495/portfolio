import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy load heavy components
const Navbar = lazy(() => import('@/components/layout/navbar'));
const Footer = lazy(() => import('@/components/layout/footer'));
const Hero = lazy(() => import('@/components/sections/hero'));
const About = lazy(() => import('@/components/sections/about'));
const Projects = lazy(() => import('@/components/sections/projects'));
const Experience = lazy(() => import('@/components/sections/experience'));
const Skills = lazy(() => import('@/components/sections/skills'));
const Games = lazy(() => import('@/components/sections/games'));
const Contact = lazy(() => import('@/components/sections/contact'));

// Loading component for sections
const SectionLoading = () => (
  <div className="flex h-64 w-full items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Wrapper component for lazy loaded sections with animation
const LazySection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.5 }}
    className="w-full"
  >
    <Suspense fallback={<SectionLoading />}>
      {children}
    </Suspense>
  </motion.div>
);

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

  // Only load heavy components after initial render
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Section wrapper component to handle IDs
  const Section = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-20">
      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-background">
      {isClient && (
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
      )}
      
      <main className="overflow-hidden">
        <LazySection>
          <Section id="home">
            <Hero />
          </Section>
        </LazySection>
        
        <LazySection>
          <Section id="about">
            <About />
          </Section>
        </LazySection>
        
        <LazySection>
          <Section id="skills">
            <Skills />
          </Section>
        </LazySection>
        
        <LazySection>
          <Section id="experience">
            <Experience />
          </Section>
        </LazySection>
        
        <LazySection>
          <Section id="projects">
            <Projects />
          </Section>
        </LazySection>
        
        <LazySection>
          <Section id="games">
            <Games />
          </Section>
        </LazySection>
        
        <LazySection>
          <Section id="contact">
            <Contact />
          </Section>
        </LazySection>
      </main>
      
      {isClient && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
}
