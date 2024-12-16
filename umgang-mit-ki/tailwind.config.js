/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // Aktiviert den Darkmode
    theme: {
        colors: {
            'gruen': '#01BB88',
            'blaugrau': '#191D27',
            'mittelblau': '#122B43',
            'rot': '#dc2626',
        },
        extend: {},
    },
    plugins: [],
};
