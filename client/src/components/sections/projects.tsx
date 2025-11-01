import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Vibe - Social Media App",
    description: [
      "Scaled a Java socket-based chat system to 100+ concurrent users with sub-50ms latency using thread pooling",
      "Improved session reliability by 75% through persistent user authentication and synchronized worker threads",
    ],
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Java Swing",
      "Socket Programming",
      "Multi-threading",
    ],
    githubUrl: "https://github.com/Aneesh495/VibeSocialMedia",
    liveUrl: "https://github.com/Aneesh495/VibeSocialMedia",
  },
  {
    title: "Freelance DAO - Smart Contract Platform",
    description: [
      "Achieved 99% uptime by designing a fault-tolerant freelance platform with a multi-signature dispute resolution system",
      "Reduced gas costs by 60% by benchmarking smart contracts using Hardhat testing and custom optimization passes",
    ],
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Solidity",
      "Ethereum",
      "MetaMask",
      "Smart Contracts",
    ],
    githubUrl: "https://github.com/Aneesh495/freelanceDAO",
    liveUrl: "https://github.com/Aneesh495/freelanceDAO",
  },
  {
    title: "Portfolio Website",
    description: [
      "Developed a professional portfolio website using JavaScript, Tailwind CSS, & Vercel, attracting 10,000+ visitors",
      "Achieved 100% SEO, 98% best practices, and 96% accessibility Lighthouse scores via code-splitting and targeted optimization",
    ],
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
    ],
    githubUrl: "https://github.com/Aneesh495/Portfolio-Website",
    liveUrl: "https://portfolio-website-tau-weld-45.vercel.app/",
  },
  {
    title: "Priced-In Splash Page",
    description: [
      "Delivered a production-grade splash page for Priced-In, leveraging React, TypeScript, and Material UI",
      "Integrated custom theming, animated transitions, and real-time analytics to drive a 30% increase in sign-up rates.",
    ],
      image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "HTML5",
      "JavaScript",
      "CSS Animations",
    ],
    githubUrl: "https://github.com/Aneesh495/priced-in",
    liveUrl: "https://priced-in.com/",
  },
  {
    title: " Quiz Stats - Analytics Dashboard",
    description: [
      "Transformed raw student data into AI-powered insights by engineering a high-performance analytics engine (Pandas, NumPy)",
      "Integrated custom theming, animated transitions, and real-time analytics to drive a 30% increase in sign-up rates.",
    ],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Express.js",
      "Pandas",
      "NumPy",
    ],
    githubUrl: "https://github.com/Aneesh495/LocalStorageStats",
    liveUrl: "https://local-storage-stats.vercel.app/",
  },
  {
    title: "AI Contract & Resume Analyzer",
    description: [
      "Engineered a full-stack AI-powered platform to parse, analyze, and summarize resumes and contracts using LLMs and NLP",
      "Designed a responsive UI and modular backend to streamline hiring and legal workflows with 99% accuracy.",
    ],
      image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=400&q=80",
    technologies: [
      "Node.js",
      "Fast API",
      "Multer",
    ],
    githubUrl: "https://github.com/Aneesh495/Contract-Analyzer",
    liveUrl: "https://github.com/Aneesh495/Contract-Analyzer",
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(project.liveUrl, "_blank")}
                    >
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Live Demo
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
