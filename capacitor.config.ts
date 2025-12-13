import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.3c946242ccab41c9982273bd68704745',
  appName: 'Mamãe Zen',
  webDir: 'dist',
  server: {
    url: 'https://3c946242-ccab-41c9-9822-73bd68704745.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e1b4b',
      showSpinner: false
    },
    BackgroundRunner: {
      label: 'app.mamae.zen.background',
      src: 'background.js',
      event: 'checkAudio',
      repeat: true,
      interval: 1,
      autoStart: true
    }
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#1e1b4b'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#1e1b4b'
  }
};

export default config;
