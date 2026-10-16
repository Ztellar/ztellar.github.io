import type { Dict } from './types';

export const es: Dict = {
  lang: 'es',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Portfolio de Benjamín Salamanca: desarrollador full-stack chileno (React, Angular, NestJS, Spring Boot, AWS), estudiante de Ingeniería Civil Informática y practicante en el Observatorio Paranal de ESO.',
  },
  nav: {
    about: 'Sobre mí',
    journey: 'Trayectoria',
    experience: 'Experiencia',
    projects: 'Proyectos',
    skills: 'Habilidades',
    contact: 'Contacto',
  },
  langSwitch: { otherPath: '/en/', otherLabel: 'EN', ariaLabel: 'Switch to English' },
  hero: {
    kicker: 'Temuco ⇄ Paranal · Chile',
    localTime: 'hora local',
    name: 'Benjamín Salamanca',
    title: 'Full-Stack Developer · Estudiante de Ingeniería Civil Informática',
    tagline:
      'Construyo software de punta a punta: pipelines de datos, plataformas web, apps en producción y, ahora, infraestructura para telescopios.',
    now: 'En órbita: práctica en el Observatorio Paranal de ESO',
    ctaProjects: 'Ver proyectos',
    ctaContact: 'Contáctame',
    stats: [
      { value: '2.635 m', label: 'altura de Cerro Paranal, donde hago mi práctica' },
      { value: '5', label: 'equipos en los que he trabajado desde 2022' },
      { value: '2', label: 'países con mi código en producción' },
      { value: '4 años', label: 'enseñando robótica y videojuegos a escolares' },
    ],
  },
  about: {
    heading: 'Sobre mí',
    paragraphs: [
      'Soy Benjamín, desarrollador full-stack y estudiante de Ingeniería Civil Informática en la Universidad de La Frontera, en Temuco. Me gusta hacerme cargo del problema completo: entender qué necesita la gente que va a usar el sistema, diseñar los datos, construir el backend y el frontend, y dejarlo desplegado con CI/CD.',
      'Antes de escribir software para empresas, lo enseñé. Durante cuatro años fui mentor en la Fundación Mustakis, guiando a estudiantes de 7° básico a 3° medio en robótica educativa y en crear sus propios videojuegos con Scratch y Roblox Studio. Explicar algo complejo de forma simple sigue siendo una de las cosas que más disfruto.',
      'Desde entonces pasé por transporte, servicios y desarrollo de software, y hoy estoy cumpliendo algo que se veía lejano: trabajar en el Observatorio Paranal de ESO, modernizando cómo los telescopios e instrumentos reportan lo que pasa en ellos. En paralelo construyo Spot Ticket, mi propia plataforma de entradas. Este sitio, con su cielo de estrellas reales, es mi forma de juntar todo eso.',
    ],
    nowHeading: 'Ahora mismo',
    nowUpdated: 'actualizado oct 2026',
    now: [
      { tag: 'ESO', text: 'Migrando el log collector de telescopios e instrumentos de Paranal a Kafka y modernizando dashboards de Grafana.' },
      { tag: 'SM Factory', text: 'Manteniendo y evolucionando 3tiz, una app en producción en República Dominicana y EE.UU.' },
      { tag: 'Spot Ticket', text: 'Llevando el MVP de pilotos controlados a eventos reales.' },
      { tag: 'UFRO', text: 'Terminando Ingeniería Civil Informática.' },
    ],
  },
  journey: {
    heading: 'Trayectoria',
    intro: 'Bitácora de misión: los puntos que me trajeron hasta acá.',
    items: [
      { year: '2013', title: 'Colegio Innov-Arte', text: 'Educación básica y media (2013 – 2020).', kind: 'edu' },
      { year: '2021', title: 'Universidad de La Frontera', text: 'Entro a Ingeniería Civil Informática.', kind: 'edu' },
      { year: '2022', title: 'Mentor en Fundación Mustakis', text: 'Primeros talleres de robótica y videojuegos para escolares.', kind: 'teach' },
      { year: '2025', title: 'Primera práctica: Transportes Llico', text: 'Data Warehouse, ETL con AWS + Spark y una plataforma de visualización.', kind: 'work' },
      { year: '2025', title: 'Segunda práctica: CTR', text: 'Plataforma interna Angular + Spring Boot desplegada en VPS.', kind: 'work' },
      { year: '2025', title: 'Full-Stack Developer en SM Factory', text: 'Primer trabajo: mantenedor de 3tiz en producción internacional.', kind: 'work' },
      { year: '2026', title: 'Spot Ticket en TICSUR', text: 'Mi plataforma de tickets en Solana se presenta en Temuco.', kind: 'build' },
      { year: '2026', title: 'Observatorio Paranal · ESO', text: 'Práctica en uno de los observatorios más importantes del mundo.', kind: 'space' },
    ],
  },
  experience: {
    heading: 'Experiencia',
    currentLabel: 'actual',
    items: [
      {
        role: 'Práctica de Invierno',
        company: 'ESO · Observatorio Paranal',
        period: 'Jul 2026 — Actualidad',
        current: true,
        bullets: [
          'Migración de componentes críticos del observatorio: la comunicación del log collector de telescopios e instrumentos pasa a Kafka.',
          'Modernización de dashboards construidos en versiones antiguas de Grafana.',
        ],
        stack: ['Kafka', 'Grafana', 'Observabilidad', 'Logging'],
      },
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Actualidad',
        current: true,
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
          'Frontend en Angular, backend en Spring Boot, CI/CD en Bitbucket y despliegue en VPS.',
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
        stack: ['Robótica educativa', 'Scratch', 'Roblox Studio', 'Docencia'],
      },
    ],
  },
  projects: {
    heading: 'Proyectos',
    privateNote: 'Código privado - proyectos personales y laborales.',
    visit: 'Visitar spoticket.cl ↗',
    featured: {
      name: 'Spot Ticket',
      description:
        'Plataforma de venta de entradas donde cada ticket es un cNFT en Solana: Anti-falsificación, reventa regulada, entrada por NFC, validación offline, fan-clubs, mayores ingresos para los artistas.',
      context: 'Proyecto personal · MVP en pilotos controlados · TICSUR 2026, Temuco',
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
      url: 'https://spoticket.cl',
    },
    items: [
      {
        name: 'Logs de Paranal → Kafka',
        description:
          'Migración de la comunicación del log collector de los telescopios e instrumentos del Observatorio Paranal a Kafka, junto con la modernización de sus dashboards de Grafana.',
        context: 'ESO · práctica de invierno 2026',
        stack: ['Kafka', 'Grafana', 'Observabilidad'],
      },
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
      { label: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Ionic', 'Expo / React Native'] },
      { label: 'Backend', items: ['FastAPI', 'NestJS', 'Node.js', 'Spring Boot', 'Flask'] },
      { label: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'] },
      { label: 'Datos y observabilidad', items: ['Kafka', 'Spark', 'ETL', 'Data Warehouse', 'Grafana'] },
      { label: 'Cloud', items: ['AWS (EC2, S3, Lambda, Glue)', 'Google Cloud'] },
      { label: 'DevOps', items: ['GitHub Actions', 'GitLab CI/CD', 'Bitbucket CI/CD', 'VPS'] },
      { label: 'Herramientas IA', items: ['Claude Code', 'GitHub Copilot', 'OpenCode'] },
    ],
    traitsHeading: 'Más allá del código',
    traits: [
      { name: 'Comunicación', evidence: 'Cuatro años explicando robótica y programación a adolescentes.' },
      { name: 'Liderazgo', evidence: 'Guiar talleres completos y llevar un producto propio de la idea a pilotos reales.' },
      { name: 'Adaptabilidad', evidence: 'Transporte, servicios, software y astronomía: dominios y stacks distintos en dos años.' },
      { name: 'Responsabilidad', evidence: 'Mantener sistemas que otros usan todos los días, en producción y en un observatorio.' },
      { name: 'Trabajo en equipo', evidence: 'Cinco equipos distintos, cada uno con su propia forma de trabajar.' },
    ],
  },
  console: {
    heading: 'Consola',
    intro: '¿Prefieres la terminal? Pregúntame directo.',
    hint: 'Escribe un comando o toca uno de estos:',
    placeholder: 'escribe "help"',
    notFound: 'comando no encontrado. Prueba "help".',
    commands: [
      {
        cmd: 'help',
        output: ['comandos disponibles:', '  whoami · now · eso · spot · stack · mentor · contact · clear'],
      },
      {
        cmd: 'whoami',
        output: [
          'benjamin salamanca — full-stack developer, Temuco, Chile.',
          'estudiante de ingeniería civil informática (UFRO).',
          'le gustan los sistemas completos, las estrellas y explicar cosas difíciles de forma simple.',
        ],
      },
      {
        cmd: 'now',
        output: [
          '[eso]        log collector de Paranal → kafka · dashboards grafana',
          '[sm factory] 3tiz en producción (RD + EE.UU.)',
          '[spot]       spot ticket: de pilotos a eventos reales',
          '[ufro]       cerrando la carrera',
        ],
      },
      {
        cmd: 'eso',
        output: [
          'Observatorio Paranal · Desierto de Atacama · 2.635 m s.n.m.',
          'práctica de invierno desde jul 2026.',
          'migrando la comunicación del log collector de telescopios e instrumentos a kafka.',
        ],
      },
      {
        cmd: 'spot',
        output: [
          'spot ticket: cada entrada es un cNFT en Solana.',
          'anti-falsificación · reventa regulada · NFC · validación offline.',
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
          'robótica educativa + videojuegos en scratch y roblox studio, de 7° básico a 3° medio.',
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
        output: ['permiso concedido ✓ — escríbeme a b.salamanca01@ufromail.cl'],
      },
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
