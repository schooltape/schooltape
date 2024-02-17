// tailwind.config.js
module.exports = {
    // Other settings
    plugins: [
        require('@catppuccin/tailwindcss')({
        prefix: 'ctp',
        defaultFlavour: 'latte',
        }),
    ],
    content: [
        './popup.html',
    ],
};
