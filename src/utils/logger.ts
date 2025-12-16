function print(method: (...args: unknown[]) => void, ...args: unknown[]) {
  if (import.meta.env.MODE === "production") return;

  const css = "background: #7fd4fa; color: #051d29; border-radius:10px";

  method("%c schooltape ", css, ...args);
}

export const logger = {
  info: (...args: unknown[]) => print(console.log, ...args),
  warn: (...args: unknown[]) => print(console.warn, ...args),
  error: (...args: unknown[]) => print(console.error, ...args),
};
