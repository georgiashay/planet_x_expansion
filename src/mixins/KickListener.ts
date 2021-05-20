import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineComponent } from 'vue';
import { alertController } from '@ionic/vue';

export default defineComponent({
  data: function() {
    return {
      store: useStore(),
      router: useRouter()
    }
  },
  computed: {
    kickVotes: function(): Array<any> {
      if (!this.store.state.isSession) {
        return [];
      } else {
        return this.store.state.session.kickVotes;
      }
    },
    kickedPlayers: function(): Array<any> {
      if (!this.store.state.isSession) {
        return [];
      } else {
        return this.store.state.session.kickedPlayers;
      }
    }
  },
  watch: {
    async kickVotes(newVotes: Array<any>, oldVotes: Array<any>) {
      if (!this.store.state.session) {
        return;
      }

      const oldKickIDs: Set<number> = new Set(oldVotes.map((vote: any) => vote.kickPlayerID));
      const myVoteIDs: Set<number> = new Set(newVotes.filter((vote: any) => vote.votePlayerID === this.store.state.playerID).map((vote: any) => vote.kickPlayerID));

      const newKickIDs: Set<number> = new Set(newVotes.map((vote: any) => vote.kickPlayerID).filter((id: number) => !oldKickIDs.has(id) && !myVoteIDs.has(id) && id !== this.store.state.playerID));
      const newKickPlayers: Array<any> = Array.from(newKickIDs).map((id: number) => this.store.getters.playerMap[id]);

      newKickPlayers.forEach(async (player: any) => {
        const alert = await alertController.create({
          cssClass: 'custom-alert',
          header: 'Kick ' + player.name,
          message: 'A vote to kick ' + player.name + ' has been started. Would you like to kick ' + player.name + '?',
          buttons: [
            {
              text: 'No',
              role: 'cancel',
              handler: () => {
                this.store.dispatch('castKickPlayer', {
                  kickPlayerID: player.id,
                  vote: false
                });
              }
            }, {
              text: 'Yes',
              role: 'okay',
              handler: () => {
                this.store.dispatch('castKickPlayer', {
                  kickPlayerID: player.id,
                  vote: true
                });
              }
            }
          ],
          backdropDismiss: false
        });

        alert.present();
      });
    },
    async kickedPlayers(newPlayers: Array<any>, oldPlayers: Array<any>) {
      if (!this.store.state.session) {
        return;
      }

      if (newPlayers.find((player: any) => player.id === this.store.state.playerID)) {
        const alert = await alertController.create({
          cssClass: 'custom-alert',
          header: 'Kicked',
          message: 'You have been kicked out of this game by a majority vote.',
          buttons: [
            {
              text: 'OK',
              role: 'okay'
            }
          ]
        });

        await alert.present();
        await alert.onDidDismiss();

        console.log("Going home");
        this.router.push("/home");
      }

    }
  }
});
