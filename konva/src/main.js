import '@mdi/font/css/materialdesignicons.css'
import { createApp } from "vue";
import App from "./App.vue";
import VueKonva from 'vue-konva';

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

createApp(App).use(vuetify).use(VueKonva).mount("#app");
