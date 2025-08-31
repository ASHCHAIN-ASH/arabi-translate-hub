import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ac43130c4bba404aade5b9d62d1f8904',
  appName: 'arabi-translate-hub',
  webDir: 'dist',
  server: {
    url: 'https://ac43130c-4bba-404a-ade5-b9d62d1f8904.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#4F46E5",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      spinnerColor: "#ffffff"
    }
  }
};

export default config;