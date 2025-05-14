module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neonBlue: "#00f5ff",
        neonPink: "#ff00ff",
        darkBg: "#0a0a0a",
        buttonHover: "#00f5ff",
      },
      boxShadow: {
        neonGlow: "0 0 10px rgba(0, 245, 255, 0.5)", // Neon glow effect
      },
    },
  },
plugins: [require("tailwindcss-animate")],
}
