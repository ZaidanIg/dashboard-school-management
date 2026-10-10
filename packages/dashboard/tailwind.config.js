/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#2463eb',
                'background-light': '#f8fafc',
                'background-dark': '#111621',
                'text-main': '#0e121b',
                'text-secondary': '#64748b',
                'border-color': '#e2e8f0',
                // Landing page palette — classic navy & gold
                brand: {
                    DEFAULT: '#3d63a5', // brand-500
                    50: '#eef3fa',
                    100: '#d8e3f2',
                    200: '#b3c7e5',
                    300: '#84a3d2',
                    400: '#5a7fbd',
                    500: '#3d63a5',
                    600: '#2f4f8a',
                    700: '#283f6f',
                    800: '#22355c',
                    900: '#1b2a4a',
                    950: '#111b31',
                },
                gold: {
                    DEFAULT: '#e2ab35', // gold-400
                    50: '#fdf8ec',
                    100: '#f9edcb',
                    200: '#f2d992',
                    300: '#eac15a',
                    400: '#e2ab35',
                    500: '#c98f1d',
                    600: '#a87016',
                    700: '#875416',
                    800: '#6f4418',
                    900: '#5d3918',
                },
                paper: '#f8fafc',
            },
            fontFamily: {
                sans: ['"Google Sans"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
                display: ['"Google Sans"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
                heading: ['"Google Sans"', '"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                DEFAULT: '0.25rem',
                lg: '0.5rem',
                xl: '0.75rem',
                full: '9999px',
            },
        },
    },
    plugins: [],
}
