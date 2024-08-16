import FileUpload from 'vue-upload-component';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('VueFileUpload', FileUpload);
});
