import { defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useMatchMedia } from '@cwist/vue-match-media';

export default defineComponent({
  data: function() {
    return {
      store: useStore(),
      matchMedia: useMatchMedia()
    }
  },
  computed: {
    isDarkMode: function(): boolean {
      return this.matchMedia.dark || this.store.state.settings.darkMode;
    }
  }
});
