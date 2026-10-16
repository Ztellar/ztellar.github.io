import type { Dict } from './types';

export const en: Dict = {
  lang: 'en',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Benjamín Salamanca wanted to study Astronomy, ended up in Computer Science, and is now interning at ESO’s Paranal Observatory. Full-stack developer in Temuco, Chile.',
  },
  nav: { story: 'Story', work: 'Work', offline: 'Off the clock', contact: 'Contact', cv: 'CV' },
  langSwitch: { otherPath: '/', otherLabel: 'ES', ariaLabel: 'Cambiar a español' },
  hero: {
    kicker: 'Temuco → Paranal · Chile',
    name: 'Benjamín Salamanca',
    role: 'Full-stack developer · Computer Science Engineering, UFRO',
    ctaStory: 'Read the story',
    ctaWork: 'See my work',
  },
  story: {
    heading: 'Transfer orbit',
    paragraphs: [
      'I have always liked astronomy. There was no single moment or book that changed everything: it was simply always there. When it was time to choose a degree I wanted to study it, but that meant leaving Temuco, and it wasn’t possible.',
      'I enrolled in Computer Science Engineering at Universidad de La Frontera. It wasn’t the original plan, but there I found something else I like: building complete systems, from the data all the way to the screen someone uses every day.',
      'Along the way I taught robotics and game development to school students at Fundación Mustakis, did my internships in transport and services, and started working on an application in production in two countries.',
      'In 2026 the orbit closed: I’m now interning at ESO’s Paranal Observatory, working on the infrastructure that records what happens in its telescopes and instruments. I didn’t take the direct route, but I got there.',
    ],
    orbit: {
      ariaLabel: 'Diagram of a transfer orbit from Temuco to Paranal, with the milestones along the way.',
      inner: 'Temuco',
      outer: 'Paranal',
      waypoints: [
        { year: '2021', label: 'Computer Science Engineering, UFRO' },
        { year: '2022', label: 'Mentor at Fundación Mustakis' },
        { year: '2025', label: 'Internships at Transportes Llico and CTR' },
        { year: '2025', label: 'Full-stack developer at SM Factory' },
        { year: '2026', label: 'Internship at ESO · Paranal Observatory' },
      ],
      caption:
        'A Hohmann transfer orbit takes a spacecraft from one orbit to another by going halfway around. It isn’t the most direct path; it’s the one that works with what you have.',
    },
  },
  work: {
    heading: 'Work',
    intro: 'A few things, told properly. The full list of roles and dates is in the CV.',
    featured: {
      name: 'Spot Ticket',
      tagline: 'Tickets that can’t be counterfeited, with fair resale.',
      context: 'Personal project · MVP in controlled pilots · TICSUR 2026, Temuco',
      originHeading: 'Why it exists',
      origin: [
        'Spot Ticket comes from three sides of the same experience. As part of the audience, I kept seeing ticket scams in Facebook groups. As a musician, I organized shows with my former bands and saw from the inside how hard it is to sell tickets in an orderly way. And as a fan, I’ve gone to see several of my favorite bands live.',
        'The goal is for buying a ticket to be safe for whoever attends and fairer for whoever plays.',
      ],
      whatHeading: 'What it does',
      what: [
        'Every ticket is a Solana cNFT: it can’t be duplicated or forged.',
        'Regulated resale, with rules set by the organizer.',
        'NFC entry with offline validation at the door.',
        'Fan clubs and higher revenue for artists.',
      ],
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
      url: 'https://spoticket.cl',
      visit: 'spoticket.cl ↗',
    },
    eso: {
      name: 'Paranal Observatory · ESO',
      context: 'Winter internship · Jul 2026 — present',
      text: [
        'Migrating critical observatory components: the telescope and instrument log collector now communicates over Kafka.',
        'Modernizing dashboards built on legacy Grafana versions.',
      ],
      stack: ['Kafka', 'Grafana', 'Observability'],
    },
    othersHeading: 'Other work',
    others: [
      {
        name: '3tiz',
        org: 'SM Factory',
        period: '2025 — now',
        text: 'Corrective and evolutionary maintenance of a Flask + Angular/Ionic app in production in the Dominican Republic and the US.',
      },
      {
        name: 'Internal metrics platform',
        org: 'CTR',
        period: '2025',
        text: 'Metrics, overtime and receipts tracking for two business processes. Angular, Spring Boot, CI/CD and a VPS.',
      },
      {
        name: 'Fleet data pipeline',
        org: 'Transportes Llico',
        period: '2025',
        text: 'Data Warehouse and ETL with AWS and Spark for a unified alert system, plus a platform to visualize it.',
      },
    ],
    stackHeading: 'What I work with',
    stack: ['TypeScript', 'Angular', 'React / Next.js', 'NestJS', 'FastAPI', 'Spring Boot', 'Flask', 'PostgreSQL', 'Redis', 'Kafka', 'AWS', 'VPS'],
    cvNote: 'See full CV',
  },
  offline: {
    heading: 'Off the clock',
    intro: 'What fills the rest of the time.',
    music: {
      heading: 'Music',
      text: 'I listen to a lot of music, almost always rock, metal or jazz fusion.',
      favoriteLabel: 'Favorite band',
      favorite: 'Avenged Sevenfold',
      groups: [
        { label: 'Metal', items: ['Mastodon', 'Gojira', 'Megadeth', 'Ghost', 'Symphony X', 'Nightwish'] },
        { label: 'Japanese fusion & city pop', items: ['Casiopea', 'Masayoshi Takanaka', 'ryusenkei'] },
      ],
      aside: 'Yes, Cassiopeia is also a constellation.',
    },
    bass: {
      heading: 'Bass',
      text: 'I play bass. With my former bands we didn’t just play: we also organized our own shows, which is part of where Spot Ticket came from.',
    },
    ygo: {
      heading: 'Yu-Gi-Oh!',
      deck: 'Kozmo',
      text: 'My favorite deck: pilots and starships from a space opera. Even in card games I end up in space.',
    },
    travel: {
      heading: 'Travel',
      text: 'I enjoy traveling and getting to know new places.',
    },
  },
  contact: {
    heading: 'Contact',
    blurb: 'A project, an opportunity, or a chat about software, astronomy or music? Reach out.',
    email: 'b.salamanca01@ufromail.cl',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Download CV',
    builtWith: 'Built with Astro · stars from the Yale Bright Star Catalog',
  },
  cv: {
    title: 'Full-Stack Developer · Computer Science Engineering student',
    summary:
      'Full-stack developer with experience in web platforms, data pipelines and production applications. Currently interning at ESO’s Paranal Observatory.',
    location: 'Temuco, Chile',
    experienceHeading: 'Experience',
    experience: [
      {
        role: 'Winter Intern',
        company: 'ESO · Paranal Observatory',
        period: 'Jul 2026 — Present',
        bullets: [
          'Migrating critical observatory components: the telescope and instrument log collector now communicates over Kafka.',
          'Modernizing dashboards built on legacy Grafana versions.',
        ],
      },
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Present',
        bullets: [
          'Maintainer of "3tiz", deployed in the Dominican Republic and the United States.',
          'Corrective and evolutionary maintenance of a production Flask + Angular/Ionic/Capacitor app.',
        ],
      },
      {
        role: 'Full-Stack Developer Intern',
        company: 'CTR',
        period: 'May 2025 — Jun 2025',
        bullets: [
          'Internal web platform for metrics tracking, overtime accounting and receipts across two business processes.',
          'Angular frontend, Spring Boot backend, CI/CD on Bitbucket, deployed to a VPS.',
        ],
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
      },
      {
        role: 'Mentor',
        company: 'Fundación Mustakis',
        period: '2022 — 2026',
        bullets: [
          'Taught educational robotics and game development workshops (Scratch and Roblox Studio) to students from 7th grade to high school.',
        ],
      },
    ],
    skillsHeading: 'Technologies',
    skills: [
      { label: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Ionic', 'Expo / React Native'] },
      { label: 'Backend', items: ['FastAPI', 'NestJS', 'Node.js', 'Spring Boot', 'Flask'] },
      { label: 'Databases', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'] },
      { label: 'Data & observability', items: ['Kafka', 'Spark', 'ETL', 'Data Warehouse', 'Grafana'] },
      { label: 'Cloud', items: ['AWS (EC2, S3, Lambda, Glue)', 'Google Cloud'] },
      { label: 'DevOps', items: ['GitHub Actions', 'GitLab CI/CD', 'Bitbucket CI/CD', 'VPS'] },
      { label: 'AI tools', items: ['Claude Code', 'GitHub Copilot', 'OpenCode'] },
    ],
    educationHeading: 'Education',
    education: {
      degree: 'Computer Science Engineering (Ingeniería Civil Informática)',
      school: 'Universidad de La Frontera',
      period: '2021 — Present',
    },
  },
};
