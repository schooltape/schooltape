export function injectStyles(styleText: string) {
  logger.info(`[content-utils] Injecting styles: ${styleText}`);
  const style = document.createElement("style");
  style.textContent = styleText;
  style.classList.add("schooltape");
  document.head.append(style);
}
