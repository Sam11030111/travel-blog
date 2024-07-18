/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "dancing-script": ["Dancing Script"],
      },
      flex: {
        5: "5 1 0%",
        4: "4 1 0%",
        3: "3 1 0%",
        2: "2 1 0%",
      },
    },
  },
  plugins: [],
};
