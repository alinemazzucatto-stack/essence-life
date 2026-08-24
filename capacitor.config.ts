import type { CapacitorConfig } from '@capacitor/cli';
import { KeyboardResize } from '@capacitor/keyboard';

const config: CapacitorConfig = {
  appId: 'com.essencelife.app',
  appName: 'Essence Life',
  webDir: 'dist',
  backgroundColor: '#f5f1f5',
  plugins: {
    Keyboard: {
      resize: KeyboardResize.Native,
      resizeOnFullScreen: true
    }
  }
};

export default config;