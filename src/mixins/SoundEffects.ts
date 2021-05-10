import { PlatformAudio } from '@/mixins/PlatformAudio';

const platformAudio = new PlatformAudio();

// Preload sounds
const startupPromise = platformAudio.preload("startup", "assets/sounds/startup.mp3");
const correctPromise = platformAudio.preload("correct", "assets/sounds/correct.mp3");
const incorrectPromise = platformAudio.preload("incorrect", "assets/sounds/wrong.mp3");
const sonar1Promise = platformAudio.preload("sonar1", "assets/sounds/sonar1.mp3");
const sonar2Promise = platformAudio.preload("sonar2", "assets/sounds/sonar2.mp3");
const doorbellPromise = platformAudio.preload("doorbell", "assets/sounds/doorbell.mp3");

// Play sounds on request
export default {
  playStartup: async function() {
    await startupPromise;
    await platformAudio.play("startup");
  },
  playCorrect: async function() {
    await correctPromise;
    await platformAudio.play("correct");
  },
  playIncorrect: async function() {
    await incorrectPromise;
    await platformAudio.play("incorrect");
  },
  playSonar1: async function() {
    await sonar1Promise;
    await platformAudio.play("sonar1");
  },
  playSonar2: async function() {
    await sonar2Promise;
    await platformAudio.play("sonar2");
  },
  playDoorbell: async function() {
    await doorbellPromise;
    await platformAudio.play("doorbell");
  }
}
