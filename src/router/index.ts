import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import CreateMultiplayer from '@/views/CreateMultiplayer.vue';
import GameCode from '@/views/GameCode.vue';
import ChooseView from '@/views/ChooseView.vue';

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
    path: '/multiplayer/gamecode',
    name: 'Game Code',
    component: GameCode
  },
  {
    path: '/multiplayer/chooseview',
    name: 'Choose View',
    component: ChooseView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
