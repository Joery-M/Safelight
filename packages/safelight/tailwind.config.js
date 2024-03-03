/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,ts,vue}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FFE200',
                    50: '#FFF7B8',
                    100: '#FFF5A3',
                    200: '#FFF07A',
                    300: '#FFEB52',
                    400: '#FFE729',
                    500: '#FFE200',
                    600: '#C7B000',
                    700: '#8F7F00',
                    800: '#574D00',
                    900: '#1F1B00',
                    950: '#030200'
                },
                secondary: '#FFA400',
                accent: {
                    50: '#EEF1FF',
                    100: '#E0E5FF',
                    200: '#C6CEFF',
                    300: '#A4ACFD',
                    400: '#8082F9',
                    500: '#6961F3',
                    600: '#543EE6',
                    700: '#4D36CC',
                    800: '#3F2FA4',
                    900: '#362D82',
                    950: '#221A4C'
                },
                surface: {
                    DEFAULT: '#1E1E1E',
                    50: '#FFFFFF',
                    100: '#F7F7F7',
                    200: '#DDDDDD',
                    300: '#C4C4C4',
                    400: '#AAAAAA',
                    500: '#919191',
                    600: '#777777',
                    700: '#5E5E5E',
                    800: '#444444',
                    900: '#2B2B2B',
                    950: '#1E1E1E'
                },
                info: '#82aaff',
                success: '#c3e88d',
                warning: '#f78c6c',
                error: '#f07178'
            }
        },
        fontFamily: {
            roboto: ['Roboto', 'sans-serif']
        }
    },
    plugins: []
};
