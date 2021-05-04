import { createStore } from "vuex";
import { API_URL, WEBSOCKET_URL, GAME_TYPES, SpaceObject, initialToSpaceObject } from "@/constants";
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
    history: [],
    gameType: undefined,
    isSession: false,
    sessionID: undefined,
    sessionCode: undefined,
    session: undefined,
    playerID: undefined,
    playerNum: undefined,
    playerName: undefined
  },

  actions: {
    async createGame({ commit }, numSectors) {
      // Get fresh game from server
      const response: any = await axios.get(API_URL + "/creategame/"  + numSectors);
      commit('setGame', response.data.game);
      commit('setGameCode', response.data.gameCode);
      commit('setGameType', GAME_TYPES[numSectors]);
    },
    async joinGame({ commit }, gameCode: string) {
      // Get game with game code from server if it exists
      const response: any = await axios.get(API_URL + "/joingame/" + gameCode);
      if (response.data.found) {
        commit('setGame', response.data.game);
        commit('setGameCode', response.data.gameCode);
        commit('setGameType', GAME_TYPES[response.data.game.board.size]);
      }
    },
    async createSession({ commit, dispatch }, { numSectors, name }) {
      // Start new session
      const response: any = await axios.post(API_URL + "/createSession/" + numSectors + "?name=" + name);
      commit('setGame', response.data.game);
      commit('setSessionState', response.data.state);
      commit('setGameType', GAME_TYPES[numSectors]);
      commit('setSessionCode', response.data.state.sessionCode);
      commit('setSessionID', response.data.state.sessionID);
      commit('setPlayerNum', response.data.playerNum);
      commit('setPlayerID', response.data.playerID);
      commit('setPlayerName', name);
      dispatch('listenSession');
    },
    async joinSession({ commit, dispatch }, { sessionCode, name }) {
      // Join existing session
      const response: any = await axios.post(API_URL + "/joinSession/" + sessionCode + "?name=" + name);
      if (response.data.found) {
        console.log(response.data);
        commit('setGame', response.data.game);
        commit('setSessionState', response.data.state);
        commit('setGameType', GAME_TYPES[response.data.game.board.size]);
        commit('setSessionCode', response.data.state.sessionCode);
        commit('setSessionID', response.data.state.sessionID);
        commit('setPlayerNum', response.data.playerNum);
        commit('setPlayerID', response.data.playerID);
        commit('setPlayerName', name);
        dispatch('listenSession');
      }
    },
    async startSession({ state }) {
      // Start session (when all players have joined)
      await axios.post(API_URL + "/startSession/?sessionID=" + state.sessionID + "&playerID=" + state.playerID);
    },
    listenSession({ state, commit }) {
      // Listen for updates to the session
      const ws = new WebSocket(WEBSOCKET_URL + "/" + state.sessionID);
      ws.onopen = () => console.log("Listening for updates to state");
      ws.onmessage = (message) => {
        const sessionState = JSON.parse(message.data);
        console.log(sessionState);
        commit('setSessionState', sessionState);
      };
    },
    async makeSessionMove({ state }, moveData) {
      await axios.post(API_URL + "/makeMove/?sessionID=" + state.sessionID + "&playerID=" + state.playerID, moveData);
    },
    survey({ state, dispatch }, { surveyObject, startSector, endSector }) {
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

      if (state.isSession) {
        const moveData = {
          turnType: "SURVEY",
          spaceObject: surveyObject.initial,
          sectors: [startSector-1, endSector-1],
          timeCost
        };

        dispatch('makeSessionMove', moveData);
      }
    },
    target({ state, dispatch }, { sectorNumber }) {
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

      if (state.isSession) {
        const moveData = {
          turnType: "TARGET",
          sector: sectorNumber - 1,
          timeCost: 4
        };

        dispatch('makeSessionMove', moveData);
      }
    },
    research({ state, dispatch }, { index }) {
      // Get research at specific index
      const actionResult = {
        actionType: "research",
        actionName: "Research",
        actionText: "Research " + String.fromCharCode(index+65) + ": " + state.game.research[index].categoryName,
        text: String.fromCharCode(index+65) + ". " + state.game.research[index].text,
        timeCost: 1
      }

      state.history.push(actionResult);

      if (state.isSession) {
        const moveData = {
          turnType: "RESEARCH",
          index,
          timeCost: 1
        };

        dispatch('makeSessionMove', moveData);
      }
    },
    locatePlanetX({ state, dispatch }, { sector, leftObject, rightObject }) {
      const leftSector = (sector == 1) ? state.gameType.sectors : sector - 1;
      const rightSector = (sector == state.gameType.sectors) ? 1 : sector + 1;

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

      if (state.isSession) {
        const moveData = {
          turnType: "LOCATE_PLANET_X",
          successful: found,
          timeCost: 5
        };

        dispatch('makeSessionMove', moveData);
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
    setGameType(state: any, gameType: any) {
      state.gameType = gameType;
    },
    setIsSession(state: any, isSession: boolean) {
      state.isSession = isSession;
    },
    setSessionState(state: any, sessionState: any) {
      state.session = sessionState;
    },
    setSessionID(state: any, sessionID: number) {
      state.sessionID = sessionID;
    },
    setSessionCode(state: any, sessionCode: string) {
      state.sessionCode = sessionCode;
    },
    setPlayerID(state: any, playerID: number) {
      state.playerID = playerID;
    },
    setPlayerNum(state: any, playerNum: number) {
      state.playerNum = playerNum;
    },
    setPlayerName(state: any, name: string) {
      state.playerName = name;
    },
    setSeasonView(state: any, seasonView: string) {
      state.seasonView = seasonView;
    },
    resetGame(state: any) {
      state.game = undefined;
      state.gameCode = undefined;
      state.session = undefined;
      state.isSession = false;
      state.playerID = undefined;
      state.playerNum = undefined;
      state.playerName = undefined;
      state.sessionID = undefined;
      state.sessionCode = undefined;
      state.seasonView = undefined;
      state.startingFacts = undefined;
      state.history = [];
    },
    setNumFacts(state: any, facts: number) {
      state.startingFacts = facts;
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
      if (state.isSession) {
        return state.game !== undefined && state.session !== undefined && state.sessionCode !== undefined;
      } else {
        return state.game !== undefined && state.gameCode !== undefined;
      }
    },
    playerReady(state: any, getters: any) {
      return getters.gameReady && state.seasonView !== undefined;
    },
    sessionPlayers(state: any) {
      if (state.session !== undefined) {
        return state.session.players;
      } else {
        return [];
      }
    }
  }
});
