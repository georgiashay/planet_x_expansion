import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import CreateMultiplayer from '@/views/CreateMultiplayer.vue';
import GameCode from '@/views/GameCode.vue';
import ChooseView from '@/views/ChooseView.vue';
import JoinMultiplayer from '@/views/JoinMultiplayer.vue';
import ChooseDifficulty from '@/views/ChooseDifficulty.vue';

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
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
