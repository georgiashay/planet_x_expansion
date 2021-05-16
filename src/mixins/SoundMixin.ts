import { defineComponent } from 'vue';
import { useStore } from 'vuex';

import SoundEffects from "@/mixins/SoundEffects.ts";

export default defineComponent({
  data: function() {
    return {
      store: useStore()
    }
  },
  methods: {
    playSound: async function(name: string) {
      await SoundEffects.playSound(name, this.store.state.settings.muteLevel);
    }
  }
});
