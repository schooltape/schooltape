export const EXCLUDE_MATCHES: string[] = ["*://*/learning/quiz/*"];
export const LOGO_INFO: Record<LogoId, LogoInfo> = {
  default: {
    name: "Default",
    url: "default",
    disable: true,
  },
  catppuccin: {
    name: "Catppuccin",
    url: "https://raw.githubusercontent.com/catppuccin/catppuccin/main/assets/logos/exports/1544x1544_circle.png",
  },
  schoolbox: {
    name: "Schoolbox",
    url: "schoolbox.svg",
    adaptive: true,
  },
  schooltape: {
    name: "Schooltape",
    url: "schooltape.svg",
  },
  "schooltape-rainbow": {
    name: "ST Rainbow",
    url: "schooltape-ctp.svg",
  },
  "schooltape-legacy": {
    name: "ST Legacy",
    url: "https://schooltape.github.io/schooltape-legacy.svg",
  },
};
