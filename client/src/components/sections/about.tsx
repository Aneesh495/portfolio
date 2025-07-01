import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Code, Download } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground">Get to know me better</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <img
              src="/baby-photo.png"
              alt="Aneesh Krishna - Baby photo"
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2"
          >
            <h3 className="text-2xl font-semibold mb-6">Hello! I'm Aneesh Krishna Parthasarathy</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              I'm a Computer Science student at Purdue University Honors College (Class of 2027) with a focus on Machine Intelligence 
              and Applied Statistics. My passion lies in building innovative software solutions that bridge the gap between 
              cutting-edge technology and real-world applications, from blockchain development to data science research.
            </p>
            
            <div className="space-y-4 mb-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center"
              >
                <GraduationCap className="text-primary mr-3 h-5 w-5" />
                <span>B.S. Computer Science (Machine Intelligence) + Applied Statistics @ Purdue Honors</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center"
              >
                <Users className="text-primary mr-3 h-5 w-5" />
                <span>Active in Boiler Blockchain, Purdue DOSA, Tamil Sangam</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center"
              >
                <Code className="text-primary mr-3 h-5 w-5" />
                <span>Software Engineer, Data Scientist & Blockchain Developer</span>
              </motion.div>
            </div>
            
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                const link = document.createElement('a');
                link.href = '/Aneesh_Krishna_Resume.pdf';
                link.download = 'Aneesh_Krishna_Resume.pdf';
                link.click();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
