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
    title: "Quasar",
    kind: "Hardware",
    blurb: "Matching engine",
    signal: "SystemVerilog, AXI-Stream, price-time priority",
    bullets: [
      "Synthesizable limit-order book with RAM-backed levels, one-cycle BBO, and cancel that does not walk the queue.",
      "AXI-Stream order path through CRC, risk, and clock-domain crossing between fabric and core.",
    ],
    technologies: ["SystemVerilog", "AXI", "FPGA"],
    href: "https://github.com/Aneesh495/quasar",
    hrefLabel: "GitHub",
  },
  {
    title: "Planck",
    kind: "Systems",
    blurb: "Out-of-order RISC-V core",
    signal: "Cycle-accurate OoO, RV32IM, pure assembly",
    bullets: [
      "A host binary that is a CPU: assembler, interpreter, and a 2-wide Tomasulo core with ROB, caches, and predictors.",
      "Guest RV32IM with no C runtime on the host — Linux syscalls, NASM, and counters you can actually read.",
    ],
    technologies: ["x86-64 Assembly", "RISC-V", "Microarchitecture"],
    href: "https://github.com/Aneesh495/planck",
    hrefLabel: "GitHub",
  },
  {
    title: "Lockstep",
    kind: "Systems",
    blurb: "Trading exchange",
    signal: "Deterministic matching, WAL, dual-feed market data",
    bullets: [
      "Single-threaded price-time matching with a zero-allocation hot path once the pools are warm.",
      "WAL, snapshots, and dual UDP feeds so recovery is a property, not a story.",
    ],
    technologies: ["C++20", "UDP", "Exchange"],
    href: "https://github.com/Aneesh495/lockstep",
    hrefLabel: "GitHub",
  },
  {
    title: "VectorTick",
    kind: "Systems",
    blurb: "Market-data engine",
    signal: "Columnar storage, SSA IR, custom JIT",
    bullets: [
      "Ingests market events into a compressed columnar format, then queries them through a typed language and SSA IR.",
      "Portable vector interpreter plus handwritten JIT on x86-64 and AArch64.",
    ],
    technologies: ["C++20", "JIT", "Columnar Storage"],
    href: "https://github.com/Aneesh495/VectorTick",
    hrefLabel: "GitHub",
  },
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
    title: "Glyph",
    kind: "Language",
    blurb: "Functional language toolchain",
    signal: "OCaml, Hindley-Milner inference, SSA research",
    bullets: [
      "Working frontend for a strict functional language with parsing, algebraic data types, pattern matching, and Hindley-Milner type inference.",
      "Research modules cover HIR, SSA, optimization passes, bytecode, and a VM; the full pipeline is still being wired together.",
    ],
    technologies: ["OCaml", "Compilers", "Type Systems"],
    href: "https://github.com/Aneesh495/glyph",
    hrefLabel: "GitHub",
  },
];
