// plugins/nprogress.client.ts
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ easing: "ease", trickleSpeed: 100, showSpinner: false });

export default defineNuxtPlugin((nuxtApp) => {
  // nProgress를 Nuxt 애플리케이션의 컨텍스트에 추가
  nuxtApp.provide('nProgress', NProgress);
});
