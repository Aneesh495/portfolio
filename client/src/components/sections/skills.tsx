import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const skillCategories = [
  {
    title: "Languages",
    skills: [
      "Python",
      "TypeScript",
      "C/C++",
      "Java",
      "SQL",
      "Solidity",
    ],
  },
  {
    title: "Frameworks",
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Spring Boot",
      "FastAPI",
      "Tensor Flow"
    ],
  },
  {
    title: "Tools",
    skills: [
      "Git",
      "Docker",
      "AWS/Azure/GCP",
      "Jenkins",
      "Linux",
    ],
  },
  {
    title: "Specializations",
    skills: [
      "Machine Learning",
      "Blockchain",
      "Algorithm Design",
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Skills & Technologies</h2>
          <p className="text-xl text-muted-foreground">
            Technologies I work with
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <Card className="h-full shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-center">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="skill-tag px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium cursor-default"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
