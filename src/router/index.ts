import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import CreateMultiplayer from '@/views/CreateMultiplayer.vue';
import GameCode from '@/views/GameCode.vue';
import ChooseView from '@/views/ChooseView.vue';
import JoinMultiplayer from '@/views/JoinMultiplayer.vue';
import ChooseDifficulty from '@/views/ChooseDifficulty.vue';
import StartingInformation from '@/views/StartingInformation.vue';
import ResearchCategories from '@/views/ResearchCategories.vue';
import GameMenu from '@/views/GameMenu.vue';
import SurveyReminder from '@/views/SurveyReminder.vue';
import Survey from '@/views/Survey.vue';

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
    path: '/multiplayer/create',
    name: 'Create Multiplayer',
    component: CreateMultiplayer
  },
  {
    path: '/multiplayer/join',
    name: 'Join Multiplayer',
    component: JoinMultiplayer
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
    path: '/multiplayer/chooseview',
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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
