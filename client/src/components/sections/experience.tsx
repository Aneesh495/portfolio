import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Systems Development Engineer Intern",
    company: "Amazon",
    period: "May 2026 - Jul 2026",
    description: [
      "pricing infra + zero-trust auth",
    ],
    technologies: ["FastAPI", "AWS", "Redshift", "Python"],
  },
  {
    title: "AI Engineer",
    company: "Handshake",
    period: "Jan 2026 - Apr 2026",
    description: [
      "rlhf pipelines + model alignment",
    ],
    technologies: ["LLM Finetuning", "RLHF", "Code Sandboxing"],
  },
  {
    title: "Machine Learning Intern",
    company: "Caterpillar",
    period: "Aug 2025 – Dec 2025",
    description: [
      "forecasting + ml inference",
    ],
    technologies: ["PyTorc", "Azure", "Kubernetes", "MLOps"],
  },
  {
    title: "Founding Engineer",
    company: "Stealth Startup",
    period: "Aug 2024 – Jul 2025",
    description: [
      "JWT payments + high-throughput APIs",
    ],
    technologies: ["React", "TypeScript", "JWTs"],
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
