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
      if (this.store.state.storageRead) {
        await SoundEffects.playSound(name, this.store.state.settings.muteLevel);
      } else {
        return new Promise((resolve) => {
          const unsubscribe = this.store.subscribe(async (mutation, state) => {
            if (mutation.type === "setStorageRead") {
              unsubscribe();
              await SoundEffects.playSound(name, this.store.state.settings.muteLevel);
              resolve();
            }
          });
        });
      }
    }
  }
});
