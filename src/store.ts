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
      console.log(response.data);
      const xIndex = response.data.game.board.objects.findIndex((obj: any) => obj.initial == "X");
      console.log(xIndex + 1, response.data.game.board.objects[(xIndex-1+response.data.game.board.objects.length)%response.data.game.board.objects.length].initial, response.data.game.board.objects[(xIndex+1)%response.data.game.board.objects.length].initial);
      commit('setGame', response.data.game);
      commit('setIsSession', true);
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
        const xIndex = response.data.game.board.objects.findIndex((obj: any) => obj.initial == "X");
        console.log(xIndex + 1, response.data.game.board.objects[(xIndex-1+response.data.game.board.objects.length)%response.data.game.board.objects.length].initial, response.data.game.board.objects[(xIndex+1)%response.data.game.board.objects.length].initial);
        commit('setGame', response.data.game);
        commit('setIsSession', true);
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
        console.log("Received update to session");
        const sessionState = JSON.parse(message.data);
        commit('getNewlyRevealedTheories', sessionState);
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
        actionType: "SURVEY",
        actionName: "Survey",
        actionText,
        text,
        timeCost,
        time: new Date()
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
        actionType: "TARGET",
        actionName: "Target",
        actionText,
        text,
        timeCost: 4,
        time: new Date()
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
        actionType: "RESEARCH",
        actionName: "Research",
        actionText: "Research " + String.fromCharCode(index+65) + ": " + state.game.research[index].categoryName,
        text: String.fromCharCode(index+65) + ". " + state.game.research[index].text,
        timeCost: 1,
        time: new Date()
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

      const locationText = leftObject.initial + "-" + sector + "-" + rightObject.initial;
      if (found) {
        text = "Congratulations! You found Planet X!";
        upperText = "If you are the first to find Planet X,";
        actionText = "Locate Planet X, " + locationText + ", Success";
      } else {
        text = "You did not locate Planet X. At least one piece of information you entered was incorrect."
        upperText = "If no one has yet found Planet X,";
        actionText = "Locate Planet X, " + locationText + ", Fail";
      }

      const actionResult = {
        actionType: "LOCATE_PLANET_X",
        actionName: "Locate Planet X",
        actionText,
        text,
        upperText,
        success: found,
        timeCost: 5,
        time: new Date()
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
    },
    async submitTheories({ state }, theories) {
      const submittableTheories = theories.map((theory: any) => { return {spaceObject: theory.spaceObject.initial, sector: theory.sector - 1};});
      const response: any = await axios.post(API_URL + "/submitTheories/?sessionID=" + state.sessionID + "&playerID=" + state.playerID, {theories: submittableTheories});

      if (response.data.allowed) {
        const actionText = "Submit Theories, " + response.data.successfulTheories.map((theory: any) => (theory.sector+1) + theory.spaceObject.initial).join(" ");
        const text = "Submitted theories: " + response.data.successfulTheories.map((theory: any) => {
          const spaceObject = initialToSpaceObject[theory.spaceObject.initial];
          return "Sector " + (theory.sector+1) + " is " + spaceObject.one;
        }).join("; ") + ".";

        const actionResult = {
          actionType: "THEORY",
          actionName: "Submit Theories",
          actionText,
          text,
          time: new Date()
        }

        state.history.push(actionResult);
      }
    },
    async conference({ state, dispatch }, { index }) {
      // Get conference at specific index
      const actionResult = {
        actionType: "CONFERENCE",
        actionName: "Planet X Conference",
        actionText: "Conference X" + (index+1) + ": " + state.game.conference[index].categoryName,
        text: "X" + (index + 1) + ". " + state.game.conference[index].text,
        time: new Date()
      }

      state.history.push(actionResult);

      if (state.isSession) {
        await axios.post(API_URL + "/readConference/?sessionID=" + state.sessionID + "&playerID=" + state.playerID);
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
        actionType: "PEER_REVIEW",
        actionName: "Peer Review",
        text,
        time: new Date()
      }

      state.history.push(actionResult);
    },
    getNewlyRevealedTheories(state: any, sessionState: any) {
      const newlyRevealed = [];
      let j = 0;

      const currentTheories = state.session.theories.slice().sort((a: any, b: any) => a.id - b.id);
      const newTheories = sessionState.theories.slice().sort((a: any, b: any) => a.id - b.id);

      for (let i = 0; i < currentTheories.length; i++) {
        const theory = currentTheories[i];

        while (newTheories[j].id != theory.id) {
          j++;
        }

        if (newTheories[j].revealed && !theory.revealed) {
          const isCorrect = state.game.board.objects[theory.sector].initial === theory.spaceObject.initial;
          newlyRevealed.push({
            spaceObject: initialToSpaceObject[theory.spaceObject.initial],
            sector: theory.sector,
            isCorrect
          });
        }
      }

      newlyRevealed.sort((a: any, b: any) => {
        if (a.sector != b.sector) {
          return a.sector - b.sector;
        } else if (a.isCorrect != b.isCorrect) {
          return b.isCorrect - a.isCorrect;
        } else {
          return a.spaceObject.initial.localeCompare(b.spaceObject.initial);
        }
      });

      state.newlyRevealedTheories = newlyRevealed;

      if (newlyRevealed.length > 0) {
        const actionText = "Revealed Theories, " + newlyRevealed.map((theory: any) => (theory.sector + 1) + (theory.spaceObject.initial) + ":" + (theory.isCorrect ? "✓" : "X")).join(" ");
        const text = "Revealed theories: " + newlyRevealed.map((theory: any) => {
          return "Sector " + (theory.sector + 1) + " is " + (theory.isCorrect ? "" : "not ") + theory.spaceObject.one;
        }).join("; ") + ".";

        const actionResult = {
          actionType: "THEORY_REVEAL",
          actionName: "Revealed Theories",
          actionText,
          text,
          time: new Date()
        }

        state.history.push(actionResult);
      }
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
    lastTurnResult(state: any) {
      return state.history.slice().reverse().find((action: any) => ["SURVEY", "TARGET", "RESEARCH", "LOCATE_PLANET_X"].indexOf(action.actionType) >= 0);
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
    },
    myNextAction(state: any) {
      const myActions = state.session.actions.filter((action: any) => action.playerID == state.playerID);
      if (myActions.length == 0) {
        return null;
      } else {
        return myActions[0];
      }
    },
    actionAllowed: (state: any, getters: any) => (actionName: string): boolean => {
      if (!state.isSession) {
        return true;
      }

      const action = getters.myNextAction;

      if (action == null) {
        switch(state.session.currentAction.actionType) {
          case "END_GAME": return actionName === "END_GAME";
          default: return false;
        }
      }

      switch(action.actionType) {
        case "START_GAME":
          return actionName === "START_GAME";
          break;
        case "THEORY_PHASE":
          return actionName === "THEORY";
          break;
        case "CONFERENCE_PHASE":
          return actionName === "CONFERENCE";
          break;
        case "LAST_ACTION":
          return actionName === "THEORY" || actionName === "LOCATE_PLANET_X";
          break;
        case "PLAYER_TURN": {
          const researchAllowed = getters.lastTurnResult?.actionType != "RESEARCH";
          return actionName === "SURVEY"
                  || actionName === "TARGET"
                  || actionName === "LOCATE_PLANET_X"
                  || (actionName === "RESEARCH" && researchAllowed);
          }
      }
    },
    skySize(state: any) {
      return Math.floor(state.gameType.sectors/2);
    },
    isSectorInSky: (state: any, getters: any) => (sector: number) => {
      let sectorsPast = (sector - 1) - state.session.currentSector;
      if (sectorsPast < 0) {
        sectorsPast = state.gameType.sectors + sectorsPast;
      }

      return sectorsPast < getters.skySize;
    },
    skySectors(state: any, getters: any) {
      const sectors = Array.from(Array(getters.skySize)).map((el, i) => (i + state.session.currentSector) % state.gameType.sectors);
      return sectors;
    },
    playerInfo(state: any) {
      const players = state.session.players;
      const me = players.filter((p: any) => p.id === state.playerID);
      if (me.length == 0) {
        return null;
      } else {
        return me[0];
      }
    },
    sectorsBehind(state: any, getters: any) {
      const players = state.session.players.slice();
      players.sort((a: any, b: any) => a.sector - b.sector);

      if (players.length == 1) {
        return 0;
      }

      let maxDiff = 0;
      let sector = players[0].sector;

      for (let i = 0; i < players.length - 1; i++) {
        const diff = players[i+1].sector - players[i].sector;

        if (diff > maxDiff) {
          maxDiff = diff;
          sector = players[i].sector;
        }
      }

      const lastDiff = players[0].sector - players[players.length-1].sector + state.gameType.sectors;
      if (lastDiff > maxDiff) {
        maxDiff = lastDiff;
        sector = players[players.length-1].sector;
      }

      const mySector = getters.playerInfo.sector;

      let behind = sector - mySector;
      if (behind < 0) {
        behind += state.gameType.sectors;
      }

      return behind;
    },
    currentConference(state: any) {
      if (!state.isSession) {
        return -1;
      } else {
        console.log(state.gameType.conferences);
        console.log(state.session.currentSector);
        console.log(state.gameType.conferences.indexOf(state.session.currentSector));
        return state.gameType.conferences.indexOf(state.session.currentSector);
      }
    },
    revealedTheories(state: any) {
      const revealed = [];
      for (let i = 0; i < state.session.theories.length; i++) {
        const theory = state.session.theories[i];
        if (theory.revealed) {
          const isCorrect = state.game.board.objects[theory.sector].initial === theory.spaceObject.initial;
          revealed.push({
            spaceObject: initialToSpaceObject[theory.spaceObject.initial],
            sector: theory.sector,
            isCorrect
          });
        }
      }
      revealed.sort((a: any, b: any) => {
        if (a.sector != b.sector) {
          return a.sector - b.sector;
        } else if (a.isCorrect != b.isCorrect) {
          return b.isCorrect - a.isCorrect;
        } else {
          return a.spaceObject.initial.localeCompare(b.spaceObject.initial);
        }
      });
      return revealed;
    },
    uniqueRevealedTheories(state: any, getters: any) {
      const revealed = getters.revealedTheories.slice();
      const uniqueRevealed = [];
      for (let i = 0; i < revealed.length; i++) {
        const l = uniqueRevealed.length - 1;
        if (i > 0 && revealed[i].sector === uniqueRevealed[l].sector) {
          if (uniqueRevealed[l].isCorrect) {
            continue;
          } else if (revealed[i].spaceObject.initial === uniqueRevealed[l].spaceObject.initial) {
            continue;
          }
        }
        uniqueRevealed.push(revealed[i]);
      }
      return uniqueRevealed;
    },
    playerMap(state: any) {
      const playerMap: {[playerID: string]: any} = {};
      for (let i = 0; i < state.session.players.length; i++) {
        const player = state.session.players[i];
        playerMap[player.id] = player;
      }
      return playerMap;
    },
    fullHistory(state: any, getters: any) {
      const myHistory = state.history.slice();
      const allHistory = state.session.history.map((action: any) => Object.assign({}, action, {time: new Date(action.time)})).sort((action: any) => action.time);

      const history = [];

      const myPlayerNum = getters.playerInfo.num;
      const myPlayerName = getters.playerInfo.name;

      for (let i = 0; i < myHistory.length; i++) {
        if (myHistory[i].actionType === "THEORY_REVEAL") {
          history.push(Object.assign({
            mine: true,
            historyIndex: i
          }, myHistory[i]));
        } else {
          history.push(Object.assign({
            mine: true,
            playerNum: myPlayerNum,
            playerName: myPlayerName,
            playerID: state.session.playerID,
            historyIndex: i
          }, myHistory[i]));
        }
      }

      for (let i = 0; i < allHistory.length; i++) {
        if (allHistory[i].playerID != state.playerID) {
          let actionText = allHistory[i].text;
          if (allHistory[i].turnType === "RESEARCH") {
            actionText += ": " + state.game.research[allHistory[i].index].categoryName;
          }

          const action = Object.assign(allHistory[i], {
            actionType: allHistory[i].turnType,
            actionName: allHistory[i].turnType.split("_").map((word: string) => word.slice(0, 1) + word.slice(1).toLowerCase()).join(" "),
            actionText,
            mine: false,
            playerNum: getters.playerMap[allHistory[i].playerID].num,
            playerName: getters.playerMap[allHistory[i].playerID].name,
          });

          history.push(action);
        }
      }

      history.sort((a, b) => a.time - b.time);

      return history;
    },
    selectedHistory(state: any, getters: any) {
      const history = getters.fullHistory.filter((action: any) => action.actionType !== "PEER_REVIEW");

      const myPlayerNum = getters.playerInfo.num;

      if (state.session.currentAction.actionType === "THEORY_PHASE") {
        let i = history.length - 1;
        let lastTheories = 0;

        while (i >= 0 && history[i].actionType === "THEORY") {
          lastTheories += 1;
          i--;
        }

        const removeTheories = lastTheories % state.session.players.length;

        for (let i = history.length - 1; i >= history.length - removeTheories; i--) {
          if (history[i].playerNum !== myPlayerNum) {
            history.splice(i, 1);
          }
        }
      }

      return history;
    }
  }
});
