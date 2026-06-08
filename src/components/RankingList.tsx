import { Image, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { IllustrationImages } from '@/constants/images';
import { Colors, Spacing } from '@/constants/theme';
import type { RankingRow } from '@/types/game';
import {
  getIslandKing,
  getOverallTitle,
  getOverallTitleImage,
  getRankBadgeTone,
} from '@/utils/titles';

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
  const shouldShowRanking = !errorMessage && !emptyMessage;
  const islandKing = shouldShowRanking ? getIslandKing(rows) : null;

  return (
    <Card>
      {islandKing ? (
        <View style={styles.kingCard}>
          <View style={styles.kingText}>
            <ThemedText type="smallBold" style={styles.kingHeading}>
              {islandKing.heading}
            </ThemedText>
            <ThemedText type="subtitle" style={styles.kingName}>
              {islandKing.names}
            </ThemedText>
            <ThemedText type="smallBold" style={styles.kingTitle}>
              {islandKing.title}
            </ThemedText>
          </View>
          <Image
            source={IllustrationImages.islandKingEmblem}
            resizeMode="contain"
            style={styles.kingImage}
          />
        </View>
      ) : null}

      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.heading}>
          総合ランキング
        </ThemedText>
        <ThemedText type="small" style={styles.caption}>
          総合点、カタン合計点順
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
          <Image
            source={IllustrationImages.rankingSheep}
            resizeMode="contain"
            style={styles.emptyImage}
          />
          <View style={styles.emptyTextColumn}>
            <ThemedText type="smallBold" style={styles.noticeText}>
              {emptyMessage}
            </ThemedText>
            <ThemedText type="small" style={styles.caption}>
              この期間は羊たちがのんびりしています。
            </ThemedText>
          </View>
        </View>
      ) : (
        <View style={styles.rows}>
          {rows.map((row, index) => (
            <View key={row.playerId} style={styles.row}>
              <View style={[styles.rankBadge, rankBadgeStyles[getRankBadgeTone(row.displayRank)]]}>
                <ThemedText type="smallBold" style={styles.rankText}>
                  {row.displayRank > 0 ? row.displayRank : index + 1}位
                </ThemedText>
              </View>
              <View style={styles.playerColumn}>
                <ThemedText type="smallBold" numberOfLines={1} style={styles.playerName}>
                  {row.playerName}
                </ThemedText>
                <View style={styles.titleRow}>
                  <Image
                    source={getOverallTitleImage(row, rows)}
                    resizeMode="contain"
                    style={styles.titleImage}
                  />
                  <ThemedText type="smallBold" numberOfLines={1} style={styles.titleText}>
                    {getOverallTitle(row, rows)}
                  </ThemedText>
                </View>
                <View style={styles.scoreColumn}>
                  <ThemedText type="smallBold" style={styles.scoreText}>
                    総合点：{row.overallScore}点
                  </ThemedText>
                  <ThemedText type="small" style={styles.caption}>
                    カタン合計点：{row.totalPoints}点
                  </ThemedText>
                </View>
                <View style={styles.placeStats}>
                  <Stat label="1位" value={row.firstPlaces} />
                  <Stat label="2位" value={row.secondPlaces} />
                  <Stat label="3位" value={row.thirdPlaces} />
                </View>
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
      <ThemedText type="smallBold" numberOfLines={1} style={styles.statValue}>
        {value}
      </ThemedText>
      <ThemedText type="small" numberOfLines={1} style={styles.statLabel}>
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
  kingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.rankGold,
    backgroundColor: Colors.light.kingSurface,
    padding: Spacing.three,
  },
  kingText: {
    flex: 1,
    gap: Spacing.one,
  },
  kingImage: {
    width: 148,
    height: 148,
    flexShrink: 1,
  },
  kingHeading: {
    color: Colors.light.heading,
  },
  kingName: {
    color: Colors.light.heading,
  },
  kingTitle: {
    color: Colors.light.rankGold,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  noticeError: {
    backgroundColor: Colors.light.wheatSoft,
    borderColor: Colors.light.brick,
  },
  noticeText: {
    color: Colors.light.text,
  },
  emptyImage: {
    width: 40,
    height: 40,
  },
  emptyTextColumn: {
    flex: 1,
    gap: 2,
  },
  noticeErrorText: {
    color: Colors.light.brick,
  },
  row: {
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.one,
  },
  rankBadgegold: {
    backgroundColor: Colors.light.rankGoldSoft,
    borderWidth: 1.5,
    borderColor: Colors.light.rankGold,
  },
  rankBadgesilver: {
    backgroundColor: Colors.light.rankSilver,
    borderWidth: 1.5,
    borderColor: '#77736A',
  },
  rankBadgebronze: {
    backgroundColor: Colors.light.rankBronze,
    borderWidth: 1.5,
    borderColor: '#75401D',
  },
  rankBadgemuted: {
    backgroundColor: Colors.light.rankMuted,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  rankText: {
    color: Colors.light.text,
  },
  playerColumn: {
    flex: 1,
    minWidth: 72,
    gap: Spacing.one,
  },
  playerName: {
    color: Colors.light.heading,
    fontSize: 16,
  },
  titleText: {
    flex: 1,
    color: Colors.light.brick,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  titleImage: {
    width: 28,
    height: 28,
  },
  scoreColumn: {
    marginTop: Spacing.one,
    gap: 0,
  },
  scoreText: {
    color: Colors.light.text,
  },
  placeStats: {
    flexDirection: 'row',
    gap: Spacing.one,
    marginTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: Colors.light.wheatSoft,
    paddingTop: Spacing.two,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    minWidth: 0,
  },
  statValue: {
    color: Colors.light.heading,
  },
  statLabel: {
    color: Colors.light.mutedText,
  },
});

const rankBadgeStyles = {
  gold: styles.rankBadgegold,
  silver: styles.rankBadgesilver,
  bronze: styles.rankBadgebronze,
  muted: styles.rankBadgemuted,
};
