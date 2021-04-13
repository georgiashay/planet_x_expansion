import { createStore } from "vuex";

//
// @see https://github.com/vuejs/vuex/tree/v4.0.0-rc.1
//
export default createStore({
  state: {
    game: undefined
  },
  // ACTIONS (asynchronous)
  actions: {
  },

  // MUTATIONS ( set the state )
  mutations: {
    setGame(state: any, game: object) {
      state.game = game;
    }
  }
});
