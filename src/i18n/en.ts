import type { Dict } from './types';

export const en: Dict = {
  lang: 'en',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Portfolio of Benjamín Salamanca: Chilean full-stack developer (React, Angular, FastAPI, Spring Boot, AWS), Computer Science Engineering student and upcoming ESO intern.',
  },
  nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
  langSwitch: { otherPath: '/', otherLabel: 'ES', ariaLabel: 'Cambiar a español' },
  hero: {
    kicker: 'Temuco, Chile · UTC-4',
    name: 'Benjamín Salamanca',
    title: 'Full-Stack Developer · Computer Science Engineering student',
    eso: 'Upcoming: internship at the European Southern Observatory (ESO)',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
  },
  about: {
    heading: 'About me',
    p1: 'I am a full-stack developer and Computer Science Engineering student at Universidad de La Frontera, Chile. I have built complete web platforms — from data pipelines to frontends — for transport, retail and software companies.',
    p2: 'From 2022 to 2026 I was a mentor at Fundación Mustakis, teaching educational robotics and game development (Scratch and Roblox Studio) to middle and high school students.',
    p3: 'I will soon join the European Southern Observatory as an intern: the intersection of software and astronomy is exactly the kind of problem that drives me — this site, with its sky of real stars, is a preview.',
  },
  experience: {
    heading: 'Experience',
    items: [
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Present',
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
          'CI/CD on Bitbucket, deployed to a VPS.',
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
        stack: ['Educational robotics', 'Scratch', 'Roblox Studio'],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    privateNote: 'Private company code — described without repository links.',
    featured: {
      name: 'Spot — Ticketing with invisible blockchain',
      description:
        'Ticketing platform where every ticket is a Solana cNFT without users ever touching crypto: traditional login and auto-generated custodial wallets. Anti-counterfeiting, resale capped at +20% with automatic royalties for organizers and artists, NFC "tap to enter" access and offline validation.',
      context: 'Personal project · MVP in controlled pilots · TICSUR 2026, Temuco',
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
    },
    items: [
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
      { label: 'Frontend', items: ['React', 'Angular'] },
      { label: 'Backend', items: ['FastAPI', 'Node.js', 'Spring Boot', 'Flask', 'AWS Lambda'] },
      { label: 'Databases', items: ['SQL', 'NoSQL', 'Key-value'] },
      { label: 'Cloud (AWS)', items: ['EC2', 'S3', 'Lambda', 'Glue'] },
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
    email: 'bsalamanca159@hotmail.com',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Download CV',
    builtWith: 'Built with Astro · stars from the Yale Bright Star Catalog',
  },
};
