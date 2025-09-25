import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'Cairo', 'system-ui', 'sans-serif'],
				'cairo': ['Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
				'noto-arabic': ['Noto Sans Arabic', 'IBM Plex Sans Arabic', 'sans-serif'],
				'ibm-plex': ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'sans-serif'],
				'arabic-title': ['Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
				'arabic-body': ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'sans-serif'],
				'academic': ['IBM Plex Sans Arabic', 'Noto Sans Arabic', 'sans-serif'],
				'academic-title': ['Cairo', 'IBM Plex Sans Arabic', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					dark: 'hsl(var(--primary-dark))',
					light: 'hsl(var(--primary-light))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					light: 'hsl(var(--secondary-light))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
					light: 'hsl(var(--accent-light))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'saudi-green': 'hsl(var(--saudi-green))',
				'saudi-white': 'hsl(var(--saudi-white))',
				'saudi-gold': 'hsl(var(--saudi-gold))',
				'national-day-accent': 'hsl(var(--national-day-accent))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in-left': {
					'0%': {
						opacity: '0',
						transform: 'translateX(-30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'fade-in-right': {
					'0%': {
						opacity: '0',
						transform: 'translateX(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateX(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-15px)'
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0px) rotate(0deg)'
					},
					'50%': {
						transform: 'translateY(-20px) rotate(2deg)'
					}
				},
				'pulse-soft': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
					},
					'50%': {
						boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)'
					}
				},
				'saudi-wave': {
					'0%': {
						transform: 'translateX(-100%) rotate(0deg)',
						opacity: '0.7'
					},
					'50%': {
						transform: 'translateX(0%) rotate(2deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'translateX(100%) rotate(0deg)',
						opacity: '0.7'
					}
				},
				'national-pride': {
					'0%, 100%': {
						transform: 'scale(1) rotate(0deg)',
						filter: 'hue-rotate(0deg)'
					},
					'25%': {
						transform: 'scale(1.05) rotate(1deg)',
						filter: 'hue-rotate(5deg)'
					},
					'50%': {
						transform: 'scale(1.1) rotate(0deg)',
						filter: 'hue-rotate(10deg)'
					},
					'75%': {
						transform: 'scale(1.05) rotate(-1deg)',
						filter: 'hue-rotate(5deg)'
					}
				},
				'golden-shine': {
					'0%': {
						backgroundPosition: '-200% center'
					},
					'100%': {
						backgroundPosition: '200% center'
					}
				},
				'pride-glow': {
					'0%, 100%': {
						filter: 'brightness(1) saturate(1)',
						transform: 'scale(1)'
					},
					'50%': {
						filter: 'brightness(1.2) saturate(1.3)',
						transform: 'scale(1.02)'
					}
				},
				'sparkle': {
					'0%, 100%': {
						opacity: '0.4',
						transform: 'scale(0.8) rotate(0deg)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.2) rotate(180deg)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '0.6',
						transform: 'scale(1)'
					},
					'50%': {
						opacity: '1',
						transform: 'scale(1.05)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in-left': 'fade-in-left 0.6s ease-out',
				'fade-in-right': 'fade-in-right 0.6s ease-out',
				'scale-in': 'scale-in 0.5s ease-out',
				'float': 'float 4s ease-in-out infinite',
				'float-slow': 'float-slow 6s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'saudi-wave': 'saudi-wave 4s ease-in-out infinite',
				'national-pride': 'national-pride 6s ease-in-out infinite',
				'golden-shine': 'golden-shine 3s linear infinite',
				'pride-glow': 'pride-glow 4s ease-in-out infinite',
				'sparkle': 'sparkle 2s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 4s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;