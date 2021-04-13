import { createStore } from "vuex";
import { SERVER_URL } from "@/constants";
import axios from 'axios';

//
// @see https://github.com/vuejs/vuex/tree/v4.0.0-rc.1
//
export default createStore({
  state: {
    game: undefined,
    gameCode: undefined
  },
  // ACTIONS (asynchronous)
  actions: {
    createGame({ commit }, sectors: number) {
      axios.get(SERVER_URL + "/creategame")
        .then((response: any) => {
          commit('setGame', response.data.game);
          commit('setGameCode', response.data.gameCode);
        });
    },
    joinGame({ commit }, gameCode: string) {
      axios.get(SERVER_URL + "/joingame/" + gameCode)
        .then((response: any) => {
          commit('setGame', response.data.game);
          commit('setGameCode', response.data.gameCode);
        });
    }
  },

  // MUTATIONS ( set the state )
  mutations: {
    setGame(state: any, game: object) {
      state.game = game;
    },
    setGameCode(state: any, gameCode: string) {
      state.gameCode = gameCode;
    }
  }
});
