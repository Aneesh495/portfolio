import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Software Engineering Intern",
    company: "Retail Hedging LLC",
    period: "May 2025 - Aug 2025",
    description: "Developed a sleek splash page and optimized front-end interface using HTML, CSS, React, and TypeScript. Engineered a secure JWT-based Auth0–Stripe integration with tiered access control and dynamic claim injection. Built an intuitive options trading UI that enhanced user experience, speed, and interaction efficiency.",
    technologies: ["React", "TypeScript", "HTML", "CSS", "Auth0", "Stripe", "JWT"],
  },
  {
    title: "Undergraduate Data Science Researcher",
    company: "The Data Mine - Purdue University",
    period: "Jan 2025 - Present",
    description: "Leveraged Python to analyze Indiana state datasets, uncovering key trends, anomalies, and predictive patterns. Delivered data-driven insights to inform strategic decisions for public agencies and private-sector stakeholders.",
    technologies: ["Python", "Data Analytics", "Statistical Modeling", "Predictive Analytics"],
  },
  {
    title: "Undergraduate Data Science & Statistics Researcher",
    company: "Purdue University",
    period: "March 2025 - Present",
    description: "Analyzed 18,000+ student survey responses from Japan and the U.S. to assess evolving educational values and life priorities. Modeled sentiment trends pre/during/post-COVID using R and Python to guide institutional research.",
    technologies: ["R", "Python", "Statistical Analysis", "Sentiment Analysis", "Survey Data"],
  },
  {
    title: "Retail Sales Associate & Web Developer",
    company: "Marcia's Attic",
    period: "Jun 2022 - Aug 2022",
    description: "Designed and maintained an e-commerce site with product listings, stock status, and backend fixes. Increased retail visibility by 80% through targeted digital marketing and web optimizations.",
    technologies: ["Web Development", "E-commerce", "Digital Marketing", "Backend Development"],
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
