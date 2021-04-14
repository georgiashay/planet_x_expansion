import { createStore } from "vuex";
import { SERVER_URL, SpaceObject } from "@/constants";
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
    history: [],
    lastActionResult: undefined
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
      state.history = [];
      state.lastActionResult = undefined;
    },
    setNumFacts(state: any, facts: number) {
      state.startingFacts = facts;
    },
    survey(state: any, { surveyObject, startSector, endSector }) {
      let sectors;
      const spaceObject = SpaceObject[surveyObject];

      if (endSector > startSector) {
        sectors = state.game.board.objects.slice(startSector-1, endSector);
      } else {
        sectors = state.game.board.objects.slice(0, endSector)
                    .concat(state.game.board.objects.slice(startSector-1));
      }

      const numObject = sectors.filter((obj: any) => {
        if (spaceObject === SpaceObject.EMPTY) {
          return obj.initial === spaceObject.initial || obj.initial === SpaceObject.PLANET_X.initial;
        } else {
          return obj.initial === spaceObject.initial;
        }
      }).length;

      let text = (numObject == 1) ? "There is " : "There are ";
      text += (numObject == 0) ? "no " : numObject + " ";
      text += (numObject == 1) ? spaceObject.name : spaceObject.plural;
      text += " between sectors " + startSector + "-" + endSector + ".";

      const timeCost = 5 - Math.ceil(sectors.length/4);

      state.lastActionResult = {
        actionType: "survey",
        actionName: "Survey",
        text,
        timeCost
      }
      state.history.push(state.lastActionResult);
    },
    target(state: any, { sectorNumber }) {
      let foundObject = state.game.board.objects[sectorNumber-1];
      foundObject = SpaceObject[Object.keys(SpaceObject).filter((objCode: any) => SpaceObject[objCode].initial === foundObject.initial)[0]];
      if (foundObject.initial === SpaceObject.PLANET_X.initial) {
        foundObject = SpaceObject.EMPTY;
      }

      let text = "There is " + foundObject.one + " in sector " + sectorNumber + ".";
      if (foundObject == SpaceObject.EMPTY) {
        text += "\nRemember, Planet X appears empty."
      }
      state.lastActionResult = {
        actionType: "target",
        actionName: "Target",
        text,
        timeCost: 4
      }

      state.history.push(state.lastActionResult);
    },
    research(state: any, { index }) {
      state.lastActionResult = {
        actionType: "research",
        actionName: "Research",
        text: String.fromCharCode(index+65) + ". " + state.game.research[index].text,
        timeCost: 1
      }

      state.history.push(state.lastActionResult);
    },
    locatePlanetX(state: any, { sector, leftObject, rightObject }) {
      const leftSector = (sector == 1) ? 24 : sector - 1;
      const rightSector = (sector == 24) ? 1 : sector + 1;

      const found = state.game.board.objects[sector-1].initial === SpaceObject.PLANET_X.initial &&
                    state.game.board.objects[leftSector-1].initial === leftObject.initial &&
                    state.game.board.objects[rightSector-1].initial === rightObject.initial;

      let text;
      if (found) {
        text = "Congratulations! You found Planet X!";
      } else {
        text = "You did not locate Planet X. At least one piece of information you entered was incorrect."
      }

      state.lastActionResult = {
        actionType: "locateplanetx",
        actionName: "Locate Planet X",
        text,
        timeCost: 5
      }

      state.history.push(state.lastActionResult);
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
