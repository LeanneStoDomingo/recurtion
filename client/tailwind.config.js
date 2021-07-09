module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            ringWidth: ['focus-visible'],
            ringColor: ['focus-visible'],
            ringOpacity: ['focus-visible'],
            outline: ['focus-visible'],
        },
    },
    plugins: [],
}