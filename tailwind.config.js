const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./layouts/**/*.vue",
    "./assets/**/*.{css,scss}",
    "./components/*.{vue,js}",
    "./components/**/*.{vue,js}",
    "./pages/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./*.{vue,js,ts}",
    "./app.vue",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: [
        "Apple SD Gothic Neo",
        "Poppins",
        "AppleGothic",
        "Malgun Gothic",
        "맑은 고딕",
        "AppleGothic",
        "Dotum",
        "돋움",
        "sans-serif",
      ],
      pretendard: ["Pretendard", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#FF1C7B",
        default: "#FFF2FB",
        info: colors.indigo,
        success: colors.green,
        warning: colors.yellow,
        danger: colors.red,
        gray: colors.neutral,
      },
      display: ["group-hover"],
      width: {
        128: "36rem",
      },
      height: {
        fit: "fit-content",
      },
      minWidth: {
        96: "24rem",
        128: "36rem",
      },
      maxWidth: {
        fit: "fit-content",
      },
      underlineOffset: {
        1: "1px;",
      },
    },
  },
  variants: {
    extend: {
      cursor: ["disabled"],
      textOpacity: ["disabled"],
      textColor: ["disabled"],
      backgroundColor: ["active"],
      ring: ["active"],
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
