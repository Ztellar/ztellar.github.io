import type { Dict } from './types';

export const es: Dict = {
  lang: 'es',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Portfolio de Benjamín Salamanca: desarrollador full-stack chileno (React, Angular, FastAPI, Spring Boot, AWS), estudiante de Ingeniería Civil Informática y próximo practicante en ESO.',
  },
  nav: { about: 'Sobre mí', experience: 'Experiencia', projects: 'Proyectos', skills: 'Habilidades', contact: 'Contacto' },
  langSwitch: { otherPath: '/en/', otherLabel: 'EN', ariaLabel: 'Switch to English' },
  hero: {
    kicker: 'Temuco, Chile · UTC-4',
    name: 'Benjamín Salamanca',
    title: 'Full-Stack Developer · Estudiante de Ingeniería Civil Informática',
    eso: 'Próximamente: práctica en el European Southern Observatory (ESO)',
    ctaProjects: 'Ver proyectos',
    ctaContact: 'Contáctame',
  },
  about: {
    heading: 'Sobre mí',
    p1: 'Soy desarrollador full-stack y estudiante de Ingeniería Civil Informática en la Universidad de La Frontera. He construido plataformas web completas —del pipeline de datos al frontend— en empresas de transporte, retail y software.',
    p2: 'Desde 2022 hasta 2026 fuí mentor de la Fundación Mustakis, enseñando robótica educativa y creación de videojuegos (Scratch y Roblox Studio) a estudiantes de 7° básico a 3° medio.',
    p3: 'Pronto haré mi práctica en el European Southern Observatory: el cruce entre software y astronomía es exactamente el tipo de problema que me motiva — este sitio, con su cielo de estrellas reales, es un adelanto.',
  },
  experience: {
    heading: 'Experiencia',
    items: [
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Actualidad',
        bullets: [
          'Mantenedor del proyecto "3tiz", desplegado en República Dominicana y Estados Unidos.',
          'Mantenciones correctivas y evolutivas sobre una app Flask + Angular/Ionic/Capacitor en producción.',
        ],
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        role: 'Práctica Full-Stack Developer',
        company: 'CTR',
        period: 'May 2025 — Jun 2025',
        bullets: [
          'Plataforma web interna para registro de métricas, horas extra y boletas de dos procesos de negocio.',
          'CI/CD en Bitbucket y despliegue en VPS.',
        ],
        stack: ['Angular', 'Spring Boot', 'Bitbucket CI/CD', 'VPS'],
      },
      {
        role: 'Práctica Full-Stack Developer',
        company: 'Transportes Llico',
        period: 'Ene 2025 — Feb 2025',
        bullets: [
          'Scripts de descarga automática de datos en tiempo real.',
          'Data Warehouse y procesos ETL con AWS y Spark para un sistema unificado de alertas.',
          'Plataforma web full-stack con CI/CD en GitLab para visualizar datos con alta granularidad.',
        ],
        stack: ['AWS', 'Spark', 'ETL', 'GitLab CI/CD'],
      },
      {
        role: 'Mentor',
        company: 'Fundación Mustakis',
        period: '2022 — 2026',
        bullets: [
          'Docente de talleres de robótica educativa y creación de videojuegos (Scratch y Roblox Studio) para estudiantes de 7° básico a 3° medio.',
        ],
        stack: ['Robótica educativa', 'Scratch', 'Roblox Studio'],
      },
    ],
  },
  projects: {
    heading: 'Proyectos',
    privateNote: 'Código privado - proyectos personales y laborales.',
    featured: {
      name: 'Spot — Ticketing con blockchain invisible',
      description:
        'Plataforma de venta de entradas donde cada ticket es un cNFT en Solana sin que el usuario vea nada de crypto: login tradicional y wallets custodiales autogeneradas. Anti-falsificación, reventa limitada a +20% con regalías automáticas para organizadores y artistas, entrada por NFC "tap to enter" y validación offline.',
      context: 'Proyecto personal · MVP en pilotos controlados · TICSUR 2026, Temuco',
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
    },
    items: [
      {
        name: '3tiz',
        description: 'Aplicación multiplataforma en producción en República Dominicana y EE.UU. Mantención correctiva y evolutiva del stack completo.',
        context: 'SM Factory · en producción',
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        name: 'Plataforma de métricas CTR',
        description: 'Sistema interno de registro de métricas, contabilidad de horas extra y boletas, usado por dos procesos de negocio de la empresa.',
        context: 'CTR · práctica universitaria 2',
        stack: ['Angular', 'Spring Boot', 'Bitbucket', 'VPS'],
      },
      {
        name: 'Pipeline de datos Llico',
        description: 'Data Warehouse con ETL (AWS + Spark) alimentando una plataforma de visualización de alta granularidad para un sistema unificado de alertas de flota.',
        context: 'Transportes Llico · práctica universitaria 1',
        stack: ['AWS', 'Spark', 'GitLab', 'Data Warehouse'],
      },
    ],
  },
  skills: {
    heading: 'Habilidades',
    groups: [
      { label: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Expo / React Native'] },
      { label: 'Backend', items: ['FastAPI', 'NestJS', 'Node.js', 'Spring Boot', 'Flask'] },
      { label: 'Bases de datos', items: ['MySQL', 'Supabase', 'PostgreSQL', 'MongoDB', 'Firebase', 'Redis'] },
      { label: 'DevOps', items: ['GitHub Actions', 'GitLab CI/CD', 'Bitbucket CI/CD', 'VPS'] },
      { label: 'Cloud (AWS)', items: ['EC2', 'S3', 'Lambda', 'Glue'] },
    ],
  },
  education: {
    heading: 'Educación',
    degree: 'Ingeniería Civil Informática',
    school: 'Universidad de La Frontera',
    period: '2021 — Actualidad',
  },
  footer: {
    heading: 'Contacto',
    blurb: '¿Un proyecto, una oportunidad o simplemente hablar de software y espacio? Escríbeme.',
    email: 'b.salamanca01@ufromail.cl',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Descargar CV',
    builtWith: 'Hecho con Astro · estrellas del Yale Bright Star Catalog',
  },
};
