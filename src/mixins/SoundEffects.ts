import { PlatformAudio } from '@/mixins/PlatformAudio';

const platformAudio = new PlatformAudio();

const sounds: Array<any> = [
  {
    name: "startup",
    file: "assets/sounds/startup.mp3",
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
    name: "sonar1",
    file: "assets/sounds/sonar1.mp3",
    muteLevel: 2
  },
  {
    name: "sonar2",
    file: "assets/sounds/sonar2.mp3",
    muteLevel: 2
  },
  {
    name: "doorbell",
    file: "assets/sounds/doorbell.mp3",
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
