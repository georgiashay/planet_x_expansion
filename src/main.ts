import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import store from './store';

import { createVueMatchMediaPlugin } from "@cwist/vue-match-media";
const VueMatchMediaPlugin = createVueMatchMediaPlugin({
  breakpoints: {
    dark: {
      prefersColorScheme: "dark"
    },
    xs: "0px",
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px"
  }
});

import { IonicVue } from '@ionic/vue';
import RecentActions from '@/mixins/RecentActions.ts';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';
import('./theme/global_' + process.env.VUE_APP_THEME + '.css');

const app = createApp(App)
  .use(IonicVue)
  .use(store)
  .use(router)
  .use(VueMatchMediaPlugin)
  .use(RecentActions);

router.isReady().then(() => {
  app.mount('#app');
});
