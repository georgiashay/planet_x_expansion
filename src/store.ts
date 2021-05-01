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
      // Get fresh game from server
      const response: any = await axios.get(SERVER_URL + "/creategame/24");
      commit('setGame', response.data.game);
      commit('setGameCode', response.data.gameCode);
    },
    async joinGame({ commit }, gameCode: string) {
      // Get game with game code from server if it exists
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

      // Get slice of only sectors being surveyed
      if (endSector >= startSector) {
        sectors = state.game.board.objects.slice(startSector-1, endSector);
      } else {
        sectors = state.game.board.objects.slice(0, endSector)
                    .concat(state.game.board.objects.slice(startSector-1));
      }

      // Find the number of the object being surveyed
      const numObject = sectors.filter((obj: any) => {
        // If the object is an empty sector, include Planet X in the count
        if (surveyObject.initial === SpaceObject.EMPTY.initial) {
          return obj.initial === surveyObject.initial || obj.initial === SpaceObject.PLANET_X.initial;
        } else {
          return obj.initial === surveyObject.initial;
        }
      }).length;

      // Construct text for result
      let text;
      if (startSector !== endSector) {
        text = (numObject == 1) ? "There is " : "There are ";
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
      } else {
        text = "Sector " + endSector + " ";
        if (surveyObject.initial === SpaceObject.EMPTY.initial) {
          if (numObject == 0) {
            text += " does not appear empty.";
          } else {
            text += " appears empty. It may be truly empty, or it may be Planet X.";
          }
        } else {
          if (numObject == 0) {
            text += " is not " + surveyObject.one + ".";
          } else {
            text += " is " + surveyObject.one + ".";
          }
        }
      }

      // Text to be displayed in history
      const actionText = "Survey, " + surveyObject.proper + ", " + startSector + "-" + endSector;
      // Calculate time cost for survey
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
      // Check what is in that sector
      let foundObject = state.game.board.objects[sectorNumber-1];
      foundObject = initialToSpaceObject[foundObject.initial];

      // If it is Planet X, show that it appears empty
      if (foundObject.initial === SpaceObject.PLANET_X.initial) {
        foundObject = SpaceObject.EMPTY;
      }

      // Construct text for the result
      let text;
      if (foundObject.initial == SpaceObject.EMPTY.initial) {
        text = "Sector " + sectorNumber + " appears empty.\nRemember, Planet X appears empty.";
      } else {
        text = "There is " + foundObject.one + " in sector " + sectorNumber + ".";
      }

      // Text to be displayed in history
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
      // Get research at specific index
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

      // Check if objects are all correct
      const found = state.game.board.objects[sector-1].initial === SpaceObject.PLANET_X.initial &&
                    state.game.board.objects[leftSector-1].initial === leftObject.initial &&
                    state.game.board.objects[rightSector-1].initial === rightObject.initial;

      // Construct text depending on success or failure
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
      // Check if theory object is correct
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
      // Get conference at specific index
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
              .slice(0, state.startingFacts) // Use only first state.startingFacts clues
              .sort((clue1: any, clue2: any) => clue1.sector - clue2.sector) // Display in order
              .map((clue: any) => {
                const newClue = Object.assign({}, clue);
                const spaceObject = initialToSpaceObject[clue.eliminatedObject.initial];
                newClue.spaceObject = spaceObject;
                return newClue;
              }); // Get space object info from each initial
    },
    lastActionResult(state: any) {
      // Get last action result in history if it exists
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
