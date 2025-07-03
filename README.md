# Aneesh Krishna Portfolio Website

A modern, high-performing, animated personal portfolio website built with React, TypeScript, and Vite. Showcases projects, skills, and a suite of interactive games with beautiful UI and smooth transitions.

## ✨ Features

- **Modern Design**: Clean, responsive, and visually appealing layout.
- **Animated Light/Dark Mode**: Simple, gentle fade transition for theme switching.
- **Interactive Game Arcade**: Includes Chess, Battleship, Word Guess, Word Hunt, and more.
  - **Battleship**: Spacious, modern UI, smart AI, and classic rules (auto-miss around sunk ships).
  - **Word Hunt**: Guess words by clicking first and last letter or by drag, with clear highlights for found words.
  - **Word Guess**: Only real 5-letter words, always 5 boxes per row.
- **Contact Form**: Submissions routed to your email via EmailJS (see setup below).
- **Mobile Friendly**: Works great on all devices.

## 🚀 Getting Started

1. **Clone the repo:**
   ```sh
   git clone https://github.com/your-username/your-portfolio.git
   cd your-portfolio
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure Contact Form:**
   - Sign up at [EmailJS](https://www.emailjs.com/).
   - Create a service and template.
   - Replace the placeholders in `client/src/components/sections/contact.tsx` with your EmailJS service ID, template ID, and public key.

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production:**
   ```sh
   npm run build
   ```

## 🕹️ Game Highlights

- **Battleship**: Spacious, easy-to-use board, auto-miss for sunk ships, beautiful colors.
- **Word Hunt**: Click or drag to guess, only straight lines, found words stay highlighted.
- **Word Guess**: Real 5-letter words, always 5 boxes, smooth feedback.
- **Chess, Connect Four, and more**: Smart AI, difficulty levels, and modern UI.

## 🌓 Light/Dark Mode
- Toggle with the switch in the navbar.
- Enjoy a soft fade transition for a pleasant experience.

## 📬 Contact
- All form submissions go to your configured email (see setup above).

## 📦 Tech Stack
- React, TypeScript, Vite, Tailwind CSS, Framer Motion, EmailJS

---

**Built with ❤️ by Aneesh Krishna** 