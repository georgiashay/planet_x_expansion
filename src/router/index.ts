import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import listenBackButton from './backButton';
import Home from '../views/Home.vue';
import CreateGame from '@/views/CreateGame.vue';
import GameCode from '@/views/GameCode.vue';
import ChooseView from '@/views/ChooseView.vue';
import JoinGame from '@/views/JoinGame.vue';
import ChooseDifficulty from '@/views/ChooseDifficulty.vue';
import StartingInformation from '@/views/StartingInformation.vue';
import ResearchCategories from '@/views/ResearchCategories.vue';
import GameMenu from '@/views/GameMenu.vue';
import SurveyReminder from '@/views/SurveyReminder.vue';
import Survey from '@/views/Survey.vue';
import ActionResult from '@/views/ActionResult.vue';
import TargetReminder from '@/views/TargetReminder.vue';
import Target from '@/views/Target.vue';
import Research from '@/views/Research.vue';
import ResearchReminder from '@/views/ResearchReminder.vue';
import FindPlanetX from '@/views/FindPlanetX.vue';
import PeerReview from '@/views/PeerReview.vue';
import PlanetXConference from '@/views/PlanetXConference.vue';
import History from '@/views/History.vue';
import EndGame from '@/views/EndGame.vue';
import Lobby from '@/views/Lobby.vue';
import JoinSession from '@/views/JoinSession.vue';
import SubmitTheories from '@/views/SubmitTheories.vue';
import BoardPage from "@/views/BoardPage.vue";
import LogicPage from "@/views/LogicPage.vue";
import ReconnectSession from "@/views/ReconnectSession.vue";
import MediaCredits from "@/views/MediaCredits.vue";
import store from "../store";
import { IS_PROD, GOAL_OBJECT, CONFERENCE_NAME } from "../constants";

const getRecentSessions = async function(): Promise<Array<any>> {
  await store.dispatch("initializeStorage");
  await store.dispatch("restoreFromStorage");
  return new Promise((resolve) => {
    store.subscribe((mutation, state) => {
      if (mutation.type === "setStorageRead") {
        resolve(state.recentSessions);
      }
    });
    if (store.state.storageRead) {
      resolve(store.state.recentSessions);
    }
  })
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/:gameType/create',
    name: 'Create Multiplayer',
    component: CreateGame,
    props: (route) => {
      if (route.params.gameType == "multiplayer") {
        return {
          isSession: false
        }
      } else if (route.params.gameType == "session") {
        return {
          isSession: true
        }
      }
    }
  },
  {
    path: '/multiplayer/join',
    name: 'Join Multiplayer',
    component: JoinGame
  },
  {
    path: '/session/join/:sessionCode?',
    name: 'Join Session',
    component: JoinSession,
    beforeEnter: async (to, from, next) => {
      if (to.params.sessionCode && IS_PROD) {
        const recentSessions = await getRecentSessions();
        const thisSession = recentSessions.find((session) => session.sessionCode === to.params.sessionCode);

        if (thisSession === undefined) {
          next();
        } else {
          store.dispatch('reconnectSession', thisSession);
          next("/session/lobby")
        }
      } else {
        next();
      }
    }
  },
  {
    path: '/session/lobby/:sessionCode?',
    name: 'Lobby',
    component: Lobby,
    beforeEnter: async (to, from, next) => {
      if (to.params.sessionCode) {
        if (store.state.sessionCode !== undefined) {
          if(store.state.sessionCode !== to.params.sessionCode) {
            next("/session/lobby/" + store.state.sessionCode);
          } else {
            next();
          }
        } else {
          const recentSessions = await getRecentSessions();
          const thisSession = recentSessions.find((session) => session.sessionCode === to.params.sessionCode);
          if (thisSession === undefined) {
            next("/session/join/" + to.params.sessionCode);
          } else {
            await store.dispatch('reconnectSession', thisSession);
            next("/session/lobby/" + to.params.sessionCode);
          }
        }
      } else {
        next();
      }
    }
  },
  {
    path: '/:gameType/gamecode/:isnew',
    name: 'Game Code',
    component: GameCode,
    props: (route) => {
      if (route.params.isnew == "new") {
        return {
          gameCreator: true,
          gameType: route.params.gameType
        }
      } else if (route.params.isnew == "join"){
        return {
          gameCreator: false,
          gameType: route.params.gameType
        }
      }
    }
  },
  {
    path: '/:gameType/chooseview',
    name: 'Choose View',
    component: ChooseView,
    props: true
  },
  {
    path: '/:gameType/choosedifficulty',
    name: 'Choose Difficulty',
    component: ChooseDifficulty,
    props: true
  },
  {
    path: '/:gameType/startinginfo',
    name: 'Starting Information',
    component: StartingInformation,
    props: true
  },
  {
    path: '/:gameType/researchcategories',
    name: 'Research Categories',
    component: ResearchCategories,
    props: true
  },
  {
    path: '/:gameType/gamemenu',
    name: 'Game Menu',
    component: GameMenu,
    props: true
  },
  {
    path: '/:gameType/action/survey/reminder',
    name: 'Survey Reminder',
    component: SurveyReminder,
    props: true
  },
  {
    path: '/:gameType/action/survey',
    name: 'Survey',
    component: Survey,
    props: true
  },
  {
    path: '/:gameType/action/:actionType?/result/:historyIndex?',
    name: 'Action Result',
    component: ActionResult,
    props: true
  },
  {
    path: '/:gameType/action/target/reminder',
    name: 'Target Reminder',
    component: TargetReminder,
    props: true
  },
  {
    path: '/:gameType/action/target',
    name: 'Target',
    component: Target,
    props: true
  },
  {
    path: '/:gameType/action/research',
    name: 'Research',
    component: Research,
    props: true
  },
  {
    path: '/:gameType/action/research/reminder',
    name: 'Research Reminder',
    component: ResearchReminder,
    props: true
  },
  {
    path: '/:gameType/action/locateplanetx',
    name: 'Find ' + GOAL_OBJECT.the,
    component: FindPlanetX,
    props: true
  },
  {
    path: '/:gameType/action/peerreview',
    name: 'Peer Review',
    component: PeerReview,
    props: true
  },
  {
    path: '/:gameType/action/planetxconference',
    name: GOAL_OBJECT.the + ' ' + CONFERENCE_NAME.proper,
    component: PlanetXConference,
    props: true
  },
  {
    path: '/:gameType/action/submittheories',
    name: 'Submit Theories',
    component: SubmitTheories,
    props: true
  },
  {
    path: '/session/board',
    name: 'Current Board',
    component: BoardPage
  },
  {
    path: '/session/logic',
    name: 'Logic Sheet',
    component: LogicPage
  },
  {
    path: '/:gameType/history',
    name: 'History',
    component: History,
    props: true
  },
  {
    path: '/:gameType/endgame',
    name: 'End Game',
    component: EndGame,
    props: true
  },
  {
    path: '/session/reconnect',
    name: 'Reconnect Session',
    component: ReconnectSession
  },
  {
    path: '/credits',
    name: 'Media Credits',
    component: MediaCredits
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

listenBackButton(router);

export default router
