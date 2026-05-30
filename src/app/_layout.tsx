import { DefaultTheme, ThemeProvider } from 'expo-router';

import AppTabs from '@/components/app-tabs';
import { GameProvider } from '@/components/GameContext';
import { Colors } from '@/constants/theme';

const appTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.background,
  },
};

export default function TabLayout() {
  return (
    <ThemeProvider value={appTheme}>
      <GameProvider>
        <AppTabs />
      </GameProvider>
    </ThemeProvider>
  );
}
