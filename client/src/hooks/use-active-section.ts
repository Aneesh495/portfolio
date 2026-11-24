import { useEffect, useState } from "react";

/**
 * Tracks which section ID is currently anchored in the viewport.
 */
export function useActiveSection(sectionIds: readonly string[]) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const updateFromScroll = () => {
      const threshold = 140;
      let current = "";

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold && rect.bottom > threshold) {
          current = el.id;
          break;
        }
      }

      // Activate the last section when scrolled to the bottom of a compact page.
      if (
        !current &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 24
      ) {
        current = elements[elements.length - 1].id;
      }

      setActiveId(current);
    };

    const observer = new IntersectionObserver(updateFromScroll, {
      rootMargin: "-140px 0px -45% 0px",
      threshold: [0, 0.25, 0.5, 1],
    });

    for (const el of elements) observer.observe(el);
    window.addEventListener("scroll", updateFromScroll, { passive: true });
    updateFromScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateFromScroll);
    };
  }, [sectionIds]);

  return activeId;
}
