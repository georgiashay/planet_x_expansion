import { useBackButton } from '@ionic/vue';
import { Router } from 'vue-router';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

const history: string[] = [];

const backDisabled: string[] = ["/multiplayer/endgame"];
const detours: string[] = ["/multiplayer/action"];
const home = "/home";

// Check if route is on a "detour" of pages from main flow
function isDetour(path: string) {
  for (let i = 0; i < detours.length; i++) {
    if (path.startsWith(detours[i])) {
      return true;
    }
  }
  return false;
}

// Get index in history to go to on pressing back button
function getBackIndex() {
  if (isDetour(history[history.length - 1])) {
    // Currently on a detour, go back as usual
    return history.length - 2;
  } else {
    // Find most recent path that is not a detour or the current path
    const lastPath = history[history.length - 1];
    let i = history.length - 2;
    while (i >= 0 && (isDetour(history[i]) || history[i] === lastPath)) {
      i--;
    }
    return i;
  }
}

// Record history and select page when pressing back button
function listenBackButton(router: Router) {
  router.beforeEach((to, from, next) => {
    if (to.path !== home) {
      // Record history
      history.push(to.path);
    } else {
      // Clear history when going home
      history.splice(0);
    }
    next();
  });
  useBackButton(10, () => {
    if (router.currentRoute.value.path === home) {
      // Exit the app if pressing back button on home page
      App.exitApp();
    } else if(backDisabled.indexOf(router.currentRoute.value.path) == -1) {
      // If back button should not be disabled, go back to calculated
      // page and truncate stored history
      const i = getBackIndex();
      router.push(history[i]);
      history.splice(i);
    }
  });
}

export default listenBackButton;
