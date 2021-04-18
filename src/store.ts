import { createStore } from "vuex";
import { SERVER_URL, SpaceObject, initialToSpaceObject } from "@/constants";
import axios from 'axios';

//
// @see https://github.com/vuejs/vuex/tree/v4.0.0-rc.1
//
export default createStore({
  state: {
    game: undefined,
    gameCode: undefined,
    seasonView: undefined,
    startingFacts: undefined,
    history: []
  },

  actions: {
    async createGame({ commit }) {
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
    setSeasonView(state: any, seasonView: string) {
      state.seasonView = seasonView;
    },
    resetGame(state: any) {
      state.game = undefined;
      state.gameCode = undefined;
      state.seasonView = undefined;
      state.startingFacts = undefined;
      state.history = [];
    },
    setNumFacts(state: any, facts: number) {
      state.startingFacts = facts;
    },
    survey(state: any, { surveyObject, startSector, endSector }) {
      let sectors;

      if (endSector > startSector) {
        sectors = state.game.board.objects.slice(startSector-1, endSector);
      } else {
        sectors = state.game.board.objects.slice(0, endSector)
                    .concat(state.game.board.objects.slice(startSector-1));
      }

      const numObject = sectors.filter((obj: any) => {
        if (surveyObject.initial === SpaceObject.EMPTY.initial) {
          return obj.initial === surveyObject.initial || obj.initial === SpaceObject.PLANET_X.initial;
        } else {
          return obj.initial === surveyObject.initial;
        }
      }).length;

      let text = (numObject == 1) ? "There is " : "There are ";
      text += (numObject == 0) ? "no " : numObject + " ";
      if (surveyObject.initial === SpaceObject.EMPTY.initial) {
        text += (numObject == 1) ? "sector " : "sectors ";
        text += "that ";
        text += (numObject == 1) ? "appears " : "appear ";
        text += "empty in sectors " + startSector + "-" + endSector + ".";
        text += (numObject == 1) ? "\nIt may be truly empty, or it may be Planet X." : (numObject == 0) ? "" : "\nThey may all be truly empty, but one of them might be Planet X.";
      } else {
        text += (numObject == 1) ? surveyObject.name : surveyObject.plural;
        text += " in sectors " + startSector + "-" + endSector + ".";
      }

      const actionText = "Survey, " + surveyObject.proper + ", " + startSector + "-" + endSector;
      const timeCost = 5 - Math.ceil(sectors.length/4);

      const actionResult = {
        actionType: "survey",
        actionName: "Survey",
        actionText,
        text,
        timeCost
      }
      state.history.push(actionResult);
    },
    target(state: any, { sectorNumber }) {
      let foundObject = state.game.board.objects[sectorNumber-1];
      foundObject = SpaceObject[Object.keys(SpaceObject).filter((objCode: any) => SpaceObject[objCode].initial === foundObject.initial)[0]];
      if (foundObject.initial === SpaceObject.PLANET_X.initial) {
        foundObject = SpaceObject.EMPTY;
      }

      let text;
      if (foundObject.initial == SpaceObject.EMPTY.initial) {
        text = "Sector " + sectorNumber + " appears empty.\nRemember, Planet X appears empty.";
      } else {
        text = "There is " + foundObject.one + " in sector " + sectorNumber + ".";
      }

      const actionText = "Target, Sector " + sectorNumber;
      const actionResult = {
        actionType: "target",
        actionName: "Target",
        actionText,
        text,
        timeCost: 4
      }

      state.history.push(actionResult);
    },
    research(state: any, { index }) {
      const actionResult = {
        actionType: "research",
        actionName: "Research",
        actionText: "Research " + String.fromCharCode(index+65) + ": " + state.game.research[index].categoryName,
        text: String.fromCharCode(index+65) + ". " + state.game.research[index].text,
        timeCost: 1
      }

      state.history.push(actionResult);
    },
    locatePlanetX(state: any, { sector, leftObject, rightObject }) {
      const leftSector = (sector == 1) ? 24 : sector - 1;
      const rightSector = (sector == 24) ? 1 : sector + 1;

      const found = state.game.board.objects[sector-1].initial === SpaceObject.PLANET_X.initial &&
                    state.game.board.objects[leftSector-1].initial === leftObject.initial &&
                    state.game.board.objects[rightSector-1].initial === rightObject.initial;

      let text;
      let upperText;
      let actionText;
      if (found) {
        text = "Congratulations! You found Planet X!";
        upperText = "If you are the first to find Planet X,";
        actionText = "Locate Planet X, Success";
      } else {
        text = "You did not locate Planet X. At least one piece of information you entered was incorrect."
        upperText = "If no one has yet found Planet X,";
        actionText = "Locate Planet X, Fail";
      }

      const actionResult = {
        actionType: "locateplanetx",
        actionName: "Locate Planet X",
        actionText,
        text,
        upperText,
        success: found,
        timeCost: 5
      }

      state.history.push(actionResult);
    },
    peerReview(state: any, { spaceObject, sector }) {
      const realObject = state.game.board.objects[sector - 1];
      let text;
      if (realObject.initial === spaceObject.initial) {
        text = "Correct. Sector " + sector + " has " + spaceObject.one + ".";
      } else {
        text = "Incorrect. Sector " + sector + " does not have " + spaceObject.one + ".";
      }

      const actionResult = {
        actionType: "peerreview",
        actionName: "Peer Review",
        text
      }

      state.history.push(actionResult);
    },
    conference(state: any, { index }) {
      const actionResult = {
        actionType: "conference",
        actionName: "Planet X Conference",
        actionText: "Conference X" + (index+1) + ": " + state.game.conference[index].categoryName,
        text: "X" + (index + 1) + ". " + state.game.conference[index].text
      }

      state.history.push(actionResult);
    }
  },

  getters: {
    myStartingInformation(state: any) {
      if (state.game === undefined) {
        return [];
      }
      return state.game.startingInformation[state.seasonView.name.toUpperCase()]
              .slice(0, state.startingFacts)
              .sort((clue1: any, clue2: any) => clue1.sector - clue2.sector)
              .map((clue: any) => {
                const newClue = Object.assign({}, clue);
                const spaceObject = initialToSpaceObject[clue.eliminatedObject.initial];
                newClue.spaceObject = spaceObject;
                return newClue;
              });
    },
    lastActionResult(state: any) {
      if (state.history.length) {
        return state.history[state.history.length - 1];
      } else {
        return undefined;
      }
    },
    gameReady(state: any) {
      return state.game !== undefined && state.gameCode !== undefined;
    },
    playerReady(state: any, getters: any) {
      return getters.gameReady && state.seasonView !== undefined;
    }
  }
});
