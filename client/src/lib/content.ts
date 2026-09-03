export const PROFILE = {
  name: "Aneesh Krishna",
  email: "aneeshkrishnaparthasarathy@gmail.com",
  location: "New York City",
  university: "Purdue University",
  github: "https://github.com/Aneesh495",
  linkedin: "https://www.linkedin.com/in/aneesh495",
};

export const EXPERIENCES = [
  {
    id: "amazon",
    company: "Amazon",
    role: "Systems Development Engineer Intern",
    period: "May 2026 - Aug 2026",
    location: "Internship",
    summary: "Pricing infrastructure and data pipelines on AWS.",
    bullets: [
      "Built services for workbook automation and concurrent job processing.",
      "Added document rewriting and live Redshift enrichment for downstream systems.",
    ],
    technologies: ["AWS", "Redshift", "Python"],
  },
  {
    id: "handshake",
    company: "Handshake",
    role: "AI Engineer",
    period: "Jan 2026 - Apr 2026",
    location: "AI / Alignment",
    summary: "RLHF and evaluation for code models.",
    bullets: [
      "Built an RLHF pipeline from preference data through training.",
      "Wrote a sandboxed harness to score generated code off-host.",
    ],
    technologies: ["Python", "RLHF", "LLMs"],
  },
  {
    id: "caterpillar",
    company: "Caterpillar",
    role: "Machine Learning Intern",
    period: "Aug 2025 - Dec 2025",
    location: "ML / Forecasting",
    summary: "Forecasting models and production inference.",
    bullets: [
      "Designed a multi-horizon transformer for supply-chain forecasting.",
      "Deployed batch inference on Kubernetes and an Azure training-to-serving pipeline.",
    ],
    technologies: ["PyTorch", "Kubernetes", "Azure", "MLOps"],
  },
  {
    id: "stealth",
    company: "Stealth Startup",
    role: "Founding Engineer",
    period: "Aug 2024 - Jul 2025",
    location: "Startup",
    summary: "Realtime simulation and engine infrastructure.",
    bullets: [
      "Built game-state synchronization for multiplayer sessions.",
      "Rebuilt the ECS with event-driven updates and object pooling.",
    ],
    technologies: ["ECS", "Networking"],
  },
];

export const PROJECTS = [
  {
    title: "Cathode",
    kind: "Systems",
    blurb: "CPU graphics engine",
    signal: "Software rendering, handwritten SIMD, analog DSP",
    bullets: [
      "CPU rasterizer on AArch64 NEON with no GPU and no external libraries, covering rasterization, ray marching, physics, and path tracing.",
      "NTSC DSP pipeline with I/Q modulation for analog-accurate output.",
    ],
    technologies: ["C", "AArch64 NEON", "Rust", "DSP"],
    href: "https://github.com/Aneesh495/cathode",
    hrefLabel: "GitHub",
  },
  {
    title: "Splice",
    kind: "Systems",
    blurb: "Custom UNIX shell",
    signal: "POSIX shell, job control, from scratch",
    bullets: [
      "AST-based POSIX shell with pipes, redirection, and job control.",
      "Process groups, signals, and TTY control for foreground and background jobs.",
    ],
    technologies: ["C", "POSIX", "Unix"],
  },
  {
    title: "Vibe",
    kind: "Distributed",
    blurb: "Social network",
    signal: "WebSockets, consistent hashing, ordered fanout",
    bullets: [
      "WebSocket gateway with consistent hashing across nodes.",
      "Ordered fanout with backpressure and idempotent delivery.",
    ],
    technologies: ["WebSockets", "Consistent Hashing", "Distributed Systems"],
    href: "https://github.com/Aneesh495/VibeSocialMedia",
    hrefLabel: "GitHub",
  },
];
