import { defineNuxtConfig } from "nuxt3";

/**
 * Back-end API > About Host
 */
const BACK_API_ABOUT_HOST = process.env.BACK_API_ABOUT_HOST || "localhost";

/**
 * Back-end API > About Port
 */
const BACK_API_ABOUT_PORT = process.env.BACK_API_ABOUT_PORT || "8031";

/**
 * Back-end API > About HMR Port
 */
const BACK_API_ABOUT_HMR_PORT = process.env.BACK_API_ABOUT_HMR_PORT || "28031";
/**
 * Back-end API > About SSL Port
 */
const BACK_API_ABOUT_SSL_PORT = process.env.BACK_API_ABOUT_SSL_PORT || "10444";

/**
 * 카카오맵 키
 */
const KAKAOMAP_APIKEY = "984be8d413d61da16077b1098513c9eb";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  publicRuntimeConfig: {
    KAKAOMAP_APIKEY,
    BACK_API_ABOUT_HOST,
    BACK_API_ABOUT_PORT,
  },
  css: [
    "@/assets/styles/style.scss",
    "@/assets/styles/tailwind.scss",
    "@/assets/styles/toast.scss",
    "@/assets/styles/scrollbar.scss",
    "@mdi/font/scss/materialdesignicons.scss",
  ],
  plugins: [{ src: "@/plugins/aos", mode: "client", ssr: false }],
  meta: {
    meta: [
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, maximum-scale=1",
      },
      {
        name: "naver-site-verification",
        content: "eb7c0e3550aefef06d1b52e0f0fc9f13f9bea895",
      },
      { name: "og:title", content: "오다 - 오늘의 다이어트" },
      {
        name: "og:description",
        content: "오다 -오늘의 다이어트 홈페이지입니다.",
      },
      { name: "og:type", content: "website" },
    ],
    title: "오다 - 오늘의 다이어트",
    htmlAttrs: {
      lang: "ko",
    },
    bodyAttrs: {
      class:
        "font-pretendard max-w-[1920px] mx-auto *:relative *:w-full *:overflow-x-hidden antialiased tracking-tight bg-gray-200",
    },
  },
  build: {
    postcss: {
      postcssOptions: require("./postcss.config.js"),
    },
    transpile: ["gsap"],
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1500,
    },
    server: {
      // hmr: {
      //   protocol: 'ws',
      //   port: Number(BACK_API_ABOUT_HMR_PORT),
      //   clientPort: Number(BACK_API_ABOUT_SSL_PORT),
      //   path: 'hmr/',
      // },
      // 로컬 개발용 proxy 설정
      proxy: {
        "^/api/.*": {
          target: `http://${BACK_API_ABOUT_HOST}:${BACK_API_ABOUT_PORT}`,
          changeOrigin: true,
        },
      },
    },
  },
});
