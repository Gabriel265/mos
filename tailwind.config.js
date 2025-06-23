/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', 'class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode - Academic Excellence
        lightBg: '#FAFBFC',
        lightText: '#1A2B42',
        lightSecondaryText: '#5A6C7D',

        // Dark mode - Digital Innovation
        darkBg: '#0F1419',
        darkText: '#E8F4FD',
        darkSecondaryText: '#A8BCC8',

        // Accent Colors
        cambridgeBlue: '#2E86AB',
        successGreen: '#06A77D',
        warningAmber: '#F18F01',
        accentPurple: '#7209B7',

        // Service Specifics
        academicRed: '#C73E1D',
        techBlue: '#2E86AB',
        ictGreen: '#06A77D',
        creativePurple: '#7209B7',
        tutoringOrange: '#F18F01',
        contactNavy: '#1A2B42',

        // Electric/Neon for dark mode
        electricBlue: '#00D4FF',
        neonGreen: '#00FF88',
        cyberOrange: '#FF6B35',
        digitalPurple: '#B052FF',

        // Default HSL-based theme
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'sans-serif']
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        neon: '0 0 8px rgba(0, 255, 136, 0.7), 0 0 16px rgba(0, 212, 255, 0.5)'
      },
      animation: {
        float: 'float 3s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
