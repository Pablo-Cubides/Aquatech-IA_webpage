module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0b72ef",
        accent: "#16a34a",
      },
      fontSize: {
        xl: ["1.375rem", { lineHeight: "1.25" }],
      },
    },
  },
  plugins: [],
};
