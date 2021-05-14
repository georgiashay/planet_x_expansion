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
import GameView from '@/views/GameView.vue';
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
    path: '/session/join',
    name: 'Join Session',
    component: JoinSession
  },
  {
    path: '/session/lobby/:waiting',
    name: 'Lobby',
    component: Lobby,
    props: (route) => {
      if (route.params.waiting == "wait") {
        return {
          sessionCreator: true
        }
      } else if (route.params.waiting == "join") {
        return {
          sessionCreator: false
        }
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
    name: 'Find Planet X',
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
    name: 'Planet X Conference',
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

listenBackButton(router);

export default router
