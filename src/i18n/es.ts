import type { Dict } from './types';

export const es: Dict = {
  lang: 'es',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Benjamín Salamanca: quería estudiar Astronomía, terminó en Informática y hoy hace su práctica en el Observatorio Paranal de ESO. Desarrollador full-stack en Temuco, Chile.',
  },
  nav: { story: 'Historia', work: 'Trabajo', offline: 'Fuera del código', contact: 'Contacto', cv: 'CV' },
  langSwitch: { otherPath: '/en/', otherLabel: 'EN', ariaLabel: 'Switch to English' },
  hero: {
    kicker: 'Temuco → Paranal · Chile',
    name: 'Benjamín Salamanca',
    role: 'Desarrollador full-stack · Ingeniería Civil Informática, UFRO',
    ctaStory: 'Leer la historia',
    ctaWork: 'Ver mi trabajo',
  },
  story: {
    heading: 'Órbita de transferencia',
    paragraphs: [
      'Siempre me gustó la astronomía. No hubo un momento puntual ni un libro que lo cambiara todo: simplemente estuvo ahí desde siempre. Cuando llegó la hora de elegir carrera quería estudiarla, pero eso significaba irme de Temuco, y no fue posible.',
      'Entré a Ingeniería Civil Informática en la Universidad de La Frontera. No era el plan original, pero ahí encontré otra cosa que me gusta: construir sistemas completos, desde los datos hasta la pantalla que alguien usa todos los días.',
      'En el camino enseñé robótica y creación de videojuegos a escolares en la Fundación Mustakis, hice mis prácticas en transporte y servicios, y empecé a trabajar manteniendo una aplicación en producción en dos países.',
      'En 2026 la órbita se cerró: hoy hago mi práctica en ESO, en el Observatorio Paranal, trabajando en la infraestructura que registra lo que pasa en sus telescopios e instrumentos. No llegué por el camino directo, pero llegué.',
    ],
    orbit: {
      ariaLabel: 'Diagrama de una órbita de transferencia desde Temuco hasta Paranal, con los hitos del camino.',
      inner: 'Temuco',
      outer: 'Paranal',
      waypoints: [
        { year: '2021', label: 'Ingeniería Civil Informática, UFRO' },
        { year: '2022', label: 'Mentor en Fundación Mustakis' },
        { year: '2025', label: 'Prácticas en Transportes Llico y CTR' },
        { year: '2025', label: 'Full-stack developer en SM Factory' },
        { year: '2026', label: 'Práctica en ESO · Observatorio Paranal' },
      ],
      caption:
        'Una órbita de transferencia de Hohmann lleva una nave de una órbita a otra dando medio rodeo. No es el camino más directo; es el que alcanza con lo que hay.',
    },
  },
  work: {
    heading: 'Trabajo',
    intro: 'Pocas cosas, contadas con calma. El detalle completo de cargos y fechas está en el CV.',
    featured: {
      name: 'Spot Ticket',
      tagline: 'Entradas que no se pueden falsificar, con reventa justa.',
      context: 'Proyecto personal · MVP en pilotos controlados · TICSUR 2026, Temuco',
      originHeading: 'Por qué existe',
      origin: [
        'Spot Ticket nace de tres lados de la misma experiencia. Como público, vi una y otra vez fraudes con entradas en grupos de Facebook. Como músico, organicé eventos con mis bandas anteriores y conocí desde adentro lo difícil que es vender entradas de forma ordenada. Y como fan, he ido a ver en vivo a varios de mis grupos favoritos.',
        'La idea es que comprar una entrada sea seguro para quien asiste y más justo para quien toca.',
      ],
      whatHeading: 'Qué hace',
      what: [
        'Cada entrada es un cNFT en Solana: no se puede duplicar ni falsificar.',
        'Reventa regulada, con reglas definidas por el organizador.',
        'Acceso por NFC con validación offline en la puerta.',
        'Fan-clubs y mayores ingresos para los artistas.',
      ],
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
      url: 'https://spoticket.cl',
      visit: 'spoticket.cl ↗',
    },
    eso: {
      name: 'Observatorio Paranal · ESO',
      context: 'Práctica de invierno · jul 2026 — actualidad',
      text: [
        'Migración de componentes críticos del observatorio: la comunicación del log collector de telescopios e instrumentos pasa a Kafka.',
        'Modernización de dashboards construidos en versiones antiguas de Grafana.',
      ],
      stack: ['Kafka', 'Grafana', 'Observabilidad'],
    },
    othersHeading: 'Otros trabajos',
    others: [
      {
        name: '3tiz',
        org: 'SM Factory',
        period: '2025 — hoy',
        text: 'Mantención correctiva y evolutiva de una app Flask + Angular/Ionic en producción en República Dominicana y EE.UU.',
      },
      {
        name: 'Plataforma interna de métricas',
        org: 'CTR',
        period: '2025',
        text: 'Registro de métricas, horas extra y boletas para dos procesos de negocio. Angular, Spring Boot, CI/CD y VPS.',
      },
      {
        name: 'Pipeline de datos de flota',
        org: 'Transportes Llico',
        period: '2025',
        text: 'Data Warehouse y ETL con AWS y Spark para un sistema unificado de alertas, más una plataforma para visualizarlo.',
      },
    ],
    stackHeading: 'Con qué trabajo',
    stack: ['TypeScript', 'Angular', 'React / Next.js', 'NestJS', 'FastAPI', 'Spring Boot', 'Flask', 'PostgreSQL', 'Redis', 'Kafka', 'AWS', 'VPS'],
    cvNote: 'Ver CV completo',
  },
  offline: {
    heading: 'Fuera del código',
    intro: 'Lo que ocupa el resto del tiempo.',
    music: {
      heading: 'Música',
      text: 'Escucho mucha música, casi siempre rock, metal o jazz fusión.',
      favoriteLabel: 'Banda favorita',
      favorite: 'Avenged Sevenfold',
      groups: [
        { label: 'Metal', items: ['Mastodon', 'Gojira', 'Megadeth', 'Ghost', 'Symphony X', 'Nightwish'] },
        { label: 'Fusión y city pop japonés', items: ['Casiopea', 'Masayoshi Takanaka', 'ryusenkei'] },
      ],
      aside: 'Sí, Casiopea también es una constelación.',
    },
    bass: {
      heading: 'Bajo',
      text: 'Toco bajo. Con mis bandas anteriores no solo tocábamos: también organizábamos nuestros propios eventos, y de ahí salió parte de Spot Ticket.',
    },
    ygo: {
      heading: 'Yu-Gi-Oh!',
      deck: 'Kozmo',
      text: 'Mi deck favorito: pilotos y naves de una ópera espacial. Hasta en las cartas termino en el espacio.',
    },
    travel: {
      heading: 'Viajar',
      text: 'Disfruto viajar y conocer lugares nuevos.',
    },
  },
  contact: {
    heading: 'Contacto',
    blurb: '¿Un proyecto, una oportunidad o conversar de software, astronomía o música? Escríbeme.',
    email: 'b.salamanca01@ufromail.cl',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Descargar CV',
    builtWith: 'Hecho con Astro · estrellas del Yale Bright Star Catalog',
  },
  cv: {
    title: 'Full-Stack Developer · Estudiante de Ingeniería Civil Informática',
    summary:
      'Desarrollador full-stack con experiencia en plataformas web, pipelines de datos y aplicaciones en producción. Actualmente en práctica en el Observatorio Paranal de ESO.',
    location: 'Temuco, Chile',
    experienceHeading: 'Experiencia',
    experience: [
      {
        role: 'Práctica de Invierno',
        company: 'ESO · Observatorio Paranal',
        period: 'Jul 2026 — Actualidad',
        bullets: [
          'Migración de componentes críticos del observatorio: la comunicación del log collector de telescopios e instrumentos pasa a Kafka.',
          'Modernización de dashboards construidos en versiones antiguas de Grafana.',
        ],
      },
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Actualidad',
        bullets: [
          'Mantenedor del proyecto "3tiz", desplegado en República Dominicana y Estados Unidos.',
          'Mantenciones correctivas y evolutivas sobre una app Flask + Angular/Ionic/Capacitor en producción.',
        ],
      },
      {
        role: 'Práctica Full-Stack Developer',
        company: 'CTR',
        period: 'May 2025 — Jun 2025',
        bullets: [
          'Plataforma web interna para registro de métricas, horas extra y boletas de dos procesos de negocio.',
          'Frontend en Angular, backend en Spring Boot, CI/CD en Bitbucket y despliegue en VPS.',
        ],
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
      },
      {
        role: 'Mentor',
        company: 'Fundación Mustakis',
        period: '2022 — 2026',
        bullets: [
          'Docente de talleres de robótica educativa y creación de videojuegos (Scratch y Roblox Studio) para estudiantes de 7° básico a 3° medio.',
        ],
      },
    ],
    skillsHeading: 'Tecnologías',
    skills: [
      { label: 'Frontend', items: ['React', 'Angular', 'Next.js', 'Ionic', 'Expo / React Native'] },
      { label: 'Backend', items: ['FastAPI', 'NestJS', 'Node.js', 'Spring Boot', 'Flask'] },
      { label: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase'] },
      { label: 'Datos y observabilidad', items: ['Kafka', 'Spark', 'ETL', 'Data Warehouse', 'Grafana'] },
      { label: 'Cloud', items: ['AWS (EC2, S3, Lambda, Glue)', 'Google Cloud'] },
      { label: 'DevOps', items: ['GitHub Actions', 'GitLab CI/CD', 'Bitbucket CI/CD', 'VPS'] },
      { label: 'Herramientas IA', items: ['Claude Code', 'GitHub Copilot', 'OpenCode'] },
    ],
    educationHeading: 'Educación',
    education: { degree: 'Ingeniería Civil Informática', school: 'Universidad de La Frontera', period: '2021 — Actualidad' },
  },
};
