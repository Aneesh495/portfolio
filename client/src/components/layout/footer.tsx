import { Github, Linkedin, Mail, Heart, Code, Coffee } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-t border-slate-700 dark:border-slate-800"
    >
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AK</span>
              </div>
              <span className="text-white font-semibold text-xl">Aneesh Krishna</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Computer Science student at Purdue University passionate about building innovative 
              software solutions that make a difference.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "#about", label: "About" },
                { href: "#projects", label: "Projects" },
                { href: "#experience", label: "Experience" },
                { href: "#skills", label: "Skills" },
                { href: "#games", label: "Games" },
                { href: "#contact", label: "Contact" },
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ x: 4 }}
                  className="text-slate-300 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Connect Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-white font-semibold text-lg">Let's Connect</h3>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/Aneesh495"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg transition-colors group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5 text-slate-300 group-hover:text-white" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/in/aneesh-krishna-780701253"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg transition-colors group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5 text-slate-300 group-hover:text-blue-400" />
              </motion.a>
              <motion.a
                href="mailto:aneeshkrishna@purdue.edu"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg transition-colors group"
              >
                <Mail className="h-5 w-5 text-slate-300 group-hover:text-green-400" />
              </motion.a>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Open to new opportunities and exciting collaborations.
              Feel free to reach out!
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700 dark:border-slate-800 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-2 text-slate-400 text-sm"
            >
              <span>© {currentYear} Aneesh Krishna Parthasarathy.</span>
              <span>•</span>
              <span>All rights reserved.</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-4 text-slate-400 text-sm"
            >
              <div className="flex items-center space-x-1">
                <span>Built with</span>
                <Heart className="h-3 w-3 text-red-500 animate-pulse" />
                <span>using</span>
                <Code className="h-3 w-3" />
                <span>React & TypeScript</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <span>Powered by</span>
                <Coffee className="h-3 w-3 text-amber-600" />
                <span>& curiosity</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
