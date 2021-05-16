import { defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  data: function() {
    return {
      store: useStore()
    }
  },
  methods: {
    isDarkMode: function() {
      if (window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return true;
      } else {
        return this.store.state.settings.darkMode;
      }
    }
  }
});
