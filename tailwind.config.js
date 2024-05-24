// tailwind.config.js
module.exports = {
  // Other settings
  plugins: [
    require("@catppuccin/tailwindcss")({
      defaultFlavour: "latte",
    }),
  ],
  content: ["./src/options/*/*.{html,js}"],
};
