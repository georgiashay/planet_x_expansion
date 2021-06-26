import { createStore } from "vuex";
import { API_URL, WEBSOCKET_URL, GAME_TYPES, SpaceObject,
        initialToSpaceObject, SUSPICION_LEVELS, SeasonView,
        IS_PROD } from "@/constants";
import axios from 'axios';
import SoundEffects from '@/mixins/SoundEffects.ts';
import actionResponses from '@/utilities/actionResponses.ts';
import { Storage } from '@ionic/storage';

const historySortOrder = (a: any, b: any) => {
  if (a.turn === b.turn) {
    if (a.actionType === "THEORY_REVEAL") {
      return 1;
    } else if (b.actionType === "THEORY_REVEAL") {
      return -1;
    } else {
      return a.time - b.time;
    }
  } else {
    return a.turn - b.turn;
  }
};

const log = function(...args: Array<any>) {
  if (!IS_PROD) {
    console.log(...args);
  }
}

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
    playerName: undefined,
    webSocketFailures: 0,
    currentWebSocket: undefined,
    logic: {
      board: undefined,
      researchUsed: undefined,
      conferenceUsed: undefined,
      surveyUsed: undefined,
      undoQueue: undefined,
      redoQueue: undefined
    },
    settings: {
      muteLevel: 1,
      darkMode: true,
      rectangleEliminate: false,
      scratchUncertain: false,
      logicIconSize: 1,
      levelColors: ["--ion-color-light-contrast", "#5260ff"],
      multiInitial: false
    },
    storage: new Storage(),
    storageRead: false,
    recentSessions: [],
    awaitingTurnSubmission: false
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
      const response: any = await axios.post(API_URL + "/createSession/" + numSectors, { name });
      const xIndex = response.data.game.board.objects.findIndex((obj: any) => obj.initial == "X");
      log(xIndex + 1, response.data.game.board.objects[(xIndex-1+response.data.game.board.objects.length)%response.data.game.board.objects.length].initial, response.data.game.board.objects[(xIndex+1)%response.data.game.board.objects.length].initial);
      log(response.data.game.board.objects.map((obj: any, i: number) => (i+1) + ":" + obj.initial));
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
      commit('setupLogic', numSectors);
      dispatch('restoreLogic');
      dispatch('storeRecentSession');
      log("Going to listen session");
      log("listened");
    },
    async joinSession({ commit, dispatch }, { sessionCode, name }) {
      // Join existing session
      const response: any = await axios.post(API_URL + "/joinSession/" + sessionCode, { name });
      if (response.data.found) {
        // console.log(response.data);
        const xIndex = response.data.game.board.objects.findIndex((obj: any) => obj.initial == "X");
        log(xIndex + 1, response.data.game.board.objects[(xIndex-1+response.data.game.board.objects.length)%response.data.game.board.objects.length].initial, response.data.game.board.objects[(xIndex+1)%response.data.game.board.objects.length].initial);
        log(response.data.game.board.objects.map((obj: any, i: number) => (i+1) + ":" + obj.initial));
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
        commit('setupLogic', response.data.game.board.size);
        dispatch('restoreLogic');
        dispatch('storeRecentSession');
      }
    },
    async reconnectSession({ state, commit, dispatch }, { sessionCode, playerNum }) {
      // Reconnect to existing session
      const response: any = await axios.get(API_URL + "/reconnectSession/" + sessionCode + "/?playerNum=" + playerNum);
      if (response.data.found) {
        // console.log(response.data);
        const xIndex = response.data.game.board.objects.findIndex((obj: any) => obj.initial == "X");
        log(xIndex + 1, response.data.game.board.objects[(xIndex-1+response.data.game.board.objects.length)%response.data.game.board.objects.length].initial, response.data.game.board.objects[(xIndex+1)%response.data.game.board.objects.length].initial);
        log(response.data.game.board.objects.map((obj: any, i: number) => (i+1) + ":" + obj.initial));
        commit('setGame', response.data.game);
        commit('setIsSession', true);
        commit('setSessionState', response.data.state);
        commit('setGameType', GAME_TYPES[response.data.game.board.size]);
        commit('setSessionCode', response.data.state.sessionCode);
        commit('setSessionID', response.data.state.sessionID);
        commit('setPlayerNum', response.data.playerNum);
        commit('setPlayerID', response.data.playerID);
        commit('setPlayerName', response.data.playerName);
        commit('refillHistory');
        dispatch('listenSession');
        commit('setupLogic', response.data.game.board.size);
        dispatch('restoreLogic');
        await dispatch('restoreStartingInfo');
        await dispatch('checkWinner', state.session);
      }
    },
    async startSession({ state }) {
      // Start session (when all players have joined)
      const response = await axios.post(API_URL + "/startSession/?sessionID=" + state.sessionID + "&playerID=" + state.playerID);
      log(response);
    },
    listenSession({ state, dispatch, commit }) {
      // Listen for updates to the session
      const ws = new WebSocket(WEBSOCKET_URL + "/" + state.sessionID);
      ws.onopen = () => console.log("Listening for updates to state");
      ws.onmessage = (message) => {
        // console.log("Received update to session");
        const sessionState = JSON.parse(message.data);
        // console.log(sessionState);
        commit('getNewlyRevealedTheories', sessionState);
        dispatch('checkMyTurn', sessionState);
        dispatch('checkWinner', sessionState);
        commit('setSessionState', sessionState);
      };
      ws.onclose = () => {
        state.webSocketFailures++;
        console.log("Disconnecting, re-connecting to listen.");
        if (state.webSocketFailures < 10) {
          dispatch('listenSession');
        } else {
          state.currentWebSocket = undefined;
          console.log("10 consecutive failures. Not reconnecting.");
        }
        setTimeout(() => {
          state.webSocketFailures--;
        }, 10000);
      }
      state.currentWebSocket = ws;
    },
    stopListening({ state }) {
      if (state.currentWebSocket) {
        state.currentWebSocket.onclose = function() { return; };
        state.currentWebSocket.close();
      }
      state.currentWebSocket = undefined;
    },
    async makeSessionMove({ state, getters }, moveData) {
      const turn = getters.myNextAction.turn;
      moveData = Object.assign({ turn }, moveData);
      state.awaitingTurnSubmission = true;
      const response: any = await axios.post(API_URL + "/makeMove/?sessionID=" + state.sessionID + "&playerID=" + state.playerID, moveData);
      state.awaitingTurnSubmission = false;
      log(response.data);
    },
    async changeColor({ state }, newColor) {
      await axios.post(API_URL + "/setColor/?playerID=" + state.playerID + "&color=" + newColor);
    },
    checkMyTurn({ state }, sessionState) {
      if (sessionState.currentAction.playerID === state.playerID) {
        if (state.session.currentAction.turn !== sessionState.currentAction.turn) {
          SoundEffects.playSound("doorbell", state.settings.muteLevel);
        }
      } else if (sessionState.currentAction.playerID === null) {
        if (state.session.currentAction.turn !== sessionState.currentAction.turn) {
          SoundEffects.playSound("doorbell", state.settings.muteLevel);
        }
      }
    },
    checkWinner({ state, getters }, sessionState: any) {
      if (sessionState.currentAction.actionType === "END_GAME") {
        const maxScore = Math.max(...sessionState.scores.map((score: any) => score.total));
        let winningScores = sessionState.scores.filter((score: any) => score.total === maxScore);
        const maxPlanetX = Math.max(...winningScores.map((score: any) => score.planetX));
        winningScores = winningScores.filter((score: any) => score.planetX === maxPlanetX);
        const maxLeaderBonus = Math.max(...winningScores.map((score: any) => score.first));
        winningScores = winningScores.filter((score: any) => score.first === maxLeaderBonus);

        const winningPlayers = winningScores.map((score: any) => getters.playerMap[score.playerID]);
        const actionText = winningPlayers.map((player: any) => player.name).join(", ") + " won the game in " + getters.numTurns + (getters.numTurns === 1 ? " turn" : " turns");
        const text = winningPlayers.map((player: any) => player.name).join(", ") + " won the game with " + maxScore + " points after " + getters.numTurns + (getters.numTurns === 1 ? " turn" : " turns");

        const actionResult = {
          actionType: "WINNER",
          actionName: "Game Over",
          actionText,
          text,
          time: new Date(),
          turn: sessionState.currentAction.turn
        }

        state.history.push(actionResult);
      }
    },
    survey({ state, getters, dispatch }, { surveyObject, startSector, endSector }) {
      const actionResult = actionResponses.survey(state.game, state.gameType, getters.currentTurn, new Date(), surveyObject, startSector-1, endSector-1);

      state.history.push(actionResult);

      if (state.isSession) {
        const moveData = {
          turnType: "SURVEY",
          spaceObject: surveyObject.initial,
          sectors: [startSector-1, endSector-1],
          timeCost: actionResult.timeCost
        };

        dispatch('makeSessionMove', moveData);
      }
    },
    target({ state, getters, dispatch }, { sectorNumber }) {
      const actionResult = actionResponses.target(state.game, getters.currentTurn, new Date(), sectorNumber-1);

      state.history.push(actionResult);

      if (state.isSession) {
        const moveData = {
          turnType: "TARGET",
          sector: sectorNumber-1,
          timeCost: 4
        };

        dispatch('makeSessionMove', moveData);
      }
    },
    research({ state, getters, dispatch }, { index }) {
      const actionResult = actionResponses.research(state.game, getters.currentTurn, new Date(), index);

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
    locatePlanetX({ state, getters, dispatch }, { sector, leftObject, rightObject }) {
      const actionResult = actionResponses.locatePlanetX(state.game, getters.currentTurn, new Date(), sector-1, leftObject, rightObject);

      state.history.push(actionResult);

      if (state.isSession) {
        const moveData = {
          turnType: "LOCATE_PLANET_X",
          successful: actionResult.success,
          sector: sector - 1,
          leftObject: leftObject.initial,
          rightObject: rightObject.initial,
          timeCost: 5
        };

        dispatch('makeSessionMove', moveData);
      }
    },
    async submitTheories({ state, getters }, theories) {
      const submittableTheories = theories.map((theory: any) => { return {spaceObject: theory.spaceObject.initial, sector: theory.sector - 1};});
      const turn = getters.myNextAction.turn;

      state.awaitingTurnSubmission = true;
      const response: any = await axios.post(API_URL + "/submitTheories/?sessionID=" + state.sessionID + "&playerID=" + state.playerID, {theories: submittableTheories, turn });
      state.awaitingTurnSubmission = false;

      if (response.data.allowed) {
        const actionResult = actionResponses.theories(getters.currentTurn, new Date(), response.data.successfulTheories);

        state.history.push(actionResult);
      }
    },
    async conference({ state, getters }, { index }) {
      const actionResult = actionResponses.conference(state.game, getters.currentTurn, new Date(), index);

      state.history.push(actionResult);

      if (state.isSession) {
        state.awaitingTurnSubmission = true;
        await axios.post(API_URL + "/readConference/?sessionID=" + state.sessionID + "&playerID=" + state.playerID);
        state.awaitingTurnSubmission = false;
      }
    },
    peerReview({ state, getters }, { spaceObject, sector }) {
      const actionResult = actionResponses.peerReview(state.game, getters.currentTurn, new Date(), sector-1, spaceObject);

      state.history.push(actionResult);
    },
    async storeLogic({ state }) {
      const currentLogicStr: string = await state.storage.get("logic");
      let currentLogic: {[sessionID: string]: any} = {};

      if (currentLogicStr !== null) {
        currentLogic = JSON.parse(currentLogicStr);
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3);

      const augmentedLogic = Object.assign({
        expires: expirationDate
      }, state.logic);

      augmentedLogic.researchUsed = Array.from(augmentedLogic.researchUsed);
      augmentedLogic.conferenceUsed = Array.from(augmentedLogic.conferenceUsed);
      augmentedLogic.surveyUsed = Array.from(augmentedLogic.surveyUsed);

      currentLogic[state.sessionID] = augmentedLogic;
      await state.storage.set("logic", JSON.stringify(currentLogic));
    },
    async storeStartingInfo({ state }) {
      const currentInfoStr: string = await state.storage.get("startingInformation");
      let currentInfo: {[sessionID: string]: any} = {};

      if (currentInfoStr !== null) {
        currentInfo = JSON.parse(currentInfoStr);
      }

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3);

      const augmentedInfo = {
        expires: expirationDate,
        facts: state.startingFacts,
        view: state.seasonView.name.toUpperCase()
      }

      currentInfo[state.sessionID] = augmentedInfo;
      await state.storage.set("startingInformation", JSON.stringify(currentInfo));
    },
    async storeRecentSession({state}) {
      const recentSessionStr: string = await state.storage.get("recentSessions");
      let recentSessions = [];

      if (recentSessionStr !== null) {
        recentSessions = JSON.parse(recentSessionStr);
      }

      recentSessions.splice(0, 0, {
        sessionCode: state.sessionCode,
        playerNum: state.playerNum
      });

      recentSessions = recentSessions.slice(0, 10);
      state.recentSessions = recentSessions;

      await state.storage.set("recentSessions", JSON.stringify(recentSessions));
    },
    setResearchUsed({state, dispatch}, { index }) {
      state.logic.researchUsed.add(index);
      dispatch('storeLogic');
    },
    setResearchUnused({state, dispatch}, { index }) {
      state.logic.researchUsed.delete(index);
      dispatch('storeLogic');
    },
    setConferenceUsed({state, dispatch}, { index }) {
      state.logic.conferenceUsed.add(index);
      dispatch('storeLogic');
    },
    setConferenceUnused({state, dispatch}, { index }) {
      state.logic.conferenceUsed.delete(index);
      dispatch('storeLogic');
    },
    setSurveyUsed({state, dispatch}, { index }) {
      state.logic.surveyUsed.add(index);
      dispatch('storeLogic');
    },
    setSurveyUnused({state, dispatch}, { index }) {
      state.logic.surveyUsed.delete(index);
      dispatch('storeLogic');
    },
    removeLastUndo({ state }) {
      state.logic.undoQueue.pop();
    },
    addToQueue({ state }, { action, queue }) {
      let actionQueue;
      switch(queue) {
        case "undo": actionQueue = state.logic.undoQueue; break;
        case "redo": actionQueue = state.logic.redoQueue; break;
        default: return;
      }
      actionQueue.push([action]);
    },
    newPacket({ state }, { queue }) {
      let actionQueue;
      switch(queue) {
        case "undo": actionQueue = state.logic.undoQueue; break;
        case "redo": actionQueue = state.logic.redoQueue; break;
        default: return;
      }
      actionQueue.push([]);
    },
    addToLastPacket({ state }, { action, queue }) {
      let actionQueue;
      switch(queue) {
        case "undo": actionQueue = state.logic.undoQueue; break;
        case "redo": actionQueue = state.logic.redoQueue; break;
        default: return;
      }
      actionQueue[actionQueue.length - 1].push(action);
    },
    async swapPacketQueue({ state, dispatch }, { queue }) {
      let originQueue;
      let destQueueName;
      switch(queue) {
        case "undo":
          originQueue = state.logic.undoQueue;
          destQueueName = "redo";
          break;
        case "redo":
          originQueue = state.logic.redoQueue;
          destQueueName = "undo";
          break;
        default:
          return;
      }
      const packet = originQueue.pop();
      await dispatch('newPacket', { queue: destQueueName });
      for (let i = 0; i < packet.length; i++) {
        const { action, sector, object, level } = packet[i];
        let oppositeAction;
        if (state.logic.board[sector][object].state === "eliminated") {
          oppositeAction = { action: "eliminate", sector, object, level: state.logic.board[sector][object].level };
        } else if (state.logic.board[sector][object].state === "equal") {
          oppositeAction = { action: "equal", sector, object, level: state.logic.board[sector][object].level };
        } else if (state.logic.board[sector][object].state === "none") {
          oppositeAction = { action: "none", sector, object };
        }
        await dispatch('addToLastPacket', { action: oppositeAction, queue: destQueueName });
      }
      return packet;
    },
    async undoLogic({ state, commit, dispatch }) {
      if (state.logic.undoQueue.length > 0) {
        const packet = await dispatch('swapPacketQueue', { queue: "undo" });
        for (let i = packet.length - 1; i >= 0; i--) {
          const { action, sector, object, level }: { action: string; sector: number; object: string; level: number | undefined } = packet[i];
          if (action === "eliminate") {
            commit('logicEliminate', { sector, object, level });
          } else if (action === "equal") {
            commit('logicSet', { sector, object, level });
          } else if (action === "none") {
            commit('logicUnset', { sector, object });
          }
        }

      }
    },
    async redoLogic({ state, commit, dispatch }) {
      const packet = await dispatch('swapPacketQueue', { queue: "redo" });
      for (let i = packet.length - 1; i >= 0; i--) {
        const { action, sector, object, level }: { action: string; sector: number; object: string; level: number | undefined } = packet[i];
        if (action === "eliminate") {
          commit('logicEliminate', { sector, object, level });
        } else if (action === "equal") {
          commit('logicSet', { sector, object, level });
        } else if (action === "none") {
          commit('logicUnset', { sector, object });
        }
      }
    },
    addStateToUndoPacket({ state, dispatch }, { sector, object }) {
      let action;
      if (state.logic.board[sector][object].state === "eliminated") {
        action = { action: "eliminate", sector, object, level: state.logic.board[sector][object].level };
      } else if (state.logic.board[sector][object].state === "equal") {
        action = { action: "equal", sector, object, level: state.logic.board[sector][object].level };
      } else if (state.logic.board[sector][object].state === "none") {
        action = { action: "none", sector, object };
      }
      dispatch('addToLastPacket', { queue: 'undo', action });
    },
    async clearLogic({ state, commit, dispatch }) {
      await dispatch('newPacket', { queue: 'undo' });
      for (let i = 0; i < state.gameType.sectors; i++) {
        for (const obj of state.gameType.logicSheetOrder) {
          if (obj !== "C" || [2,3,5,7,11,13,17,19,23].indexOf(i + 1) >= 0) {
            await dispatch('addStateToUndoPacket', { sector: i, object: obj });
            await commit('logicUnset', { sector: i, object: obj });
          }
        }
      }
      state.logic.researchUsed = new Set();
      state.logic.conferenceUsed = new Set();
      state.logic.surveyUsed = new Set();
    },
    async logicEliminateLevel({ state, commit, dispatch }, { sector, object, level=0, newPacket=true }: { sector: number; object: number; level: number | undefined; newPacket: boolean }) {
      if (newPacket) {
        await dispatch('newPacket', { queue: 'undo' });
      }
      await dispatch('addStateToUndoPacket', { sector, object });
      state.logic.redoQueue = [];
      commit('logicEliminate', { sector, object, level });
      dispatch('storeLogic');
    },
    async logicUnsetLevel({ state, commit, dispatch }, { sector, object, level=0, newPacket=true }: { sector: number; object: number; level: number | undefined; newPacket: boolean }) {
      if (newPacket) {
        await dispatch('newPacket', { queue: 'undo' });
      }
      await dispatch('addStateToUndoPacket', { sector, object });
      state.logic.redoQueue = [];
      commit('logicUnset', { sector, object });
      dispatch('storeLogic');
    },
    async logicSetLevel({ state, commit, dispatch }, { sector, object, level=0, newPacket=true }: { sector: number; object: number; level: number | undefined; newPacket: boolean }) {
      if (newPacket) {
        await dispatch('newPacket', { queue: 'undo' });
      }
      for (const [obj, sts] of Object.entries(state.logic.board[sector])) {
        const status: any = sts;
        if (status.state === "equal" && status.level >= level) {
          await dispatch('addStateToUndoPacket', { sector, object: obj });
          commit('logicUnset', {
            object: obj,
            sector
          });
        }
      }
      await dispatch('addStateToUndoPacket', { sector, object });
      state.logic.redoQueue = [];
      commit('logicSet', { sector, object, level });
      dispatch('storeLogic');
    },
    logicToggle({ state, commit, dispatch }, { sector, object, level=0 }) {
      if (state.logic.board[sector][object].state === "eliminated") {
        if (state.logic.board[sector][object].level > level) {
          dispatch('logicEliminateLevel', { sector, object, level });
        } else {
          dispatch('logicUnsetLevel', { sector, object, level });
        }
      } else if (state.logic.board[sector][object].state === "equal" ){
        dispatch('logicUnsetLevel', { sector, object, level });
      } else {
        dispatch('logicEliminateLevel', { sector, object, level });
      }
    },
    logicToggleEqual({ state, commit, dispatch }, { sector, object, level=0 }) {
      if (state.logic.board[sector][object].state === "equal") {
        dispatch('logicUnsetLevel', { sector, object, level });
      } else {
        dispatch('logicSetLevel', { sector, object, level });
      }
    },
    async toggleKickPlayer({ state, getters }, kickPlayerID) {
      const currentVote = getters.kickedPlayerState(kickPlayerID);
      const newVote = !currentVote;

      await axios.post(API_URL + "/castKickVote/?sessionID=" + state.sessionID + "&playerID=" + state.playerID, {
        kickPlayerID,
        vote: newVote
      });
    },
    async castKickPlayer({ state, getters }, { kickPlayerID, vote }) {
      await axios.post(API_URL + "/castKickVote/?sessionID=" + state.sessionID + "&playerID=" + state.playerID, {
        kickPlayerID,
        vote
      });
    },
    async initializeStorage({ state, commit }) {
      await state.storage.create();
    },
    async restoreRecentSessionsFromStorage({ state }) {
      const recentSessions = await state.storage.get("recentSessions");
      if (recentSessions !== null) {
        state.recentSessions = JSON.parse(recentSessions);
      }
    },
    async restoreSettingsFromStorage({ state }) {
      const settings = await state.storage.get("settings");
      if (settings !== null) {
        Object.assign(state.settings, JSON.parse(settings));
      }
    },
    async restoreFromStorage({ commit, dispatch }) {
      await dispatch("restoreSettingsFromStorage");
      await dispatch("restoreRecentSessionsFromStorage");
      commit("setStorageRead");
    },
    async restoreLogic({ state }) {
      const storedLogicStr: string = await state.storage.get("logic");

      let storedLogic: any = undefined;

      if (storedLogicStr !== null) {
        const allLogic = JSON.parse(storedLogicStr);
        const now = new Date();
        for (const sessionID in allLogic) {
          if (allLogic[sessionID].expires <= now) {
            delete allLogic[sessionID];
          }
        }
        if (Object.prototype.hasOwnProperty.call(allLogic, state.sessionID)) {
          storedLogic = allLogic[state.sessionID];
          const newExpirationDate = new Date();
          newExpirationDate.setDate(newExpirationDate.getDate() + 3);
          storedLogic.expires = newExpirationDate;
        }
        await state.storage.set("logic", JSON.stringify(allLogic));
      }

      if (storedLogic !== undefined) {
        delete storedLogic.expires;
        storedLogic.researchUsed = new Set(storedLogic.researchUsed);
        storedLogic.conferenceUsed = new Set(storedLogic.conferenceUsed);
        storedLogic.surveyUsed = new Set(storedLogic.surveyUsed);
        state.logic = storedLogic;
        return;
      }
    },
    async restoreStartingInfo({ state }) {
      const startingInfoStr: string = await state.storage.get("startingInformation");
      if (startingInfoStr !== null) {
        const startingInfo = JSON.parse(startingInfoStr);
        const now = new Date();
        for (const sessionID in startingInfo) {
          if (startingInfo[sessionID].expires <= now) {
            delete startingInfo[sessionID];
          }
        }
        if (Object.prototype.hasOwnProperty.call(startingInfo, state.sessionID)) {
          const info = startingInfo[state.sessionID];
          const newExpirationDate = new Date();
          newExpirationDate.setDate(newExpirationDate.getDate() + 3);
          info.expires = newExpirationDate;
          state.startingFacts = info.facts;
          state.seasonView = SeasonView[info.view];
        }
        await state.storage.set("startingInformation", JSON.stringify(startingInfo));
      }
    },
    setSeasonView({state, dispatch}, seasonView: string) {
      state.seasonView = seasonView;
      dispatch("storeStartingInfo");
    },
    setNumFacts({state, dispatch}, facts: number) {
      state.startingFacts = facts;
      dispatch("storeStartingInfo");
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
    setupLogic(state: any, sectors: number) {
      const logicBoard: {[sector: number]: any} = {};
      for (let i = 0; i < sectors; i++) {
        logicBoard[i] = {};
        for (const obj of Object.values(SpaceObject)) {
          logicBoard[i][obj.initial] = {
            state: "none",
            level: 0
          };
        }
      }
      state.logic.board = logicBoard;
      state.logic.researchUsed = new Set();
      state.logic.conferenceUsed = new Set();
      state.logic.surveyUsed = new Set();
      state.logic.undoQueue = [];
      state.logic.redoQueue = [];
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
      state.logic = {
        board: undefined,
        researchUsed: undefined,
        conferenceUsed: undefined,
        surveyUsed: undefined
      };
    },
    refillHistory(state: any) {
      const history = [];
      for (let i = 0; i < state.session.history.length; i++) {
        const action = state.session.history[i];
        if (action.playerID === state.playerID) {
          switch(action.turnType) {
            case("SURVEY"):
              history.push(actionResponses.survey(state.game, state.gameType, action.turn, new Date(action.time), initialToSpaceObject[action.spaceObject.initial], action.sectors[0], action.sectors[1]));
              break;
            case("TARGET"):
              history.push(actionResponses.target(state.game, action.turn, new Date(action.time), action.sector));
              break;
            case("RESEARCH"):
              history.push(actionResponses.research(state.game, action.turn, new Date(action.time), action.index));
              break;
            case("LOCATE_PLANET_X"):
              history.push(actionResponses.locatePlanetX(state.game, action.turn, new Date(action.time), action.sector, initialToSpaceObject[action.leftObject.initial], initialToSpaceObject[action.rightObject.initial]));
              break;
            case("THEORY"):
              history.push(actionResponses.theories(action.turn, new Date(action.time), action.theories));
              break;
            case("CONFERENCE"):
              history.push(actionResponses.conference(state.game, action.turn, new Date(action.time), action.index));
          }
        }
      }

      const theoryTurnSet: Set<number> = new Set(state.session.history.filter((action: any) => action.turnType === "THEORY").map((action: any) => action.turn));
      const theoryTurns: Array<number> = Array.from(theoryTurnSet).sort((a: any, b: any) => a - b);

      const theoryReveals: any = {};
      for (let i = 0; i < state.session.theories.length; i++) {
        const theory = state.session.theories[i];
        if (theory.revealed) {
          const createdTurn = theoryTurns.indexOf(theory.turn);
          const revealedTurnIndex = createdTurn + theory.progress - 1;
          let revealTurn;
          if (revealedTurnIndex < theoryTurns.length) {
            revealTurn = theoryTurns[revealedTurnIndex];
          } else {
            revealTurn = theoryTurns[theoryTurns.length-1] + revealedTurnIndex - (theoryTurns.length - 1);
          }
          const newTheory = Object.assign({}, theory, { spaceObject: initialToSpaceObject[theory.spaceObject.initial] });

          if (theoryReveals[revealTurn] !== undefined) {
            theoryReveals[revealTurn].push(newTheory);
          } else {
            theoryReveals[revealTurn] = [newTheory];
          }
        }
      }

      for (const revealTurn in theoryReveals) {
        const revealAction = actionResponses.theoryReveal(parseInt(revealTurn), null, theoryReveals[revealTurn]);
        history.push(revealAction);
      }

      history.sort(historySortOrder);

      state.history = history;
    },
    setMuteLevel(state: any, level: number) {
      state.settings.muteLevel = level;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setDarkMode(state: any, mode: boolean) {
      state.settings.darkMode = mode;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setRectangleEliminate(state: any, rectangleEliminate: boolean) {
      state.settings.rectangleEliminate = rectangleEliminate;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setScratchUncertain(state: any, scratchUncertain: boolean) {
      state.settings.scratchUncertain = scratchUncertain;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setLogicIconSize(state: any, iconSize: number) {
      state.settings.logicIconSize = iconSize;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setLevelColor(state: any, { color, level }) {
      state.settings.levelColors[level] = color;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setMultiInitial(state: any, multiInitial: boolean) {
      state.settings.multiInitial = multiInitial;
      state.storage.set("settings", JSON.stringify(state.settings));
    },
    setStorageRead(state: any) {
      state.storageRead = true;
    },
    getNewlyRevealedTheories(state: any, sessionState: any) {
      let newlyRevealed: Array<any> = [];
      let j = 0;

      const currentTheories = state.session.theories.slice().sort((a: any, b: any) => a.id - b.id);
      const newTheories = sessionState.theories.slice().sort((a: any, b: any) => a.id - b.id);

      for (let i = 0; i < currentTheories.length; i++) {
        const theory = currentTheories[i];

        while (newTheories[j].id != theory.id) {
          j++;
        }

        if (newTheories[j].revealed && !theory.revealed) {
          newlyRevealed.push({
            spaceObject: initialToSpaceObject[theory.spaceObject.initial],
            sector: theory.sector,
            accurate: theory.accurate
          });
        }
      }

      newlyRevealed.sort((a: any, b: any) => {
        if (a.sector != b.sector) {
          return a.sector - b.sector;
        } else if (a.accurate != b.accurate) {
          return b.accurate - a.accurate;
        } else {
          return a.spaceObject.initial.localeCompare(b.spaceObject.initial);
        }
      });

      newlyRevealed = newlyRevealed.filter((theory: any, i: number) => {
        if (i > 0) {
          if (theory.sector === newlyRevealed[i-1].sector) {
            if(theory.accurate || theory.spaceObject.initial === newlyRevealed[i-1].spaceObject.initial) {
              return false;
            }
          }
        }
        return true;
      });

      state.newlyRevealedTheories = newlyRevealed;

      if (newlyRevealed.length > 0) {
        const actionResult = actionResponses.theoryReveal(state.session.currentAction.turn, new Date(), newlyRevealed);
        actionResult.turn = state.session.currentAction.turn;

        state.history.push(actionResult);
      }
    },
    logicEliminate(state: any, { sector, object, level=0 }) {
      state.logic.board[sector][object] = {
        state: "eliminated",
        level
      }
    },
    logicSet(state: any, { sector, object, level=0 }) {
      state.logic.board[sector][object] = {
        state: "equal",
        level
      }
    },
    logicUnset(state: any, { sector, object }) {
      state.logic.board[sector][object] = {
        state: "none",
        level: 0
      }
    },
    logicResetAll(state: any) {
      state.logic.board = {};
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
      const actionHistory = state.history.filter((action: any) => {
        return action.actionType === "RESEARCH"
                || action.actionType === "SURVEY"
                || action.actionType === "TARGET"
                || action.actionType === "LOCATE_PLANET_X"
                || action.actionType === "CONFERENCE"
                || action.actionType === "PEER_REVIEW"
      });

      if (actionHistory.length) {
        return actionHistory[actionHistory.length - 1];
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

      if (state.awaitingTurnSubmission) {
        return false;
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
          const researchAllowed = getters.lastTurnResult?.actionType != "RESEARCH" && getters.researchLeft;
          const targetAllowed = state.history.filter((action: any) => action.actionType === "TARGET").length < state.gameType.numTargets;
          return actionName === "SURVEY"
                  || actionName === "TARGET" && targetAllowed
                  || actionName === "LOCATE_PLANET_X"
                  || (actionName === "RESEARCH" && researchAllowed);
          }
      }
    },
    researchedAlready: (state: any) => (index: number) => {
      return state.history.filter((action: any) => action.actionType === "RESEARCH" && action.index === index).length > 0;
    },
    researchLeft: (state: any, getters: any) => {
      return state.game.research.filter((rsrch: any, index: number) => !getters.researchedAlready(index)).length > 0;
    },
    skySize(state: any) {
      return Math.floor(state.gameType.sectors/2);
    },
    skyStart(state: any) {
      return state.session.currentSector;
    },
    skyEnd(state: any, getters: any) {
      return (state.session.currentSector + getters.skySize - 1) % state.gameType.sectors;
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
      const players = state.session.players.concat(state.session.kickedPlayers);
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
        return state.gameType.conferences.indexOf(state.session.currentSector);
      }
    },
    revealedTheories(state: any) {
      const revealed = [];
      for (let i = 0; i < state.session.theories.length; i++) {
        const theory = state.session.theories[i];
        if (theory.revealed) {
          revealed.push({
            spaceObject: initialToSpaceObject[theory.spaceObject.initial],
            sector: theory.sector,
            accurate: theory.accurate
          });
        }
      }
      revealed.sort((a: any, b: any) => {
        if (a.sector != b.sector) {
          return a.sector - b.sector;
        } else if (a.accurate != b.accurate) {
          return b.accurate - a.accurate;
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
          if (uniqueRevealed[l].accurate) {
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
      const players = state.session.players.concat(state.session.kickedPlayers);
      const playerMap: {[playerID: string]: any} = {};
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        playerMap[player.id] = player;
      }
      return playerMap;
    },
    fullHistory(state: any, getters: any) {
      const myHistory = state.history.slice();
      const allHistory = state.session.history
        .map((action: any) => Object.assign({}, action, {time: new Date(action.time)}))
        .sort(historySortOrder)
        .filter((action: any) => action.turnType !== "CONFERENCE");

      const history = [];

      const myPlayerNum = getters.playerInfo.num;
      const myPlayerName = getters.playerInfo.name;

      for (let i = 0; i < myHistory.length; i++) {
        if (myHistory[i].actionType === "THEORY_REVEAL" || myHistory[i].actionType === "WINNER" ||  myHistory[i].actionType === "CONFERENCE") {
          history.push(Object.assign({
            mine: true,
            historyIndex: i
          }, myHistory[i]));
        } else {
          history.push(Object.assign({
            mine: true,
            playerNum: myPlayerNum,
            playerName: myPlayerName,
            playerID: state.playerID,
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

          const action = Object.assign({}, allHistory[i], {
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

      history.sort(historySortOrder);

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

        const removeLimit = history.length - removeTheories;
        for (let i = history.length - 1; i >= removeLimit; i--) {
          if (history[i].playerNum !== myPlayerNum) {
            history.splice(i, 1);
          }
        }
      }

      return history;
    },
    visibleTheories(state: any, getters: any) {
      const isEndGame = state.session.currentAction.actionType === "END_GAME";
      const allTheories = state.session.theories.slice();
      const theories = [];
      for (let i = 0; i < allTheories.length; i++) {
        const theory = allTheories[i];
        if (theory.revealed) {
          if (theory.accurate) {
            theories.push(theory);
          }
        } else if (theory.progress < 3) {
          if (isEndGame) {
            if (theory.accurate) {
              theories.push(Object.assign({}, theory, { revealed: true}));
            }
          } else {
            theories.push(theory);
          }
        }
      }

      if (state.session.currentAction.actionType === "THEORY_PHASE" && getters.myNextAction !== null) {
        return theories.filter((theory: any) => theory.progress > 0);
      } else {
        return theories;
      }
    },
    resultsSummary(state: any, getters: any) {
      const targeted: any[] = [];
      const surveyed: any[] = [];
      const research: any[] = [];
      const allResearch: any[] = [];
      const conferences: any[] = [];
      const allConferences: any[] = [];
      const located: any[] = [];

      const summary = {
        revealed: getters.uniqueRevealedTheories,
        targeted: targeted,
        surveyed: surveyed,
        located: located,
        research: research,
        allResearch: allResearch,
        conferences: conferences,
        allConferences: allConferences
      }

      summary.targeted = state.history.filter((action: any) => action.actionType === "TARGET")
                          .map((action: any) => {
                            return {
                              sector: action.sector,
                              spaceObject: action.spaceObject
                            };
                          });

      summary.surveyed = state.history.filter((action: any) => action.actionType === "SURVEY")
                          .map((action: any) => {
                            return {
                              startSector: action.startSector,
                              endSector: action.endSector,
                              spaceObject: action.spaceObject,
                              numObject: action.numObject
                            };
                          });

      summary.research = state.history.filter((action: any) => action.actionType === "RESEARCH")
                          .map((action: any) => {
                            return {
                              index: action.index,
                              text: action.text,
                              shortText: state.settings.multiInitial ? action.multiInitialText : action.shortText,
                              researched: true
                            };
                          }).sort((a: any, b: any) => a.index - b.index);

      let j = 0;
      for (let i = 0; i < state.game.research.length; i++) {
        if (j < summary.research.length && summary.research[j].index === i) {
          summary.allResearch.push(summary.research[j]);
          j++;
        } else {
          summary.allResearch.push({
            index: i,
            text: "",
            shortText: state.settings.multiInitial ? state.game.research[i].multiInitialCategory : state.game.research[i].shortCategory,
            researched: false
          });
        }
      }

      summary.conferences = state.history.filter((action: any) => action.actionType === "CONFERENCE")
                            .map((action: any) => {
                              return {
                                index: action.index,
                                text: action.text,
                                shortText: state.settings.multiInitial ? action.multiInitialText : action.shortText,
                                researched: true
                              };
                            }).sort((a: any, b: any) => a.index - b.index);

      j = 0;
      for (let i = 0; i < state.game.conference.length; i++) {
        if (j < summary.conferences.length && summary.conferences[j].index === i) {
          summary.allConferences.push(summary.conferences[j]);
          j++;
        } else {
          summary.allConferences.push({
            index: i,
            text: "",
            shortText: state.settings.multiInitial ? state.game.conference[i].multiInitialCategory : state.game.conference[i].shortCategory,
            researched: false
          });
        }
      }

      summary.located = state.history.filter((action: any) => action.actionType === "LOCATE_PLANET_X")
                          .map((action: any) => {
                            return {
                              sector: action.sector,
                              leftObject: action.leftObject,
                              rightObject: action.rightObject,
                              successful: action.success
                            };
                          });

      return summary;
    },
    currentTurn(state: any) {
      if (state.isSession) {
        return state.session.currentAction.turn;
      } else {
        return state.history.length;
      }
    },
    kickedPlayerState: (state: any) => (kickPlayerID: number) => {
      const kickVote = state.session.kickVotes.find((kickVote: any) => kickVote.kickPlayerID === kickPlayerID && kickVote.votePlayerID === state.playerID);
      if (kickVote === undefined) {
        return false;
      } else {
        return kickVote.vote;
      }
    },
    isHost(state: any) {
      return state.isSession && state.session.currentAction.actionType === "START_GAME" && state.session.currentAction.playerID === state.playerID;
    },
    websocketDisconnected(state: any) {
      return state.isSession && state.currentWebSocket === undefined;
    },
    numTurns(state: any) {
      let turns = 0;
      for (let i = 0; i < state.history.length; i++) {
        if (["RESEARCH", "SURVEY", "TARGET", "LOCATE_PLANET_X"].indexOf(state.history[i].actionType) >= 0) {
          turns++;
        }
      }
      return turns;
    }
  }
});
