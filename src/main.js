// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


if (typeof window !== "undefined") {
  const ethereumDescriptor = Object.getOwnPropertyDescriptor(window, 'ethereum');
  // Only redefine if it doesn't exist or is configurable
  if (!ethereumDescriptor || ethereumDescriptor.configurable) {
    Object.defineProperty(window, "ethereum", {
      configurable: true,
      writable: true,
      value: undefined,
    });
  }
}

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faStar as fasStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";

// Add icons to library
library.add(fasStar, faStarHalfAlt, farStar);

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.component("FontAwesomeIcon", FontAwesomeIcon);
app.use(router);
app.mount("#app");
