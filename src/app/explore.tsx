import { Image, StyleSheet, View } from 'react-native';

import { GameHistoryList } from '@/components/GameHistoryList';
import { useGames } from '@/components/GameContext';
import { ScreenShell } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { IllustrationImages } from '@/constants/images';
import { Colors, Spacing } from '@/constants/theme';

export default function TabTwoScreen() {
  const { games, players, isLoading, errorMessage } = useGames();

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <ThemedText type="subtitle" style={styles.title}>
            航海の記録
          </ThemedText>
          <ThemedText type="small" style={styles.lead}>
            これまでの試合結果を新しい順に確認。
          </ThemedText>
        </View>
        <Image
          source={IllustrationImages.headerMap}
          resizeMode="contain"
          style={styles.heroImage}
        />
      </View>

      {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}
      {isLoading ? (
        <ThemedText type="small">記録を読み込んでいます。</ThemedText>
      ) : (
        <GameHistoryList games={games} players={players} />
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: Spacing.five,
    backgroundColor: Colors.light.brick,
    padding: Spacing.four,
  },
  heroText: {
    flex: 1,
    gap: Spacing.two,
  },
  heroImage: {
    width: 136,
    height: 136,
    flexShrink: 1,
    opacity: 0.88,
  },
  title: {
    color: '#FFFFFF',
  },
  lead: {
    color: '#F9E6B6',
  },
  errorText: {
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    color: Colors.light.text,
    padding: Spacing.two,
  },
});
