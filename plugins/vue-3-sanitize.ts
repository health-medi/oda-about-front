import Vue3Sanitize from 'vue-3-sanitize';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Sanitize);
});
