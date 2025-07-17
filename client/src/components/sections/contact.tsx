import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Github, Linkedin } from "lucide-react";
import { SiInstagram, SiSpotify } from "react-icons/si";
import { Checkbox } from "@/components/ui/checkbox";
import emailjs from "emailjs-com";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    notRobot: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("3szyYwUHYkxdKk9K5");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.notRobot) {
      toast({
        title: "OOPS!",
        description: "Please pinky promise you're not a robot first!",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Send contact form email
      const contactResult = await emailjs.send(
        "Portfolio",
        "template_20kxpp9",
        {
          user_name: formData.name,
          user_email: formData.email,
          subject: formData.subject,
          user_message: formData.message,
        },
        "3szyYwUHYkxdKk9K5"
      );

      // Send auto-reply email
      const autoReplyResult = await emailjs.send(
        "Portfolio",
        "template_fzcofzq",
        {
          user_name: formData.name,
          user_email: formData.email,
          subject: formData.subject,
        },
        "3szyYwUHYkxdKk9K5"
      );

      if (contactResult.status === 200 && autoReplyResult.status === 200) {
        toast({
          title: "Message Sent!",
          description: "Thanks for the message. I'll get back to you soon!",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          notRobot: false,
        });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                I'm always open to discussing new opportunities, innovative
                projects, or just having a conversation about technology and
                software development.
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
                  <p className="text-muted-foreground">Send me an email!</p>
                </div>
              </motion.a>

              <motion.a
                href="www.linkedin.com/in/aneesh495"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <Linkedin className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">LinkedIn</h4>
                  <p className="text-muted-foreground">
                    Connect with me professionally!
                  </p>
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
                  <p className="text-muted-foreground"> Check out more of my work!</p>
                </div>
              </motion.a>

              <motion.a
                href="https://open.spotify.com/user/wrljxtsfh4n10lh6r3r50m9yf?si=f07588f60ddb43ec"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <SiSpotify className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">Spotify</h4>
                  <p className="text-muted-foreground">
                    Check out my music taste!
                  </p>
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
                  <p className="text-muted-foreground">
                    Connect with me personally!
                  </p>
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
            <Card className="shadow-lg h-full">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What's this about?"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Your message..."
                      className="min-h-[120px] resize-none"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="not-robot"
                      checked={formData.notRobot}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, notRobot: !!checked })
                      }
                    />
                    <Label
                      htmlFor="not-robot"
                      className="text-sm text-muted-foreground"
                    >
                      I pinky promise I'm not a robot 🤖
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
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
