import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.studyone.app',
  appName: 'StudyOne',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'LIGHT',
      backgroundColor: '#F8FAFC'
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#4F46E5',
      sound: 'default'
    }
  }
};

export default config;
