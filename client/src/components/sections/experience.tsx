import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Systems Developer Intern",
    company: "Amazon",
    period: "May 2026 - Jul 2026",
    description: [
      "Incoming intern",
    ],
    technologies: ["TBD"],
  },
  {
    title: "Data Science Researcher",
    company: "Caterpillar (Data Mine)",
    period: "Aug 2025 – Present",
    description: [
      "Increased CAT’s paint usage efficiency by 10% by consolidating multiple production feeds into a single database",
      "Reduced process evaluation time by 15% with a Power BI dashboard that visualized consumer trends",
      "Minimized unplanned production downtime by 5% using a Django-based reporting tool for system anomalies",
    ],
    technologies: ["Python", "Power BI", "Django", "Statistical Modeling"],
  },
  {
    title: "Software Developer",
    company: "Playtoon It",
    period: "Jun 2025 – Aug 2025",
    description: [
      "Scaled to 250+ concurrent players by optimizing ECS & Netcode, cutting server costs by 40% and packet loss by 25%",
      "Cut latency spikes by 50% through event-driven architecture and object pooling, reducing player churn by 20%",
      "Reduced bandwidth by 35% by compressing serialized data and implementing delta updates",
    ],
    technologies: ["C#", "Unity"],
  },
  {
    title: "Software Engineer",
    company: "Retail Hedging",
    period: "Mar 2025 – May 2025",
    description: [
      "Cut login latency in half by optimizing Auth0 token exchange and introducing lazy-loaded React components",
      "Increased payment reliability to 100% by implementing a secure Auth0–Stripe integration with RS256-signed JWTs",
      "Replaced continuous client polling with a one-time token fetch pipeline, tripling API throughput and improving scalability",
    ],
    technologies: ["React", "TypeScript", "JWTs"],
  },
  {
    title: "Data Science Researcher",
    company: "Purdue CILMAR",
    period: "Jan 2025 – Mar 2025",
    description: [
      "Modeled sentiment trends across 18,000+ student surveys to track COVID’s impact on education and culture",
      "Discovered a 30% increase in intercultural learning metrics post-pandemic through longitudinal statistical analysis",
      "Engineered automated data pipelines for 18K survey responses, reducing preprocessing time by 70%",
    ],
    technologies: ["R", "SQL", "Sentiment Analysis"],
  },
  {
    title: "Founding Engineer",
    company: "Full Send AI",
    period: "Aug 2024 – Present",
    description: [
      "Delivered deployable AI agents to clients by packaging automated LLM workflows in modular frontends",
      "Designed Full Send’s production chatbot using APIs, React, & Node.js, improving lead response rate by 80% ",
      "Led end-to-end UI/UX revamp of company website and branding, increasing engagement time by 60%",
    ],
    technologies: ["JavaScript", "React", "Node.js"],
  },
  {
    title: "Web Developer",
    company: "Marcia's Attic",
    period: "May 2022 – Sep 2022",
    description: [
      "Developed company’s e-commerce website, managing product listings, inventory updates, and backend troubleshooting",
      "Increased online visibility by 80% through targeted digital marketing campaigns and SEO optimization",
      "Blended creative writing with technical web design to enhance product presentation, resulting in higher engagement",
    ],
    technologies: [
      "Web Development",
      "E-commerce",
      "Digital Marketing",
      "Retail Sales",
    ],
  },
  {
    title: "President & Founder",
    company: "Computer Science Honor Society",
    period: "Sep 2020 – Jun 2024",
    description: [
      "Rebuilt and scaled the chapter, driving over 300% membership growth",
      "Led 35+ weekly meetings and mentored 45+ active members to foster collaboration and growth",
      "Organized 15+ high-impact events annually, including coding competitions, speaker panels, and tech workshops",
    ],
    technologies: ["Java"],
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Experience</h2>
          <p className="text-xl text-muted-foreground">
            My professional journey
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="timeline-item relative md:pl-12"
              >
                <Card className="shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {experience.title}
                    </h3>
                    <p className="text-primary font-medium mb-2">
                      {experience.company}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      {experience.period}
                    </p>
                    <ul className="list-disc list-inside text-foreground mb-4">
                      {experience.description.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
