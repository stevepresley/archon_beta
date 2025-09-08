module.exports = {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: "selector",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "shimmer": "shimmer 2s infinite",
      },
      // Custom scrollbar utilities
      scrollbar: {
        'thin': 'thin',
        'auto': 'auto',
        'none': 'none',
      },
      scrollbarWidth: {
        'thin': 'thin',
        'auto': 'auto', 
        'none': 'none',
      },
      scrollbarThumb: {
        'light': 'hsl(var(--blue-accent) / 0.40)',
        'dark': 'hsl(var(--blue-accent) / 0.60)',
        'transparent': 'transparent',
      },
      scrollbarTrack: {
        'light': 'rgba(0, 0, 0, 0.05)',
        'dark': 'rgba(255, 255, 255, 0.05)',
        'transparent': 'transparent',
      },
    },
  },
  plugins: [
    // Custom scrollbar plugin for cross-platform support
    function({ addUtilities, theme }) {
      const scrollbarUtilities = {
        // Base scrollbar utilities
        '.scrollbar': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('scrollbarThumb.light')} ${theme('scrollbarTrack.transparent')}`,
          '&::-webkit-scrollbar': {
            'width': '8px',
            'height': '8px',
          },
          '&::-webkit-scrollbar-track': {
            'background': theme('scrollbarTrack.light'),
            'border-radius': '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background': theme('scrollbarThumb.light'),
            'border-radius': '4px',
            'transition': 'background-color 0.2s ease',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': 'hsl(var(--blue-accent) / 0.60)',
          },
        },
        
        // Dark mode scrollbar
        '.dark .scrollbar': {
          'scrollbar-color': `${theme('scrollbarThumb.dark')} ${theme('scrollbarTrack.transparent')}`,
          '&::-webkit-scrollbar-track': {
            'background': theme('scrollbarTrack.dark'),
          },
          '&::-webkit-scrollbar-thumb': {
            'background': theme('scrollbarThumb.dark'),
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': 'hsl(var(--blue-accent) / 0.80)',
          },
        },

        // Thin scrollbar variant
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `${theme('scrollbarThumb.light')} ${theme('scrollbarTrack.transparent')}`,
          '&::-webkit-scrollbar': {
            'width': '6px',
            'height': '6px',
          },
          '&::-webkit-scrollbar-track': {
            'background': 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            'background': `linear-gradient(to bottom, hsl(var(--blue-accent) / 0.60), hsl(var(--blue-accent) / 0.30))`,
            'border-radius': '3px',
            'box-shadow': '0 0 3px hsl(var(--blue-accent) / 0.40)',
            'transition': 'background 0.2s ease, box-shadow 0.2s ease',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': `linear-gradient(to bottom, hsl(var(--blue-accent) / 0.80), hsl(var(--blue-accent) / 0.50))`,
            'box-shadow': '0 0 6px hsl(var(--blue-accent) / 0.60), inset 0 0 3px hsl(var(--blue-accent) / 0.30)',
          },
        },

        // Hidden scrollbar
        '.scrollbar-none': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            'display': 'none',
          },
        },

        // Mac horizontal scrollbar
        '.scrollbar-mac-h': {
          'scrollbar-width': 'thin',
          'scrollbar-color': `hsl(var(--blue-accent) / 0.40) ${theme('scrollbarTrack.light')}`,
          'overflow-x': 'scroll',
          'overflow-y': 'visible',
          '&::-webkit-scrollbar': {
            'width': '8px',
            'height': '12px',
          },
          '&::-webkit-scrollbar-track': {
            'background': theme('scrollbarTrack.light'),
            'border-radius': '6px',
            'margin': '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background': `linear-gradient(to right, hsl(var(--blue-accent) / 0.50), hsl(var(--blue-accent) / 0.70), hsl(var(--blue-accent) / 0.50))`,
            'border-radius': '6px',
            'border': '1px solid hsl(var(--blue-accent) / 0.20)',
            'box-shadow': '0 0 4px hsl(var(--blue-accent) / 0.40), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
            'transition': 'all 0.3s ease',
            'opacity': '0.8',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': `linear-gradient(to right, hsl(var(--blue-accent) / 0.70), hsl(var(--blue-accent) / 0.90), hsl(var(--blue-accent) / 0.70))`,
            'box-shadow': '0 0 8px hsl(var(--blue-accent) / 0.60), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
            'opacity': '1',
            'transform': 'scaleY(1.1)',
          },
          '&:hover': {
            'box-shadow': 'inset 0 -2px 4px rgba(0, 0, 0, 0.1)',
          },
        },

        // Dark mode for Mac horizontal
        '.dark .scrollbar-mac-h': {
          'scrollbar-color': `hsl(var(--blue-accent) / 0.60) ${theme('scrollbarTrack.dark')}`,
          '&::-webkit-scrollbar-track': {
            'background': theme('scrollbarTrack.dark'),
          },
          '&::-webkit-scrollbar-thumb': {
            'background': `linear-gradient(to right, hsl(var(--blue-accent) / 0.40), hsl(var(--blue-accent) / 0.60), hsl(var(--blue-accent) / 0.40))`,
            'border': '1px solid hsl(var(--blue-accent) / 0.30)',
            'box-shadow': '0 0 6px hsl(var(--blue-accent) / 0.50), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': `linear-gradient(to right, hsl(var(--blue-accent) / 0.60), hsl(var(--blue-accent) / 0.80), hsl(var(--blue-accent) / 0.60))`,
            'box-shadow': '0 0 10px hsl(var(--blue-accent) / 0.70), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
          },
          '&:hover': {
            'box-shadow': 'inset 0 -2px 4px rgba(255, 255, 255, 0.05)',
          },
        },

        // Project list enhanced scrollbar
        '.scrollbar-project-list': {
          'scrollbar-width': 'auto',
          'scrollbar-color': `hsl(var(--blue-accent) / 0.50) ${theme('scrollbarTrack.light')}`,
          'overflow-x': 'auto',
          'overflow-y': 'visible',
          '&::-webkit-scrollbar': {
            'width': '8px',
            'height': '14px',
          },
          '&::-webkit-scrollbar-track': {
            'background': `linear-gradient(to bottom, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.03))`,
            'border-radius': '7px',
            'margin': '2px 4px',
          },
          '&::-webkit-scrollbar-thumb': {
            'background': `linear-gradient(135deg, hsl(var(--blue-accent) / 0.40), hsl(var(--purple-accent) / 0.50), hsl(var(--blue-accent) / 0.40))`,
            'border-radius': '7px',
            'border': '2px solid rgba(255, 255, 255, 0.1)',
            'box-shadow': '0 0 6px hsl(var(--blue-accent) / 0.40), inset 0 1px 2px rgba(255, 255, 255, 0.15)',
            'opacity': '0.9',
            'transition': 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': `linear-gradient(135deg, hsl(var(--blue-accent) / 0.70), hsl(var(--purple-accent) / 0.80), hsl(var(--blue-accent) / 0.70))`,
            'box-shadow': '0 0 12px hsl(var(--blue-accent) / 0.60), inset 0 1px 3px rgba(255, 255, 255, 0.25)',
            'opacity': '1',
            'transform': 'scale(1.05)',
          },
        },

        // Dark mode for project list
        '.dark .scrollbar-project-list': {
          'scrollbar-color': `hsl(var(--blue-accent) / 0.60) ${theme('scrollbarTrack.dark')}`,
          '&::-webkit-scrollbar-track': {
            'background': `linear-gradient(to bottom, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))`,
          },
          '&::-webkit-scrollbar-thumb': {
            'background': `linear-gradient(135deg, hsl(var(--blue-accent) / 0.50), hsl(var(--purple-accent) / 0.60), hsl(var(--blue-accent) / 0.50))`,
            'border': '2px solid rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            'background': `linear-gradient(135deg, hsl(var(--blue-accent) / 0.70), hsl(var(--purple-accent) / 0.90), hsl(var(--blue-accent) / 0.70))`,
          },
        },
      };

      addUtilities(scrollbarUtilities);
    }
  ],
}