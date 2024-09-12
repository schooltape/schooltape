/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{svelte,js,ts,jsx,tsx,html}"],
  safelist: [
    {
      pattern: /bg-ctp-.+/,
    },
    "ctp-mocha",
    "ctp-macchiato",
    "ctp-frappe",
    "ctp-latte",
  ],
  theme: {
    extend: {
      colors: {
        "ctp-accent": "rgba(var(--ctp-accent) , <alpha-value>)",
      },
    },
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      prefix: "ctp",
      defaultFlavour: "mocha",
    }),
  ],
};
