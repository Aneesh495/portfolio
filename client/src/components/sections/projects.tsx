import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const projects = [
  {
    title: "Cathode",
    description: [
      "Real-time CPU graphics with handwritten AArch64 NEON kernels and from-scratch NTSC/CRT DSP. Rasterizer, ray marcher, physics, path tracer. No GPU, no libraries.",
    ],
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["C", "AArch64 NEON", "Rust", "C++"],
    githubUrl: "https://github.com/Aneesh495/cathode",
  },
  {
    title: "Boiler Reviews",
    description: [
      "Course reviews, filtered reports, and per-course aggregates on Flask + SQLite. Parameterized queries, server-side validation.",
    ],
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    technologies: ["Flask", "SQLite", "Python", "Bootstrap"],
    githubUrl: "https://github.com/Aneesh495/Boiler-Reviews",
  },
  {
    title: "Vibe",
    description: [
      "Java socket chat with thread pooling, persistent sessions, and synchronized workers.",
    ],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["Socket Programming", "Multi-threading"],
    githubUrl: "https://github.com/Aneesh495/VibeSocialMedia",
  },
  {
    title: "Freelance DAO",
    description: [
      "On-chain freelance platform with multi-sig dispute resolution. Smart contracts benchmarked and tuned for gas.",
    ],
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["Solidity", "Ethereum", "Smart Contracts"],
    githubUrl: "https://github.com/Aneesh495/freelance-DAO",
  },
  {
    title: " Quiz Stats",
    description: [
      "Quiz analytics with performance insights, difficulty analysis, and personalized benchmarks.",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: ["Express.js", "Pandas", "NumPy"],
    githubUrl: "https://github.com/Aneesh495/LocalStorageStats",
  },
  {
    title: "AI Contract Analyzer",
    description: [
      "LLM pipeline for parsing and summarizing resumes and contracts.",
    ],
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=400&q=80",
    technologies: ["Node.js", "Fast API", "Multer"],
    githubUrl: "https://github.com/Aneesh495/Contract-Analyzer",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground">
            Some of my recent work
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="project-card h-full shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.githubUrl, "_blank")}
                    >
                      <Github className="mr-1 h-4 w-4" />
                      Code
                    </Button>
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
