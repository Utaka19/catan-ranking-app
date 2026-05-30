import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';

import { GameResultForm } from '@/components/GameForm';
import { useGames } from '@/components/GameContext';
import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { IllustrationImages } from '@/constants/images';
import { Colors, Spacing } from '@/constants/theme';
import type { Game, GameInput, Player, PlayerId } from '@/types/game';
import { confirmAction } from '@/utils/confirm';
import {
  normalizeGameRanks,
  sortGamesByNewest,
  sortParticipantsForDisplay,
} from '@/utils/ranking';
import { getMatchTitle, getRankBadgeTone } from '@/utils/titles';

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
  const { updateGame, deleteGame } = useGames();
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const sortedGames = sortGamesByNewest(games);

  const handleDelete = async (game: Game) => {
    const confirmed = await confirmAction(
      'この試合結果を削除しますか？',
      'この操作は元に戻せません。',
    );

    if (!confirmed) {
      return;
    }

    await deleteGame(game.id);
    if (editingGameId === game.id) {
      setEditingGameId(null);
    }
  };

  const handleUpdate = async (game: Game, input: GameInput) => {
    const result = await updateGame({
      ...game,
      date: input.date,
      participants: input.participants,
    });

    if (result.ok) {
      setEditingGameId(null);
    }

    return result;
  };

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
          <Image
            source={IllustrationImages.rankingSheep}
            resizeMode="contain"
            style={styles.emptyImage}
          />
          <View style={styles.emptyTextColumn}>
            <ThemedText type="smallBold" style={styles.emptyTitle}>
              まだ試合履歴がありません。
            </ThemedText>
            <ThemedText type="small" style={styles.caption}>
              最初の開拓記録を残しましょう。
            </ThemedText>
          </View>
        </View>
      ) : (
        <View style={styles.games}>
          {sortedGames.map((game) => {
            const participants = sortParticipantsForDisplay(normalizeGameRanks(game).participants);

            return (
              <View key={game.id} style={styles.gameCard}>
                {editingGameId === game.id ? (
                  <GameResultForm
                    key={game.id}
                    title="試合結果を編集"
                    description="保存するとランキングにも反映されます"
                    submitLabel="保存する"
                    successMessage="更新しました。"
                    initialGame={game}
                    onSubmit={(input) => handleUpdate(game, input)}
                    onCancel={() => setEditingGameId(null)}
                  />
                ) : (
                  <>
                    <View style={styles.cardHeader}>
                      <View style={styles.dateBadge}>
                        <ThemedText type="smallBold" style={styles.dateText}>
                          {game.date}
                        </ThemedText>
                      </View>
                      <View style={styles.actions}>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => setEditingGameId(game.id)}
                          style={styles.editButton}>
                          <ThemedText type="smallBold" style={styles.editText}>
                            編集
                          </ThemedText>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => void handleDelete(game)}
                          style={styles.deleteButton}>
                          <ThemedText type="smallBold" style={styles.deleteText}>
                            削除
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                    <View style={styles.participants}>
                      {participants.map((participant) => (
                        <View key={participant.playerId} style={styles.participantRow}>
                          <View
                            style={[
                              styles.rankBadge,
                              rankBadgeStyles[getRankBadgeTone(participant.rank)],
                            ]}>
                            <ThemedText type="smallBold" style={styles.rankLabel}>
                              {participant.rank}位
                            </ThemedText>
                          </View>
                          <View style={styles.participantInfo}>
                            <View style={styles.participantMain}>
                              <ThemedText type="small" style={styles.playerName}>
                                {getPlayerName(players, participant.playerId)}
                              </ThemedText>
                              <ThemedText type="smallBold" style={styles.pointText}>
                                {participant.points} pt
                              </ThemedText>
                            </View>
                            <ThemedText type="smallBold" style={styles.matchTitle}>
                              {getMatchTitle(participant, participants)}
                            </ThemedText>
                          </View>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            );
          })}
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyImage: {
    width: 44,
    height: 44,
  },
  emptyTextColumn: {
    flex: 1,
    gap: 2,
  },
  emptyTitle: {
    color: Colors.light.heading,
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  editButton: {
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.deepGreen,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    color: Colors.light.deepGreen,
  },
  deleteButton: {
    minHeight: 36,
    borderRadius: 8,
    backgroundColor: Colors.light.brick,
    paddingHorizontal: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#FFFFFF',
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
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  rankBadge: {
    width: 46,
    minHeight: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  rankLabel: {
    color: Colors.light.text,
  },
  participantInfo: {
    flex: 1,
    gap: 2,
  },
  participantMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  playerName: {
    flex: 1,
    color: Colors.light.heading,
    fontSize: 15,
  },
  pointText: {
    color: Colors.light.text,
  },
  matchTitle: {
    color: Colors.light.brick,
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
});

const rankBadgeStyles = {
  gold: styles.rankBadgegold,
  silver: styles.rankBadgesilver,
  bronze: styles.rankBadgebronze,
  muted: styles.rankBadgemuted,
};
