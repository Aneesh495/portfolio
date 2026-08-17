import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Github, Linkedin } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { logEvent } from "@/hooks/useGoogleAnalytics";

const CONTACT_EMAIL = "aneeshkrishnaparthasarathy@gmail.com";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${CONTACT_EMAIL}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            _replyto: formData.email,
            _subject: formData.subject || "New portfolio message",
            _template: "table",
            _captcha: "false",
            _autoresponse:
              "Thanks for reaching out. I got your message and will get back to you soon.",
          }),
        }
      );

      const result = await response.json();
      const failed =
        !response.ok || result.success === false || result.success === "false";

      if (failed) {
        const activationNeeded =
          typeof result.message === "string" &&
          /confirm|activat/i.test(result.message);
        if (activationNeeded) {
          toast({
            title: "Confirm your email",
            description:
              "Check Gmail for a FormSubmit confirmation link, click it, then send again.",
          });
          return;
        }
        throw new Error(result.message || "Failed to send email");
      }

      toast({
        title: "Message Sent!",
        description: "Thanks for the message. I'll get back to you soon!",
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      logEvent({
        action: "submit_contact_form",
        category: "Contact",
        label: "Contact Section",
      });
    } catch (error) {
      console.error("Contact form error:", error);
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
                Always open to new projects!
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
                </div>
              </motion.a>

              <motion.a
                href="https://www.instagram.com/aneesh.495/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center p-4 bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => logEvent({
                  action: "click_social_link",
                  category: "Social",
                  label: "Instagram"
                })}
              >
                <SiInstagram className="text-primary text-xl mr-4" />
                <div>
                  <h4 className="font-semibold">Instagram</h4>
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
                        placeholder="email@abc.com"
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
