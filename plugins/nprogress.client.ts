import nProgress from "nprogress";
import "nprogress/nprogress.css";

nProgress.configure({ easing: "ease", trickleSpeed: 100, showSpinner: false });

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("nProgress", nProgress);
});
