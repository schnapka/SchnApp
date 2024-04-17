module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E2E2E",
        secondary: "#262626",
        accent: "#4EAC6D", // Akcentní barva
        accentHover: "#4AC773", // Akcentní barva hover
        background: "#3C3C3C", // Barva pozadí
        text: "#adb5bd", // Barva textu
        success: "#4EAC6D",
        warning: "#ac4e4e",
      },
      fontSize: {
        icon: "1em", // Přidání utility třídy pro ikony
        xxs: "9px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
