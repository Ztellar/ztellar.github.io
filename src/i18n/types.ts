export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  stack: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  context: string;
  stack: string[];
}

export interface Dict {
  lang: 'es' | 'en';
  meta: { title: string; description: string };
  nav: { about: string; experience: string; projects: string; skills: string; contact: string };
  langSwitch: { otherPath: string; otherLabel: string; ariaLabel: string };
  hero: {
    kicker: string;
    name: string;
    title: string;
    eso: string;
    ctaProjects: string;
    ctaContact: string;
  };
  about: { heading: string; p1: string; p2: string; p3: string };
  experience: { heading: string; items: ExperienceItem[] };
  projects: { heading: string; privateNote: string; featured: ProjectItem; items: ProjectItem[] };
  skills: { heading: string; groups: { label: string; items: string[] }[] };
  education: { heading: string; degree: string; school: string; period: string };
  footer: { heading: string; blurb: string; email: string; github: string; linkedin: string; cv: string; builtWith: string };
}
