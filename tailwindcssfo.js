        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                        serif: ['Instrument Serif', 'serif'],
                    },
                    colors: {
                        brand: {
                            50: '#f0f4ff',
                            100: '#dce6fd',
                            200: '#b9ccfb',
                            300: '#8aaaf7',
                            400: '#5a84f2',
                            500: '#3560ea',
                            600: '#2448d0',
                            700: '#1d38a8',
                            800: '#1a2f87',
                            900: '#1a2b6b',
                        },
                        ink: {
                            50: '#f7f7f9',
                            100: '#ededf2',
                            200: '#d8d8e2',
                            300: '#b5b5c6',
                            400: '#8e8ea8',
                            500: '#6e6e88',
                            600: '#58586f',
                            700: '#47475a',
                            800: '#3c3c4a',
                            900: '#24242e',
                        },
                    },
                    animation: {
                        'fade-up': 'fadeUp 0.5s ease forwards',
                        'scale-in': 'scaleIn 0.3s ease forwards',
                        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                    },
                    keyframes: {
                        fadeUp: {
                            '0%': { opacity: '0', transform: 'translateY(18px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        },
                        scaleIn: {
                            '0%': { opacity: '0', transform: 'scale(0.9)' },
                            '100%': { opacity: '1', transform: 'scale(1)' },
                        },
                        pulseSoft: {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.04)' },
                        },
                    },
                },
            },
        }