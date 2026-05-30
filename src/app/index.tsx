import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { GameForm } from '@/components/GameForm';
import { useGames } from '@/components/GameContext';
import { PeriodSelector } from '@/components/PeriodSelector';
import { PlayerNameEditor } from '@/components/PlayerNameEditor';
import { RankingList } from '@/components/RankingList';
import { ScreenShell } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { PeriodSelection } from '@/types/game';
import { getPeriodConditionLabel, getPeriodSelectionError } from '@/utils/date';
import { buildRanking, filterGamesByPeriod } from '@/utils/ranking';

export default function HomeScreen() {
  const { games, players, isLoading, errorMessage } = useGames();
  const [periodSelection, setPeriodSelection] = useState<PeriodSelection>({
    preset: 'all',
    startDate: '',
    endDate: '',
  });
  const periodError = getPeriodSelectionError(periodSelection);
  const periodLabel = getPeriodConditionLabel(periodSelection);

  const filteredGames = useMemo(() => {
    if (periodError) {
      return [];
    }

    return filterGamesByPeriod(games, periodSelection);
  }, [games, periodError, periodSelection]);

  const rankingRows = useMemo(
    () => (periodError ? [] : buildRanking(filteredGames, players)),
    [filteredGames, periodError, players],
  );

  const rankingEmptyMessage =
    !periodError && filteredGames.length === 0 ? '対象期間の試合はありません。' : null;

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <ThemedText type="subtitle" style={styles.appName}>
          島の記録帳
        </ThemedText>
        <ThemedText type="small" style={styles.lead}>
          兄弟3人の開拓戦績を、試合後すぐに残すための小さな記録帳。
        </ThemedText>
      </View>

      {errorMessage && <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>}
      {isLoading ? (
        <ThemedText type="small">記録を読み込んでいます。</ThemedText>
      ) : (
        <>
          <PeriodSelector selection={periodSelection} onChange={setPeriodSelection} />
          <RankingList
            rows={rankingRows}
            conditionLabel={periodLabel}
            emptyMessage={rankingEmptyMessage}
            errorMessage={periodError}
          />
          <GameForm />
          <PlayerNameEditor />
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: Spacing.two,
    borderRadius: 8,
    backgroundColor: Colors.light.deepGreen,
    padding: Spacing.four,
  },
  appName: {
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
