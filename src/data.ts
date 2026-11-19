export const profile = {
  name: "Supratik Das",
  role: "Senior Full Stack Engineer",
  location: "Hyderabad, India",
  email: "supratikdas01@gmail.com",
  phone: "+91 8100434836",
  tagline:
    "Nearly 8 years building scalable web applications end-to-end. Full-stack expertise across JavaScript, TypeScript, Angular, Node.js, React, and Java/Spring Boot — shipping and supporting features on high-traffic e-commerce platforms.",
  links: {
    linkedin: "https://linkedin.com/in/supratik-das-721138201",
    github: "https://github.com/supratik01",
    cv: "/Supratik_Das_Resume.pdf",
  },
};

export const about = [
  "I'm a Full Stack Developer with nearly 8 years designing and delivering scalable web applications — from responsive, high-performance frontends to the Java/Spring Boot services and REST APIs behind them.",
  "Currently at Valuelabs (Client: Shutterfly Inc.), I build product customisation and checkout experiences for a consumer platform serving millions of monthly users, and keep them stable through Splunk-based monitoring and incident investigation.",
  "I thrive in large codebases, shape engineering standards through code reviews and design discussions, and actively leverage AI-assisted workflows to ship high-quality software faster.",
];

export const facts = [
  {
    label: "Current role",
    value: "Software Development Analyst",
    meta: "Valuelabs · Client: Shutterfly · Oct 2023 – Present",
  },
  {
    label: "Experience",
    value: "Nearly 8 years",
    meta: "Full-stack delivery across e-commerce & enterprise",
  },
  {
    label: "Education",
    value: "M.Sc. Computer Science",
    meta: "West Bengal State University · 2017 (B.Sc. 2015)",
  },
  {
    label: "Certification",
    value: "Angular Advanced Workshop",
    meta: "Udemy · 2022",
  },
  {
    label: "In progress",
    value: "AWS Certified Developer",
    meta: "Associate level",
  },
  {
    label: "Availability",
    value: "Open to opportunities",
    meta: "Remote, globally",
  },
];

export const skills = [
  { name: "JavaScript", note: "ES6+ · Async · DOM", level: "Expert" },
  { name: "TypeScript", note: "Typed interfaces · Generics", level: "Expert" },
  { name: "Angular", note: "Enterprise SPA framework", level: "Expert" },
  { name: "Node.js", note: "REST APIs · Express", level: "Expert" },
  { name: "Java / Spring Boot", note: "Backend services · REST", level: "Advanced" },
  { name: "React", note: "Component model", level: "Intermediate" },
  { name: "Agentic AI", note: "AI agents · Workflows", level: "Advanced" },
  { name: "AWS", note: "S3 · SES · CI/CD", level: "Intermediate" },
  { name: "PostgreSQL", note: "Schema · Query design", level: "Advanced" },
  { name: "MongoDB", note: "Document stores", level: "Advanced" },
  { name: "Splunk", note: "Log analysis · Dashboards", level: "Advanced" },
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
      "Engineer full-stack features for Shutterfly.com, a consumer e-commerce platform serving millions of monthly users across product customisation and purchase journeys.",
      "Built a drag-and-drop canvas editor (Backbone.js + Fabric.js) driving real-time personalisation across Photo Books, Cards, Calendars, Prints, Mugs, Canvas Prints, and Posters.",
      "Developed AI-powered frontend flows — autofill, auto-crop, layout suggestions, and restyle (Magic Labs) — plus an embeddable widget mode exposing a JavaScript API to third-party host pages.",
      "Built and enhanced Java/Spring Boot services and REST APIs supporting complex product configuration, cart, and checkout workflows.",
      "Strengthened production reliability through Splunk-based monitoring, log analysis, and incident investigation, accelerating root-cause identification.",
      "Contributed to technical architecture and engineering standards via code reviews and design discussions, integrating frontend and backend across a microservice ecosystem.",
    ],
  },
  {
    company: "HCLTech",
    tag: "Enterprise Application Development",
    role: "Senior Software Engineer",
    period: "Jan 2022 – Sep 2023",
    accent: "cyan" as const,
    points: [
      "Developed enterprise-grade web applications using Angular, TypeScript, JavaScript, and Node.js.",
      "Established reusable, modular UI components and shared libraries within a scalable frontend architecture, reducing development effort across features.",
      "Integrated REST APIs with Java/Spring Boot services, enabling reliable data exchange across enterprise workflows.",
      "Implemented Google Tag Manager and Google Analytics to capture user journeys and support conversion funnel analysis.",
      "Leveraged Splunk dashboards for observability, tracking error trends and supporting timely incident triage.",
    ],
  },
  {
    company: "LegalKart",
    tag: "Legal-tech Startup — Full Stack",
    role: "Software Engineer",
    period: "Jan 2019 – Dec 2021",
    accent: "gold" as const,
    points: [
      "Developed end-to-end features using JavaScript, Angular, Node.js, PostgreSQL, and REST APIs in a fast-paced startup environment.",
      "Engineered scalable backend services with Node.js and MongoDB, optimising data management and service performance.",
      "Supported AWS-based deployment workflows, coordinating application releases across cloud environments.",
      "Automated recurring data-processing tasks in Python, reducing manual effort across routine workflows.",
    ],
  },
];

export const projects = [
  {
    index: "01",
    kicker: "E-commerce · Shutterfly",
    title: "Photo Product Builder",
    description:
      "A high-traffic photo product editor enabling millions of users to design and order personalised products in real time. Backbone.js SPA with a Fabric.js canvas editor, undo/redo Command Pattern, AI autofill/auto-crop flows, an embeddable widget API, and Node.js service orchestration across 7+ product types.",
    highlights: [
      "Fabric.js drag-and-drop canvas editor with undo/redo via the Command Pattern",
      "AI-powered autofill, auto-crop, and layout suggestions (Magic Labs)",
      "Embeddable widget mode exposing a JavaScript API for third-party host pages",
      "Complex UI state and high-volume rendering backed by Node.js API orchestration",
      "Production stability tracked through Splunk log analysis and dashboards",
    ],
    stack: ["Backbone.js", "JavaScript", "Fabric.js", "Node.js", "Spring Boot", "Splunk"],
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
      "An interactive tool that visualises JavaScript's runtime behaviour line-by-line — call stack, event loop, promises, async/await, and task queues — through animated execution flows. Launched publicly on Product Hunt and Dev.to.",
    highlights: [
      "Line-by-line visualisation of the call stack and event loop",
      "Models promises, async/await, and micro/macro task queues",
      "AI-assisted agents validate and narrate execution flows",
      "Launched on Product Hunt and Dev.to as an educational runtime playground",
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
