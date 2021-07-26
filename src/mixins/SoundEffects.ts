import { PlatformAudio } from '@/mixins/PlatformAudio';
import { THEME } from "@/constants.ts";

const platformAudio = new PlatformAudio();

const sounds: Array<any> = [
  {
    name: "startup",
    file: {
      "space": "assets/sounds/startup.mp3",
      "ocean": "assets/sounds/bubbles_water.mp3",
      "castle": "assets/sounds/fanfare.mp3"
    }[THEME],
    muteLevel: 1
  },
  {
    name: "correct",
    file: "assets/sounds/correct.mp3",
    muteLevel: 1
  },
  {
    name: "incorrect",
    file: "assets/sounds/wrong.mp3",
    muteLevel: 1
  },
  {
    name: "page_transition",
    file: {
      "space": "assets/sounds/sonar1.mp3",
      "ocean": "assets/sounds/bubble_splash.mp3",
      "castle": "assets/sounds/church_bell_high.mp3"
    }[THEME],
    muteLevel: 2
  },
  {
    name: "result",
    file: {
      "space": "assets/sounds/sonar2.mp3",
      "ocean": "assets/sounds/bubble_pops.mp3",
      "castle": "assets/sounds/church_bell_low.mp3"
    }[THEME],
    muteLevel: 2
  },
  {
    name: "doorbell",
    file: {
      "space": "assets/sounds/doorbell.mp3",
      "ocean": "assets/sounds/doorbell.mp3",
      "castle": "assets/sounds/knock_knock.mp3"
    }[THEME],
    muteLevel: 1
  }
];

const soundMap: {[name: string]: any} = {};
for (let i = 0; i < sounds.length; i++) {
  soundMap[sounds[i].name] = sounds[i];
}

// Preload sounds
const soundPromises: {[name: string]: Promise<void>} = {};
for (let i = 0; i < sounds.length; i++) {
  soundPromises[sounds[i].name] = platformAudio.preload(sounds[i].name, sounds[i].file);
}

// Play sounds on request
export default {
  playSound: async function(name: string, muteLevel: number) {
    if (muteLevel >= soundMap[name].muteLevel) {
      await soundPromises[name];
      await platformAudio.play(name);
    }
  }
}
