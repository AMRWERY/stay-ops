import type { Config } from "tailwindcss";

export default {
  content: [
    // App-level files. Nuxt 4 keeps sources under app/, so these globs must be
    // prefixed — otherwise nothing is scanned and no utilities are generated.
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/composables/**/*.{js,ts}",
    "./app/utils/**/*.{js,ts}",
    "./app/app.vue",
    "./app/error.vue",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#10233D",
          light: "#17304F",
          dark: "#0B1929",
        },
        brass: {
          DEFAULT: "#A9832E",
          light: "#C7A257",
          dark: "#8A6A22",
        },
        linen: {
          DEFAULT: "#F6F3EC",
          dark: "#EFEAE0",
        },
        slate: {
          DEFAULT: "#5B6472",
          light: "#8A93A0",
        },
        mist: {
          DEFAULT: "#E4E7EB",
          dark: "#D2D7DE",
        },
        status: {
          ready: "#3F7D5C",
          progress: "#E8813B",
          urgent: "#B4472A",
          info: "#3B6FA0",
          idle: "#8A93A0",
        },
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 35, 61, 0.06), 0 1px 1px rgba(16, 35, 61, 0.04)",
        // Bottom-only, so the header reads as a layer above the scrolling page.
        header: "0 1px 3px rgba(16, 35, 61, 0.07), 0 4px 12px rgba(16, 35, 61, 0.04)",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-rtl"),
  ],
} satisfies Config;
