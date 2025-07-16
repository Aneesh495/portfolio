import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const experiences = [
  {
    title: "Software Engineering Intern",
    company: "Retail Hedging LLC",
    period: "May 2025 - Aug 2025",
    description: [
      "Architected and delivered a production-grade, fully responsive splash page and authentication system using React, TypeScript, and Material UI, emphasizing accessibility, performance, and mobile-first design.",
      "Engineered a secure, end-to-end authentication and access control system integrating Auth0 and Stripe, leveraging custom JWT flows, asymmetric encryption, and tier-based feature gating.",
      "Developed a robust Node.js/Express backend for secure Stripe API integration, subscription validation, and cryptographically signed token issuance.",
      "Led the migration from polling-based to token-authenticated, one-time fetch flows, significantly improving efficiency and security.",
      "Built advanced UI components with animated navigation, route-aware logic, and seamless Auth0 integration, enhancing user experience and engagement.",
      "Established best practices for secure key management, .env handling, and GitHub-based CI/CD, ensuring codebase integrity and rapid iteration.",
      "Collaborated cross-functionally with product, design, and security teams to deliver features on aggressive timelines, consistently exceeding expectations.",
    ],
    technologies: [
      "React",
      "TypeScript",
      "HTML",
      "CSS",
      "Auth0",
      "Stripe",
      "JWT",
    ],
  },
  {
    title: "Full Stack Intern",
    company: "PlaytoonIt Inc",
    period: "June 2025 - Present",
    description: [
      "Spearheaded the development of interactive gaming applications and full-stack solutions using cutting-edge frameworks and cloud technologies.",
      "Engineered scalable, cross-platform game architectures in Unity and C#, integrating advanced AI/LLM features for dynamic gameplay and personalized user experiences.",
      "Collaborated with multidisciplinary teams to deliver high-performance, visually engaging games, optimizing for both web and mobile platforms.",
      "Implemented robust backend systems, real-time multiplayer logic, and secure data pipelines, ensuring seamless user engagement and data integrity.",
      "Automated CI/CD pipelines and cloud deployments, reducing release cycles and improving code quality through rigorous testing and code reviews.",
    ],
    technologies: ["C#", "Unity", "Full Stack Development", "Game Development"],
  },
  {
    title: "Undergraduate Data Science Researcher",
    company: "The Data Mine - Purdue University",
    period: "Jan 2025 - Present",
    description: [
      "Conducted advanced analysis of real-world datasets using Python and R, uncovering actionable insights and driving data-driven decision-making.",
      "Led exploratory data analysis, statistical modeling, and interactive data visualization projects, presenting findings to academic and industry stakeholders.",
      "Collaborated with interdisciplinary teams to refine research questions, design experiments, and communicate results through technical reports and presentations.",
      "Developed reproducible data pipelines, automated data cleaning, and implemented best practices for data integrity and version control.",
      "Demonstrated expertise in data wrangling, feature engineering, and the effective communication of complex results to both technical and non-technical audiences.",
    ],
    technologies: [
      "Python",
      "R",
      "Data Analytics",
      "Statistical Modeling",
      "Predictive Analytics",
      "Data Cleansing",
    ],
  },
  {
    title: "Data Science & Statistics Researcher",
    company: "Purdue University",
    period: "March 2025 - Present",
    description: [
      "Analyzed 18,000+ student survey responses from Japan and the U.S. to assess evolving educational values and life priorities, leveraging advanced statistical and machine learning techniques.",
      "Modeled sentiment trends pre/during/post-COVID using R and Python, providing actionable insights to guide institutional research and policy.",
      "Designed and implemented reproducible data pipelines, automated data cleaning, and robust data validation processes.",
      "Presented findings to cross-functional teams, translating complex analyses into clear, impactful recommendations for academic leadership.",
    ],
    technologies: [
      "R",
      "Python",
      "Statistical Analysis",
      "Sentiment Analysis",
      "Survey Data",
      "Data Preprocessing",
    ],
  },
  {
    title: "Retail Sales Associate & Web Developer",
    company: "Marcia's Attic",
    period: "Jun 2022 - Aug 2022",
    description: [
      "Designed, developed, and maintained the company’s e-commerce website, managing product listings, inventory updates, and backend troubleshooting to ensure a seamless shopping experience.",
      "Increased online visibility by 80% through targeted digital marketing campaigns, SEO optimization, and creative content strategies.",
      "Provided exceptional in-store customer service, leveraging sales expertise and deep product knowledge to drive revenue and customer satisfaction.",
      "Blended creative writing with technical web design to enhance product presentation, resulting in higher engagement and conversion rates.",
      "Collaborated with management to align digital strategy with brand goals, utilizing analytics to inform ongoing improvements.",
    ],
    technologies: [
      "Web Development",
      "E-commerce",
      "Digital Marketing",
      "Backend Development",
      "Retail Sales",
    ],
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
