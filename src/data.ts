export const profile = {
  name: "Supratik Das",
  role: "Full Stack Developer",
  location: "Hyderabad, India",
  email: "supratikdas01@gmail.com",
  phone: "+91 8100434836",
  tagline:
    "7+ years building scalable web applications end-to-end. Full-stack expertise across JavaScript, Node.js, Angular, React, and Core Java — shipping features on high-traffic e-commerce platforms.",
  links: {
    linkedin: "https://linkedin.com/in/supratik-das-721138201",
    github: "https://github.com/supratik01",
    cv: "/Supratik_Das_CV_2026.pdf",
  },
};

export const about = [
  "I'm a Full Stack Developer with 7+ years designing and delivering scalable web applications — architecting frontend systems and integrating complex backend APIs across the full product lifecycle.",
  "Currently at Valuelabs (Client: Shutterfly Inc.), I lead development of high-traffic product customisation features used by millions. I believe great software lives at the intersection of engineering precision and deep user empathy.",
  "I thrive in large codebases, mentor junior developers, and actively leverage AI-assisted engineering workflows to ship high-quality software faster.",
];

export const facts = [
  { label: "Current role", value: "Software Development Analyst", meta: "Valuelabs · Client: Shutterfly · Oct 2023 – Present" },
  { label: "Education", value: "M.Sc. Computer Science", meta: "West Bengal State University · 2017" },
  { label: "Certification", value: "Angular Advanced Workshop", meta: "Udemy · 2022" },
  { label: "Availability", value: "Open to opportunities", meta: "Remote, globally" },
];

export const skills = [
  { name: "JavaScript", note: "ES6+ · Async · DOM", level: "Expert" },
  { name: "Angular", note: "Enterprise SPA framework", level: "Expert" },
  { name: "Node.js", note: "REST APIs · Express", level: "Expert" },
  { name: "Core Java", note: "Backend services", level: "Advanced" },
  { name: "Agentic AI", note: "AI agents · Workflows", level: "Advanced" },
  { name: "AWS", note: "Lambda · Cloud", level: "Intermediate" },
  { name: "React", note: "Component model", level: "Intermediate" },
  { name: "HTML5 / CSS3", note: "Semantic · Responsive", level: "Pro" },
  { name: "SCSS", note: "Design systems", level: "Pro" },
  { name: "PostgreSQL", note: "Schema · Query design", level: "Advanced" },
  { name: "MongoDB", note: "Document stores", level: "Advanced" },
  { name: "GTM / GA", note: "Analytics & tracking", level: "Pro" },
];

export const experience = [
  {
    company: "Valuelabs",
    tag: "Client: Shutterfly Inc.",
    role: "Software Development Analyst",
    period: "Oct 2023 – Present",
    accent: "mint" as const,
    points: [
      "Led frontend development of a large-scale photo product editor used by millions, built on Backbone.js + JavaScript across Photo Books, Cards, Calendars, Prints, Mugs, Canvas Prints, and Posters.",
      "Built a rich drag-and-drop canvas editor using Fabric.js supporting photo placement, text editing, design templates, backgrounds, and embellishments.",
      "Developed AI-powered frontend flows — autofill, auto-crop, layout suggestions, and restyle (Magic Labs).",
      "Built an embeddable widget mode with a JavaScript API for third-party host page integration.",
      "Conducted code reviews, contributed to architectural decisions, and collaborated with backend teams on API integration and system design.",
    ],
  },
  {
    company: "HCLTech",
    tag: "Enterprise Application Development",
    role: "Senior Software Engineer",
    period: "Jan 2022 – Sep 2023",
    accent: "cyan" as const,
    points: [
      "Developed enterprise-grade applications using Angular, JavaScript, and Node.js integrations.",
      "Built reusable, modular UI component libraries aligned with scalable frontend architecture standards.",
      "Implemented Google Tag Manager and Google Analytics for user journey and funnel tracking.",
    ],
  },
  {
    company: "LegalKart",
    tag: "Legal-tech Startup — Full Stack",
    role: "Software Engineer",
    period: "Jan 2019 – Dec 2021",
    accent: "gold" as const,
    points: [
      "Developed features using JavaScript, Angular, Node.js, PostgreSQL, and REST APIs in a fast-paced startup environment.",
      "Built strong foundations in full-stack development, system integration, and Agile delivery across multiple production releases.",
    ],
  },
];

export const projects = [
  {
    index: "01",
    kicker: "E-commerce · Shutterfly",
    title: "Photo Product Builder",
    description:
      "Frontend of a high-traffic photo product editor enabling millions of users to design and order personalised photo products in real time. Backbone.js SPA with a Fabric.js canvas editor, undo/redo Command Pattern, AI autofill/auto-crop flows, an embeddable widget API, and multi-brand locale support across 7+ product types.",
    highlights: [
      "Fabric.js drag-and-drop canvas editor with undo/redo via the Command Pattern",
      "AI-powered autofill, auto-crop, and layout suggestions (Magic Labs)",
      "Embeddable widget mode exposing a JavaScript API for third-party host pages",
      "Multi-brand, multi-locale support across 7+ product types",
      "Runs at scale for millions of users on a high-traffic e-commerce platform",
    ],
    stack: ["Backbone.js", "JavaScript", "Fabric.js", "JST/EJS", "jQuery", "SCSS"],
    href: "https://www.shutterfly.com/",
    image: "/projects/photo-product-builder.png",
    images: ["/project-1-1st.png", "/project-1-2nd.png", "/project-1-3rd.png"],
    accent: "mint" as const,
  },
  {
    index: "02",
    kicker: "Personal Project · Open Source",
    title: "JS Execution Visualizer",
    description:
      "An interactive tool that visualises JavaScript's runtime behaviour line-by-line — call stack, event loop, promises, async/await, and task queues. Leverages AI agents to reason over execution flows.",
    highlights: [
      "Line-by-line visualisation of the call stack and event loop",
      "Models promises, async/await, and micro/macro task queues",
      "AI agents reason over and narrate execution flows",
      "An interactive, educational JavaScript runtime playground",
    ],
    stack: ["JavaScript", "Event Loop", "Async/Await", "AI Agents", "Visualisation"],
    href: "https://jsvisualizer.bytefront.dev/",
    image: "/projects/js-visualizer.png",
    video: "/js-visualizer-demo.mov",
    accent: "cyan" as const,
  },
];

export const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];
