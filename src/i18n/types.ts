export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface Waypoint {
  year: string;
  label: string;
}

export interface OtherWork {
  name: string;
  org: string;
  period: string;
  text: string;
}

export interface Dict {
  lang: 'es' | 'en';
  meta: { title: string; description: string };
  nav: { story: string; work: string; offline: string; contact: string; cv: string };
  langSwitch: { otherPath: string; otherLabel: string; ariaLabel: string };
  hero: {
    kicker: string;
    name: string;
    lead: string[];
    role: string;
    ctaStory: string;
    ctaWork: string;
  };
  story: {
    heading: string;
    paragraphs: string[];
    orbit: {
      ariaLabel: string;
      inner: string;
      outer: string;
      /** Hitos a lo largo de la transferencia, en orden: del origen (Temuco) al destino (Paranal). */
      waypoints: Waypoint[];
      caption: string;
    };
  };
  work: {
    heading: string;
    intro: string;
    featured: {
      name: string;
      tagline: string;
      context: string;
      originHeading: string;
      origin: string[];
      whatHeading: string;
      what: string[];
      stack: string[];
      url: string;
      visit: string;
    };
    eso: { name: string; context: string; text: string[]; stack: string[] };
    othersHeading: string;
    others: OtherWork[];
    stackHeading: string;
    stack: string[];
    cvNote: string;
  };
  offline: {
    heading: string;
    intro: string;
    music: {
      heading: string;
      text: string;
      favoriteLabel: string;
      favorite: string;
      groups: { label: string; items: string[] }[];
      aside: string;
    };
    bass: { heading: string; text: string };
    ygo: { heading: string; deck: string; text: string };
    travel: { heading: string; text: string };
  };
  contact: { heading: string; blurb: string; email: string; github: string; linkedin: string; cv: string; builtWith: string };
  /** Datos solo para la página /cv (el CV sanitizado que se imprime a PDF). */
  cv: {
    title: string;
    summary: string;
    location: string;
    experienceHeading: string;
    experience: ExperienceItem[];
    skillsHeading: string;
    skills: { label: string; items: string[] }[];
    educationHeading: string;
    education: { degree: string; school: string; period: string };
  };
}
