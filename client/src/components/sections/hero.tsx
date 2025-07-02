import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="animate-bounce-slow"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Aneesh Krishna
            </span>{" "}
            <motion.span
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block"
            >
              👋
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
        >
          Honors CS + Stats @ Purdue | SWE Intern @ Retail Hedging | Machine
          Intelligence | Full-Stack & Data-Driven
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            className="px-8 py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() =>
              document
                .getElementById("projects")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View My Work
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-3 text-lg font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get In Touch
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
