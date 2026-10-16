export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
}

export interface ProjectItem {
  name: string;
  description: string;
  context: string;
  stack: string[];
  url?: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface NowItem {
  tag: string;
  text: string;
}

export interface Milestone {
  year: string;
  title: string;
  text: string;
  /** Tipo de hito: define el color del nodo en la trayectoria. */
  kind: 'edu' | 'teach' | 'work' | 'build' | 'space';
}

export interface ConsoleCommand {
  cmd: string;
  output: string[];
}

export interface Dict {
  lang: 'es' | 'en';
  meta: { title: string; description: string };
  nav: { about: string; journey: string; experience: string; projects: string; skills: string; contact: string };
  langSwitch: { otherPath: string; otherLabel: string; ariaLabel: string };
  hero: {
    kicker: string;
    localTime: string;
    name: string;
    title: string;
    tagline: string;
    now: string;
    ctaProjects: string;
    ctaContact: string;
    stats: Stat[];
  };
  about: {
    heading: string;
    paragraphs: string[];
    nowHeading: string;
    nowUpdated: string;
    now: NowItem[];
  };
  journey: { heading: string; intro: string; items: Milestone[] };
  experience: { heading: string; currentLabel: string; items: ExperienceItem[] };
  projects: { heading: string; privateNote: string; visit: string; featured: ProjectItem; items: ProjectItem[] };
  skills: {
    heading: string;
    groups: { label: string; items: string[] }[];
    traitsHeading: string;
    traits: { name: string; evidence: string }[];
  };
  console: {
    heading: string;
    intro: string;
    hint: string;
    placeholder: string;
    notFound: string;
    commands: ConsoleCommand[];
  };
  education: { heading: string; degree: string; school: string; period: string };
  footer: { heading: string; blurb: string; email: string; github: string; linkedin: string; cv: string; builtWith: string };
}
