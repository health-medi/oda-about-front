import { Form } from 'vee-validate';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ValidateForm', Form);
});
