import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Software Engineering Intern",
    company: "Retail Hedging Solutions",
    period: "Summer 2023",
    description: "Developed algorithmic trading solutions and risk management tools for retail investors. Implemented machine learning models for market prediction and portfolio optimization.",
    technologies: ["Python", "Machine Learning", "Finance"],
  },
  {
    title: "Research Assistant",
    company: "The Data Mine - Purdue University",
    period: "Fall 2022 - Present",
    description: "Conducting research on large-scale data analytics and machine learning applications. Collaborated with industry partners on real-world data science projects.",
    technologies: ["Python", "R", "Data Analytics"],
  },
  {
    title: "Blockchain Developer",
    company: "Boiler Blockchain - Purdue University",
    period: "Fall 2021 - Present",
    description: "Leading development of blockchain-based applications and smart contracts. Organizing workshops and hackathons for the campus blockchain community.",
    technologies: ["Solidity", "Web3", "Ethereum"],
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
          <p className="text-xl text-muted-foreground">My professional journey</p>
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
                    <h3 className="text-xl font-semibold mb-2">{experience.title}</h3>
                    <p className="text-primary font-medium mb-2">{experience.company}</p>
                    <p className="text-muted-foreground mb-4">{experience.period}</p>
                    <p className="text-foreground mb-4 leading-relaxed">
                      {experience.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
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
