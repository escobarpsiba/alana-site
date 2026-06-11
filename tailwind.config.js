/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "surface-dim": "#d7dedf",
        "on-secondary-fixed-variant": "#474743",
        "primary-fixed-dim": "#a2c8e0",
        "tertiary-fixed": "#e7e2da",
        "on-error-container": "#93000a",
        "on-surface-variant": "#40484a",
        "surface-container-highest": "#e1e6e8",
        "surface-tint": "#7baac7",
        "on-primary-fixed": "#003e56",
        "on-tertiary-fixed": "#1d1b17",
        "surface": "#f8fcfc",
        "inverse-on-surface": "#eff1f2",
        "primary-fixed": "#c6e4f7",
        "error-container": "#ffdad6",
        "on-primary-fixed-variant": "#3a6e8f",
        "secondary": "#5f5e5b",
        "on-background": "#181c1d",
        "tertiary-container": "#726f69",
        "on-primary": "#ffffff",
        "secondary-container": "#e5e2dd",
        "on-surface": "#181c1d",
        "error": "#ba1a1a",
        "surface-bright": "#f8fcfc",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        "secondary-fixed": "#e5e2dd",
        "primary": "#7baac7",
        "on-tertiary-fixed-variant": "#494741",
        "on-tertiary-container": "#f9f4eb",
        "on-primary-container": "#d4e8f5",
        "on-error": "#ffffff",
        "background": "#f8fcfc",
        "on-secondary-fixed": "#1c1c19",
        "surface-container-high": "#e7ecee",
        "inverse-surface": "#2d3132",
        "primary-container": "#5f92b0",
        "tertiary-fixed-dim": "#cbc6be",
        "secondary-fixed-dim": "#c9c6c2",
        "surface-container-lowest": "#ffffff",
        "inverse-primary": "#a2c8e0",
        "surface-variant": "#e1e6e8",
        "surface-container": "#edf2f4",
        "on-secondary-container": "#656461",
        "outline": "#727877",
        "surface-container-low": "#f2f7f9",
        "tertiary": "#5a5751",
        "outline-variant": "#c2c8c5",
        "navy": "#0d2b45",
        "navy-light": "#1a4b6d",
        "gold": "#c9a84c",
        "gold-light": "#e0c872"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        sm: "12px",
        xs: "4px",
        gutter: "24px",
        md: "24px",
        base: "8px",
        lg: "48px",
        xl: "80px",
        "container-max": "1120px"
      },
      fontFamily: {
        "body-md": ["Hanken Grotesk"],
        "body-lg": ["Hanken Grotesk"],
        "display-lg": ["Playfair Display", "Source Serif 4"],
        "label-md": ["Hanken Grotesk"],
        caption: ["Hanken Grotesk"],
        "headline-sm": ["Playfair Display", "Source Serif 4"],
        "headline-md": ["Playfair Display", "Source Serif 4"],
        "display-lg-mobile": ["Playfair Display", "Source Serif 4"],
        script: ["Dancing Script", "cursive"],
        "script-name": ["Corinthia", "cursive"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "500" }],
        "label-md": ["14px", { lineHeight: "1.2", letterSpacing: "0.08em", fontWeight: "600" }],
        caption: ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        "headline-sm": ["24px", { lineHeight: "1.4", fontWeight: "500" }],
        "headline-md": ["32px", { lineHeight: "1.3", fontWeight: "500" }],
        "display-lg-mobile": ["36px", { lineHeight: "1.2", letterSpacing: "-0.01em", fontWeight: "500" }]
      }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries")
  ]
}
