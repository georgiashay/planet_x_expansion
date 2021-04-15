<template>
  <div class="popover_container">
    <ion-item-group>
      <ion-item
        v-for="(obj, objCode) in spaceObjects"
        :key="objCode"
        @click="choose(obj)"
        class="space_item">
        <ion-icon :src="obj.icon"></ion-icon>&nbsp;
        {{obj.proper}}
      </ion-item>
    </ion-item-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { popoverController, IonItemGroup,
        IonItem, IonIcon } from '@ionic/vue';
import { SpaceObject } from '@/constants';

export default defineComponent({
  name: 'SpaceObjectSelectPopover',
  components: {
    IonItemGroup,
    IonItem,
    IonIcon
  },
  props: ['value', 'excludeObjects'],
  data: function() {
    return {
      SpaceObject
    }
  },
  computed: {
    spaceObjects: function(): any {
      const objects = Object.assign({}, SpaceObject);
      for (const objectCode in objects) {
        if (this.excludeObjects.indexOf(objectCode) >= 0) {
          delete objects[objectCode];
        }
      }
      return objects;
    }
  },
  methods: {
    choose: async function(obj: any) {
      await popoverController.dismiss(obj);
    }
  }
});
</script>

<style scoped>
ion-item:hover {
  --background: whitesmoke;
}

.space_item {
  cursor: pointer;
}
</style>
