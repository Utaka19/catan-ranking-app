import type { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ScreenShellProps = {
  children: ReactNode;
  contentStyle?: ViewStyle;
};

export function ScreenShell({ children, contentStyle }: ScreenShellProps) {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.scrollContent}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </SafeAreaView>
    </ScrollView>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: Colors.light.background,
  },
  safeArea: {
    flexGrow: 1,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    padding: Spacing.three,
    paddingTop: Platform.select({ web: 92, default: Spacing.four }),
    paddingBottom: 110,
  },
  card: {
    gap: Spacing.three,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    padding: Spacing.three,
  },
});
