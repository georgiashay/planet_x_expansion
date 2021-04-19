import { NativeAudio } from '@ionic-native/native-audio/';

// Preload sounds
const startupPromise = NativeAudio.preloadSimple("startup", "assets/sounds/startup.mp3");
const correctPromise = NativeAudio.preloadSimple("correct", "assets/sounds/correct.mp3");
const incorrectPromise = NativeAudio.preloadSimple("incorrect", "assets/sounds/wrong.mp3");
const sonar1Promise = NativeAudio.preloadSimple("sonar1", "assets/sounds/sonar1.mp3");
const sonar2Promise = NativeAudio.preloadSimple("sonar2", "assets/sounds/sonar2.mp3");

// Play sounds on request
export default {
  methods: {
    playStartup: async function() {
      await startupPromise;
      await NativeAudio.play("startup");
    },
    playCorrect: async function() {
      await correctPromise;
      await NativeAudio.play("correct");
    },
    playIncorrect: async function() {
      await incorrectPromise;
      await NativeAudio.play("incorrect");
    },
    playSonar1: async function() {
      await sonar1Promise;
      await NativeAudio.play("sonar1");
    },
    playSonar2: async function() {
      await sonar2Promise;
      await NativeAudio.play("sonar2");
    }
  }
}
