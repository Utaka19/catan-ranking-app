import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Game, Player, PlayerId } from '@/types/game';
import { sortGamesByNewest } from '@/utils/ranking';

function getPlayerName(players: readonly Player[], playerId: PlayerId) {
  return players.find((player) => player.id === playerId)?.name ?? playerId;
}

export function GameHistoryList({
  games,
  players,
}: {
  games: readonly Game[];
  players: readonly Player[];
}) {
  const sortedGames = sortGamesByNewest(games);

  return (
    <Card>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.heading}>
          試合履歴
        </ThemedText>
        <ThemedText type="small" style={styles.caption}>
          新しい順に表示
        </ThemedText>
      </View>

      {sortedGames.length === 0 ? (
        <View style={styles.empty}>
          <ThemedText type="small">まだ記録がありません。</ThemedText>
        </View>
      ) : (
        <View style={styles.games}>
          {sortedGames.map((game) => (
            <View key={game.id} style={styles.gameCard}>
              <View style={styles.dateBadge}>
                <ThemedText type="smallBold" style={styles.dateText}>
                  {game.date}
                </ThemedText>
              </View>
              <View style={styles.participants}>
                {game.participants.map((participant) => (
                  <View key={participant.rank} style={styles.participantRow}>
                    <View style={styles.rankBadge}>
                      <ThemedText type="smallBold" style={styles.rankLabel}>
                        {participant.rank}位
                      </ThemedText>
                    </View>
                    <ThemedText type="small" style={styles.playerName}>
                      {getPlayerName(players, participant.playerId)}
                    </ThemedText>
                    <ThemedText type="smallBold">{participant.points} pt</ThemedText>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </Card>
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
  empty: {
    borderRadius: 8,
    backgroundColor: Colors.light.parchment,
    padding: Spacing.three,
  },
  games: {
    gap: Spacing.three,
  },
  gameCard: {
    gap: Spacing.three,
    borderRadius: 8,
    backgroundColor: Colors.light.parchment,
    padding: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dateBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  dateText: {
    color: Colors.light.text,
  },
  participants: {
    gap: Spacing.one,
  },
  participantRow: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rankBadge: {
    width: 46,
    minHeight: 32,
    borderRadius: 8,
    backgroundColor: Colors.light.brick,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankLabel: {
    color: '#FFFFFF',
  },
  playerName: {
    flex: 1,
    color: Colors.light.heading,
    fontSize: 15,
  },
});
