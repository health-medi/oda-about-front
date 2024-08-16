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
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
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
      fontSize: {
        "3xl": [
          "32px",
          {
            letterSpacing: "-0.02em",
            lineHeight: "36px",
          },
        ],
        "3.5xl": [
          "40px",
          {
            letterSpacing: "-0.02em",
            lineHeight: "44px",
          },
        ],
        "4xl": [
          "48px",
          {
            letterSpacing: "-0.02em",
            lineHeight: "52px",
          },
        ],
        "5xl": [
          "64px",
          {
            letterSpacing: "-0.02em",
            lineHeight: "68px",
          },
        ],
      },
      borderWidth: {
        DEFAULT: "1px",
        0: "0",
        2: "2px",
        3: "3px",
        4: "4px",
        6: "6px",
        8: "8px",
      },
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
