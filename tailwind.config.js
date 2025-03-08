export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#E6F0FF",
          200: "#B3D4FF",
          300: "#80B8FF",
          500: "#2563eb", // Your existing blue
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        secondary: {
          100: "#F0FDF4",
          200: "#BBF7D0",
          300: "#86EFAC",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
        },
        tertiary: {
          100: "#F5F3FF",
          200: "#DDD6FE",
          300: "#C4B5FD",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
        },
      },
    },
  },
  plugins: [],
};
