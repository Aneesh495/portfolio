import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Github, Linkedin } from "lucide-react";
import { SiX, SiInstagram } from "react-icons/si";
import { Checkbox } from "@/components/ui/checkbox";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    notRobot: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.notRobot) {
      toast({
        title: "Error",
        description: "Please pinky promise you're not a robot first!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      setFormData({ name: "", email: "", message: "", notRobot: false });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl text-muted-foreground">
            Have a project in mind? Let's work together!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
              <p className="text-muted-foreground mb-8">
                I'm always open to discussing new opportunities, innovative projects, 
                or just having a conversation about technology and software development.
              </p>
            </div>
            
            <div className="space-y-4">
              <motion.a
                href="mailto:aneeshkrishnaparthasarathy@gmail.com"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Mail className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-muted-foreground">aneeshkrishnaparthasarathy@gmail.com</p>
                </div>
              </motion.a>
              
              <motion.a
                href="https://linkedin.com/in/aneesh-krishna-780701253"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Linkedin className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">LinkedIn</h4>
                  <p className="text-muted-foreground">linkedin.com/in/aneesh-krishna-780701253</p>
                </div>
              </motion.a>
              
              <motion.a
                href="https://github.com/Aneesh495"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Github className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">GitHub</h4>
                  <p className="text-muted-foreground">github.com/Aneesh495</p>
                </div>
              </motion.a>

              <motion.a
                href="https://x.com/DKE631"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <SiX className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">Twitter</h4>
                  <p className="text-muted-foreground">@DKE631</p>
                </div>
              </motion.a>

              <motion.a
                href="https://www.instagram.com/aneesh.495/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <SiInstagram className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">Instagram</h4>
                  <p className="text-muted-foreground">@aneesh.495</p>
                </div>
              </motion.a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message..."
                      rows={4}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="notRobot"
                      checked={formData.notRobot}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, notRobot: !!checked })
                      }
                    />
                    <Label htmlFor="notRobot" className="text-sm">
                      I pinky promise I'm not a robot 🤞
                    </Label>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
