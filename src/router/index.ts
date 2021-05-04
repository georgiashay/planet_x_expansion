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
    path: '/multiplayer/gamecode/:isnew',
    name: 'Game Code',
    component: GameCode,
    props: (route) => {
      if (route.params.isnew == "new") {
        return {
          gameCreator: true
        }
      } else if (route.params.isnew == "join"){
        return {
          gameCreator: false
        }
      }
    }
  },
  {
    path: '/:gameType/chooseview',
    name: 'Choose View',
    component: ChooseView
  },
  {
    path: '/multiplayer/choosedifficulty',
    name: 'Choose Difficulty',
    component: ChooseDifficulty
  },
  {
    path: '/multiplayer/startinginfo',
    name: 'Starting Information',
    component: StartingInformation
  },
  {
    path: '/multiplayer/researchcategories',
    name: 'Research Categories',
    component: ResearchCategories
  },
  {
    path: '/multiplayer/gamemenu',
    name: 'Game Menu',
    component: GameMenu
  },
  {
    path: '/multiplayer/action/survey/reminder',
    name: 'Survey Reminder',
    component: SurveyReminder
  },
  {
    path: '/multiplayer/action/survey',
    name: 'Survey',
    component: Survey
  },
  {
    path: '/multiplayer/action/:actionType?/result/:historyIndex?',
    name: 'Action Result',
    component: ActionResult
  },
  {
    path: '/multiplayer/action/target/reminder',
    name: 'Target Reminder',
    component: TargetReminder
  },
  {
    path: '/multiplayer/action/target',
    name: 'Target',
    component: Target
  },
  {
    path: '/multiplayer/action/research',
    name: 'Research',
    component: Research
  },
  {
    path: '/multiplayer/action/research/reminder',
    name: 'Research Reminder',
    component: ResearchReminder
  },
  {
    path: '/multiplayer/action/locateplanetx',
    name: 'Find Planet X',
    component: FindPlanetX
  },
  {
    path: '/multiplayer/action/peerreview',
    name: 'Peer Review',
    component: PeerReview
  },
  {
    path: '/multiplayer/action/planetxconference',
    name: 'Planet X Conference',
    component: PlanetXConference
  },
  {
    path: '/multiplayer/history',
    name: 'History',
    component: History
  },
  {
    path: '/multiplayer/endgame',
    name: 'End Game',
    component: EndGame
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

listenBackButton(router);

export default router
