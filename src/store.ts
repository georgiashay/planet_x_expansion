import { createStore } from "vuex";
import { SERVER_URL } from "@/constants";
import axios from 'axios';

//
// @see https://github.com/vuejs/vuex/tree/v4.0.0-rc.1
//
export default createStore({
  state: {
    game: undefined,
    gameCode: undefined,
    equinox: undefined,
    startingFacts: undefined,
    history: []
  },

  actions: {
    async createGame({ commit }, sectors: number) {
      const response: any = await axios.get(SERVER_URL + "/creategame");
      commit('setGame', response.data.game);
      commit('setGameCode', response.data.gameCode);
    },
    async joinGame({ commit }, gameCode: string) {
      const response: any = await axios.get(SERVER_URL + "/joingame/" + gameCode);
      if (response.data.game) {
        commit('setGame', response.data.game);
        commit('setGameCode', response.data.gameCode);
      }
    }
  },

  mutations: {
    setGame(state: any, game: object) {
      state.game = game;
    },
    setGameCode(state: any, gameCode: string) {
      state.gameCode = gameCode;
    },
    setEquinox(state: any, equinox: string) {
      state.equinox = equinox;
    },
    resetGame(state: any) {
      state.game = undefined;
      state.gameCode = undefined;
      state.equinox = undefined;
      state.startingFacts = undefined;
    },
    setNumFacts(state: any, facts: number) {
      state.startingFacts = facts;
    }
  },

  getters: {
    myStartingInformation(state: any, getters: any) {
      if (state.game === undefined) {
        return [];
      }
      return state.game.startingInformation[state.equinox.toUpperCase()]
              .slice(0, state.startingFacts)
              .sort((clue1: any, clue2: any) => clue1.sector - clue2.sector);
    }
  }
});
