function print(method: (...args: any[]) => void, ...args: any[]) {
  if (import.meta.env.MODE === "production") return;

  const css = "background: #7fd4fa; color: #051d29; border-radius:10px";

  method("%c schooltape ", css, ...args);
}

export const logger = {
  info: (...args: any[]) => print(console.log, ...args),
  warn: (...args: any[]) => print(console.warn, ...args),
  error: (...args: any[]) => print(console.error, ...args),
};
