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
    extend: {},
  },
  plugins: [
    require("@catppuccin/tailwindcss")({
      prefix: "ctp",
      defaultFlavour: "macchiato",
    }),
  ],
};
