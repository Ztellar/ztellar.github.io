import type { Dict } from './types';

export const en: Dict = {
  lang: 'en',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Portfolio of Benjamín Salamanca: Chilean full-stack developer (React, Angular, NestJS, Spring Boot, AWS), Computer Science Engineering student and intern at ESO’s Paranal Observatory.',
  },
  nav: {
    about: 'About',
    journey: 'Journey',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    contact: 'Contact',
  },
  langSwitch: { otherPath: '/', otherLabel: 'ES', ariaLabel: 'Cambiar a español' },
  hero: {
    kicker: 'Temuco ⇄ Paranal · Chile',
    localTime: 'local time',
    name: 'Benjamín Salamanca',
    title: 'Full-Stack Developer · Computer Science Engineering student',
    tagline:
      'I build software end to end: data pipelines, web platforms, apps in production and, these days, infrastructure for telescopes.',
    now: 'In orbit: interning at ESO’s Paranal Observatory',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
    stats: [
      { value: '2,635 m', label: 'altitude of Cerro Paranal, where I’m interning' },
      { value: '5', label: 'teams I’ve worked with since 2022' },
      { value: '2', label: 'countries running my code in production' },
      { value: '4 years', label: 'teaching robotics and game dev to students' },
    ],
  },
  about: {
    heading: 'About me',
    paragraphs: [
      'I’m Benjamín, a full-stack developer and Computer Science Engineering student at Universidad de La Frontera in Temuco, Chile. I like owning the whole problem: understanding what the people using the system need, designing the data, building the backend and the frontend, and shipping it with CI/CD.',
      'Before writing software for companies, I taught it. For four years I was a mentor at Fundación Mustakis, guiding middle and high school students through educational robotics and building their own games in Scratch and Roblox Studio. Explaining complex things simply is still one of the things I enjoy most.',
      'Since then I’ve worked across transport, services and software, and today I’m doing something that once felt far away: working at ESO’s Paranal Observatory, modernizing how telescopes and instruments report what happens inside them. On the side I’m building Spot Ticket, my own ticketing platform. This site, with its sky of real stars, is my way of bringing all of that together.',
    ],
    nowHeading: 'Right now',
    nowUpdated: 'updated Oct 2026',
    now: [
      { tag: 'ESO', text: 'Migrating Paranal’s telescope and instrument log collector to Kafka and modernizing Grafana dashboards.' },
      { tag: 'SM Factory', text: 'Maintaining and evolving 3tiz, an app in production in the Dominican Republic and the US.' },
      { tag: 'Spot Ticket', text: 'Taking the MVP from controlled pilots to real events.' },
      { tag: 'UFRO', text: 'Finishing my Computer Science Engineering degree.' },
    ],
  },
  journey: {
    heading: 'Journey',
    intro: 'Mission log: the waypoints that brought me here.',
    items: [
      { year: '2013', title: 'Colegio Innov-Arte', text: 'Primary and secondary school (2013 – 2020).', kind: 'edu' },
      { year: '2021', title: 'Universidad de La Frontera', text: 'Start of Computer Science Engineering.', kind: 'edu' },
      { year: '2022', title: 'Mentor at Fundación Mustakis', text: 'First robotics and game dev workshops for school students.', kind: 'teach' },
      { year: '2025', title: 'First internship: Transportes Llico', text: 'Data Warehouse, ETL with AWS + Spark and a visualization platform.', kind: 'work' },
      { year: '2025', title: 'Second internship: CTR', text: 'Internal Angular + Spring Boot platform deployed on a VPS.', kind: 'work' },
      { year: '2025', title: 'Full-Stack Developer at SM Factory', text: 'First job: maintainer of 3tiz in international production.', kind: 'work' },
      { year: '2026', title: 'Spot Ticket at TICSUR', text: 'My Solana ticketing platform is presented in Temuco.', kind: 'build' },
      { year: '2026', title: 'Paranal Observatory · ESO', text: 'Interning at one of the most important observatories in the world.', kind: 'space' },
    ],
  },
  experience: {
    heading: 'Experience',
    currentLabel: 'current',
    items: [
      {
        role: 'Winter Intern',
        company: 'ESO · Paranal Observatory',
        period: 'Jul 2026 — Present',
        current: true,
        bullets: [
          'Migrating critical observatory components: the telescope and instrument log collector now communicates over Kafka.',
          'Modernizing dashboards built on legacy Grafana versions.',
        ],
        stack: ['Kafka', 'Grafana', 'Observability', 'Logging'],
      },
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Present',
        current: true,
        bullets: [
          'Maintainer of "3tiz", deployed in the Dominican Republic and the United States.',
          'Corrective and evolutionary maintenance of a production Flask + Angular/Ionic/Capacitor app.',
        ],
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        role: 'Full-Stack Developer Intern',
        company: 'CTR',
        period: 'May 2025 — Jun 2025',
        bullets: [
          'Internal web platform for metrics tracking, overtime accounting and receipts across two business processes.',
          'Angular frontend, Spring Boot backend, CI/CD on Bitbucket, deployed to a VPS.',
        ],
        stack: ['Angular', 'Spring Boot', 'Bitbucket CI/CD', 'VPS'],
      },
      {
        role: 'Full-Stack Developer Intern',
        company: 'Transportes Llico',
        period: 'Jan 2025 — Feb 2025',
        bullets: [
          'Scripts for automated real-time data ingestion.',
          'Data Warehouse and ETL processes with AWS and Spark for a unified fleet alert system.',
          'Full-stack web platform with GitLab CI/CD for high-granularity data visualization.',
        ],
        stack: ['AWS', 'Spark', 'ETL', 'GitLab CI/CD'],
      },
      {
        role: 'Mentor',
        company: 'Fundación Mustakis',
        period: '2022 — 2026',
        bullets: [
          'Taught educational robotics and game development workshops (Scratch and Roblox Studio) to students from 7th grade to high school.',
        ],
        stack: ['Educational robotics', 'Scratch', 'Roblox Studio', 'Teaching'],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    privateNote: 'Private code — personal and professional projects.',
    visit: 'Visit spoticket.cl ↗',
    featured: {
      name: 'Spot Ticket',
      description:
        'Ticketing platform where every ticket is a Solana cNFT: anti-counterfeiting, regulated resale, NFC tap-to-enter, offline validation, fan clubs, higher revenue for artists.',
      context: 'Personal project · MVP in controlled pilots · TICSUR 2026, Temuco',
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
      url: 'https://spoticket.cl',
    },
    items: [
      {
        name: 'Paranal logs → Kafka',
        description:
          'Migrating the communication of the Paranal Observatory’s telescope and instrument log collector to Kafka, alongside modernizing its Grafana dashboards.',
        context: 'ESO · winter internship 2026',
        stack: ['Kafka', 'Grafana', 'Observability'],
      },
      {
        name: '3tiz',
        description: 'Cross-platform application in production in the Dominican Republic and the US. Corrective and evolutionary maintenance across the full stack.',
        context: 'SM Factory · in production',
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        name: 'CTR metrics platform',
        description: "Internal system for metrics tracking, overtime accounting and receipts, used by two of the company's business processes.",
        context: 'CTR · internship',
        stack: ['Angular', 'Spring Boot', 'Bitbucket', 'VPS'],
      },
      {
        name: 'Llico data pipeline',
        description: 'Data Warehouse with ETL (AWS + Spark) feeding a high-granularity visualization platform for a unified fleet alert system.',
        context: 'Transportes Llico · internship',
        stack: ['AWS', 'Spark', 'GitLab', 'Data Warehouse'],
      },
    ],
  },
  skills: {
    heading: 'Skills',
    groups: [
      { label: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Ionic', 'Expo / React Native'] },
      { label: 'Backend', items: ['FastAPI', 'NestJS', 'Node.js', 'Spring Boot', 'Flask'] },
      { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'] },
      { label: 'Data & observability', items: ['Kafka', 'Spark', 'ETL', 'Data Warehouse', 'Grafana'] },
      { label: 'Cloud', items: ['AWS (EC2, S3, Lambda, Glue)', 'Google Cloud'] },
      { label: 'DevOps', items: ['GitHub Actions', 'GitLab CI/CD', 'Bitbucket CI/CD', 'VPS'] },
      { label: 'AI tools', items: ['Claude Code', 'GitHub Copilot', 'OpenCode'] },
    ],
    traitsHeading: 'Beyond the code',
    traits: [
      { name: 'Communication', evidence: 'Four years explaining robotics and programming to teenagers.' },
      { name: 'Leadership', evidence: 'Running full workshops and taking my own product from idea to real pilots.' },
      { name: 'Adaptability', evidence: 'Transport, services, software and astronomy: different domains and stacks in two years.' },
      { name: 'Ownership', evidence: 'Maintaining systems other people rely on every day, in production and at an observatory.' },
      { name: 'Teamwork', evidence: 'Five different teams, each with its own way of working.' },
    ],
  },
  console: {
    heading: 'Console',
    intro: 'Prefer the terminal? Ask me directly.',
    hint: 'Type a command or tap one of these:',
    placeholder: 'type "help"',
    notFound: 'command not found. Try "help".',
    commands: [
      {
        cmd: 'help',
        output: ['available commands:', '  whoami · now · eso · spot · stack · mentor · contact · clear'],
      },
      {
        cmd: 'whoami',
        output: [
          'benjamin salamanca — full-stack developer, Temuco, Chile.',
          'computer science engineering student (UFRO).',
          'into complete systems, the night sky, and explaining hard things simply.',
        ],
      },
      {
        cmd: 'now',
        output: [
          '[eso]        paranal log collector → kafka · grafana dashboards',
          '[sm factory] 3tiz in production (DR + US)',
          '[spot]       spot ticket: from pilots to real events',
          '[ufro]       wrapping up the degree',
        ],
      },
      {
        cmd: 'eso',
        output: [
          'Paranal Observatory · Atacama Desert · 2,635 m above sea level.',
          'winter internship since jul 2026.',
          'migrating the telescope and instrument log collector to kafka.',
        ],
      },
      {
        cmd: 'spot',
        output: [
          'spot ticket: every ticket is a Solana cNFT.',
          'anti-counterfeiting · regulated resale · NFC · offline validation.',
          '→ https://spoticket.cl',
        ],
      },
      {
        cmd: 'stack',
        output: [
          'front:  react · angular · next.js · ionic · expo',
          'back:   nestjs · fastapi · spring boot · flask · node',
          'data:   postgresql · redis · kafka · spark',
          'cloud:  aws · google cloud',
        ],
      },
      {
        cmd: 'mentor',
        output: [
          '2022 — 2026 · fundación mustakis',
          'educational robotics + game dev in scratch and roblox studio, 7th grade to high school.',
        ],
      },
      {
        cmd: 'contact',
        output: [
          'email:    b.salamanca01@ufromail.cl',
          'github:   github.com/Ztellar',
          'linkedin: linkedin.com/in/benjaminsalamanca',
        ],
      },
      {
        cmd: 'sudo hire benjamin',
        output: ['permission granted ✓ — reach me at b.salamanca01@ufromail.cl'],
      },
    ],
  },
  education: {
    heading: 'Education',
    degree: 'Computer Science Engineering (Ingeniería Civil Informática)',
    school: 'Universidad de La Frontera',
    period: '2021 — Present',
  },
  footer: {
    heading: 'Contact',
    blurb: 'A project, an opportunity, or just talking software and space? Reach out.',
    email: 'b.salamanca01@ufromail.cl',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Download CV',
    builtWith: 'Built with Astro · stars from the Yale Bright Star Catalog',
  },
};
