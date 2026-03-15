import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jab.app',
  appName: 'Jab',
  webDir: 'out',
  ios: {
    contentInset: 'always',
  }
};

export default config;
