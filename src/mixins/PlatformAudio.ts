import { NativeAudio } from '@ionic-native/native-audio/';
import { isPlatform } from '@ionic/vue';

export class PlatformAudio {
  platform: string;
  sounds: {[soundID: string]: any} = {};
  muted = false;

  constructor() {
    if (isPlatform("cordova")) {
      this.platform = "mobile";
    } else {
      this.platform = "web";
    }
  }

  async preload(soundID: string, filename: string) {
    if (this.platform == "mobile") {
      await NativeAudio.preloadSimple(soundID, filename);
      this.sounds[soundID] = filename;
    } else {
      this.sounds[soundID] = filename;
    }
  }

  async play(soundID: string) {
    if (!this.muted) {
      if (this.platform == "mobile") {
        await NativeAudio.play(soundID);
      } else {
        await new Audio(this.sounds[soundID]).play();
      }
    }
  }

  mute() {
    this.muted = true;
  }

  unmute() {
    this.muted = false;
  }
}
