// types/gsap.d.ts
import type { GSAPStatic } from "gsap";
import type { ScrollTriggerInstance } from "gsap/ScrollTrigger";

declare module "#app" {
  interface NuxtApp {
    $gsap: GSAPStatic;
    $ScrollTrigger: typeof ScrollTriggerInstance;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $gsap: GSAPStatic;
    $ScrollTrigger: typeof ScrollTriggerInstance;
  }
}
