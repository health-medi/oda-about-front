import Toast, { PluginOptions, POSITION } from 'vue-toastification';

const options: PluginOptions = {
  position: POSITION.TOP_CENTER,
};

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Toast, options);
});
