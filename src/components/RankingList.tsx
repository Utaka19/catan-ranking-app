import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { RankingRow } from '@/types/game';

export function RankingList({
  rows,
  conditionLabel,
  emptyMessage,
  errorMessage,
}: {
  rows: readonly RankingRow[];
  conditionLabel: string;
  emptyMessage?: string | null;
  errorMessage?: string | null;
}) {
  return (
    <Card>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.heading}>
          総合ランキング
        </ThemedText>
        <ThemedText type="small" style={styles.caption}>
          1位回数、2位回数、3位回数の少なさ、合計ポイント順
        </ThemedText>
      </View>

      <View style={styles.condition}>
        <ThemedText type="smallBold" style={styles.conditionText}>
          集計条件: {conditionLabel}
        </ThemedText>
      </View>

      {errorMessage ? (
        <View style={[styles.notice, styles.noticeError]}>
          <ThemedText type="smallBold" style={styles.noticeErrorText}>
            {errorMessage}
          </ThemedText>
        </View>
      ) : emptyMessage ? (
        <View style={styles.notice}>
          <ThemedText type="smallBold" style={styles.noticeText}>
            {emptyMessage}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.rows}>
          {rows.map((row, index) => (
            <View key={row.playerId} style={styles.row}>
              <View style={styles.rankBadge}>
                <ThemedText type="smallBold" style={styles.rankText}>
                  {row.displayRank > 0 ? row.displayRank : index + 1}
                </ThemedText>
              </View>
              <View style={styles.playerColumn}>
                <ThemedText type="smallBold" style={styles.playerName}>
                  {row.playerName}
                </ThemedText>
                <ThemedText type="small" style={styles.caption}>
                  {row.totalPoints} pt
                </ThemedText>
              </View>
              <View style={styles.placeStats}>
                <Stat label="1位" value={row.firstPlaces} />
                <Stat label="2位" value={row.secondPlaces} />
                <Stat label="3位" value={row.thirdPlaces} />
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.stat}>
      <ThemedText type="smallBold">{value}</ThemedText>
      <ThemedText type="small" style={styles.caption}>
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.one,
  },
  heading: {
    color: Colors.light.heading,
  },
  caption: {
    color: Colors.light.mutedText,
  },
  rows: {
    gap: Spacing.two,
  },
  condition: {
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    borderWidth: 1.5,
    borderColor: Colors.light.wheat,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  conditionText: {
    color: Colors.light.text,
  },
  notice: {
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    padding: Spacing.three,
  },
  noticeError: {
    backgroundColor: Colors.light.wheatSoft,
    borderColor: Colors.light.brick,
  },
  noticeText: {
    color: Colors.light.text,
  },
  noticeErrorText: {
    color: Colors.light.brick,
  },
  row: {
    minHeight: 72,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    padding: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.wheat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: Colors.light.text,
  },
  playerColumn: {
    flex: 1,
    minWidth: 72,
  },
  playerName: {
    color: Colors.light.heading,
    fontSize: 16,
  },
  placeStats: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  stat: {
    width: 42,
    alignItems: 'center',
  },
});
