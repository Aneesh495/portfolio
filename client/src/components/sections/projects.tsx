import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Vibe - Social Media App",
    description:
      "Built a multi-threaded Java back-end server and client GUI (Java Swing) to support real-time messaging, image sharing, friend management, and user search functionality. Engineered persistent, real-time chat with edit/delete message support using Java I/O and socket programming.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Java",
      "Java Swing",
      "Socket Programming",
      "Multi-threading",
      "Java I/O",
    ],
    githubUrl: "https://github.com/Aneesh495/VibeSocialMedia",
    liveUrl: "https://github.com/Aneesh495/VibeSocialMedia",
  },
  {
    title: "Freelance DAO - Smart Contract Platform",
    description:
      "Developed a decentralized freelance platform on Ethereum using Solidity, enabling automated transactions between clients and artists through smart contracts, connected using MetaMask. Designed and implemented an on-chain voting mechanism to resolve disputes with community-based consensus.",
    image:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Solidity",
      "Ethereum",
      "MetaMask",
      "Smart Contracts",
      "Blockchain",
    ],
    githubUrl: "https://github.com/Aneesh495/freelanceDAO",
    liveUrl: "https://github.com/Aneesh495/freelanceDAO",
  },
  {
    title: "Portfolio Website",
    description:
      "Modern, animated personal portfolio website showcasing skills, projects, and interactive games. Built with React, TypeScript, and Framer Motion for smooth animations and responsive design.",
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
    liveUrl: "https://github.com/Aneesh495/Portfolio-Website",
  },
  {
    title: "Priced-In Splash Page",
    description:
      "Designed and developed a modern, high-converting splash page for Priced-In, featuring sleek animations, responsive design, and optimized user experience. Implemented advanced CSS animations, interactive elements, and mobile-first design principles to create an engaging landing experience.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Responsive Design",
      "CSS Animations",
    ],
    githubUrl: "https://github.com/Aneesh495/priced-in",
    liveUrl: "https://priced-in.com/",
  },
  {
    title: "Local Storage Stats - Analytics Dashboard",
    description:
      "Built a comprehensive quiz analytics dashboard with real-time statistics, interactive charts, and performance insights. Features include smart filtering, benchmarking capabilities, and AI-powered question difficulty assessment. Includes dark/light theme support and responsive design for optimal user experience.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Express.js",
      "WebSocket",
      "Recharts",
    ],
    githubUrl: "https://github.com/Aneesh495/LocalStorageStats",
    liveUrl: "https://github.com/Aneesh495/LocalStorageStats",
  },
  {
    title: "Email Confirmation App",
    description:
      "Developed a full-stack email confirmation system with user registration, email verification, and secure authentication. Features include Gmail SMTP integration, Google reCAPTCHA protection, and MySQL database management. Implements secure session handling and responsive UI design.",
    image:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
    technologies: [
      "Node.js",
      "Express.js",
      "MySQL",
      "Gmail SMTP",
      "reCAPTCHA",
      "HTML/CSS",
    ],
    githubUrl: "https://github.com/Aneesh495/email-confirmation-app",
    liveUrl: "https://github.com/Aneesh495/email-confirmation-app",
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
