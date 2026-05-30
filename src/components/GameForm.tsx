import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { DateField } from '@/components/DateField';
import { useGames } from '@/components/GameContext';
import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Game, GameInput, GameParticipant, PlayerId, Rank } from '@/types/game';
import { getTodayString } from '@/utils/date';

type FormParticipant = {
  playerId: PlayerId | null;
  points: string;
};

const EMPTY_PARTICIPANTS: [FormParticipant, FormParticipant, FormParticipant] = [
  { playerId: null, points: '' },
  { playerId: null, points: '' },
  { playerId: null, points: '' },
];

function createInitialForm() {
  return {
    date: getTodayString(),
    participants: EMPTY_PARTICIPANTS,
  };
}

function createFormFromGame(game: Game) {
  return {
    date: game.date,
    participants: [...game.participants]
      .sort((left, right) => left.rank - right.rank)
      .map<FormParticipant>((participant) => ({
        playerId: participant.playerId,
        points: String(participant.points),
      })) as [FormParticipant, FormParticipant, FormParticipant],
  };
}

function toRank(index: number): Rank {
  return (index + 1) as Rank;
}

function toGameInput(date: string, participants: readonly FormParticipant[]): GameInput {
  return {
    date,
    participants: participants.map<GameParticipant>((participant, index) => ({
      playerId: participant.playerId as PlayerId,
      rank: toRank(index),
      points: Number(participant.points),
    })) as GameInput['participants'],
  };
}

type GameResultFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  successMessage: string;
  initialGame?: Game;
  onSubmit: (input: GameInput) => Promise<{ ok: true } | { ok: false; errors: string[] }>;
  onCancel?: () => void;
  resetAfterSubmit?: boolean;
};

export function GameResultForm({
  title,
  description,
  submitLabel,
  successMessage,
  initialGame,
  onSubmit,
  onCancel,
  resetAfterSubmit = false,
}: GameResultFormProps) {
  const { players } = useGames();
  const initialForm = initialGame ? createFormFromGame(initialGame) : createInitialForm();
  const [date, setDate] = useState(initialForm.date);
  const [participants, setParticipants] = useState(initialForm.participants);
  const [messages, setMessages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const selectedPlayers = useMemo(
    () => new Set(participants.map((participant) => participant.playerId)),
    [participants],
  );

  const updateParticipant = (rankIndex: number, nextParticipant: Partial<FormParticipant>) => {
    if (nextParticipant.playerId === undefined) {
      setParticipants((currentParticipants) =>
        currentParticipants.map((participant, index) =>
          index === rankIndex ? { ...participant, ...nextParticipant } : participant,
        ) as [FormParticipant, FormParticipant, FormParticipant],
      );
      setMessages([]);
      return;
    }

    setParticipants((currentParticipants) =>
      currentParticipants.map((participant, index) => {
        if (index === rankIndex) {
          const nextPlayerId =
            nextParticipant.playerId === participant.playerId ? null : nextParticipant.playerId;
          return { ...participant, ...nextParticipant, playerId: nextPlayerId };
        }

        if (nextParticipant.playerId && participant.playerId === nextParticipant.playerId) {
          return { ...participant, playerId: null };
        }

        return participant;
      }) as [FormParticipant, FormParticipant, FormParticipant],
    );
    setMessages([]);
  };

  const handleSubmit = async () => {
    if (participants.some((participant) => !participant.playerId)) {
      setMessages(['1位、2位、3位の開拓者をすべて選択してください。']);
      return;
    }

    if (participants.some((participant) => !participant.points.trim())) {
      setMessages(['すべての順位にポイントを入力してください。']);
      return;
    }

    setIsSaving(true);
    const result = await onSubmit(toGameInput(date.trim(), participants));
    setIsSaving(false);

    if (!result.ok) {
      setMessages(result.errors);
      return;
    }

    if (resetAfterSubmit) {
      const nextInitialForm = createInitialForm();
      setDate(nextInitialForm.date);
      setParticipants(nextInitialForm.participants);
    }

    setMessages([successMessage]);
  };

  return (
    <Card>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.heading}>
          {title}
        </ThemedText>
        <ThemedText type="small" style={styles.caption}>
          {description}
        </ThemedText>
      </View>

      <DateField label="試合日" value={date} onChange={setDate} />

      <View style={styles.rankFields}>
        {participants.map((participant, index) => {
          const rank = toRank(index);

          return (
            <View key={rank} style={styles.rankField}>
              <View style={styles.rankHeader}>
                <ThemedText type="smallBold" style={styles.rankTitle}>
                  {rank}位
                </ThemedText>
                <TextInput
                  value={participant.points}
                  onChangeText={(points) => updateParticipant(index, { points })}
                  placeholder="ポイント"
                  placeholderTextColor={Colors.light.mutedText}
                  inputMode="numeric"
                  keyboardType="number-pad"
                  style={styles.pointInput}
                />
              </View>
              <View style={styles.playerOptions}>
                {players.map((player) => {
                  const isSelected = participant.playerId === player.id;
                  const isUsedElsewhere = selectedPlayers.has(player.id) && !isSelected;

                  return (
                    <Pressable
                      key={player.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => updateParticipant(index, { playerId: player.id })}
                      style={[
                        styles.playerButton,
                        isSelected && styles.playerButtonSelected,
                        isUsedElsewhere && styles.playerButtonAssignedElsewhere,
                      ]}>
                      <ThemedText
                        type="smallBold"
                        style={isSelected ? styles.playerTextSelected : styles.playerText}>
                        {player.name}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {messages.length > 0 && (
        <View style={styles.messages}>
          {messages.map((message) => (
            <ThemedText key={message} type="small" style={styles.messageText}>
              {message}
            </ThemedText>
          ))}
        </View>
      )}

      <View style={styles.actions}>
        {onCancel ? (
          <Pressable accessibilityRole="button" onPress={onCancel} style={styles.cancelButton}>
            <ThemedText type="smallBold" style={styles.cancelText}>
              キャンセル
            </ThemedText>
          </Pressable>
        ) : null}
        <Pressable
          accessibilityRole="button"
          disabled={isSaving}
          onPress={handleSubmit}
          style={[styles.submitButton, isSaving && styles.submitButtonDisabled]}>
          <ThemedText type="smallBold" style={styles.submitText}>
            {isSaving ? '保存中' : submitLabel}
          </ThemedText>
        </Pressable>
      </View>
    </Card>
  );
}

export function GameForm() {
  const { addGame } = useGames();

  return (
    <GameResultForm
      title="試合結果を記録"
      description="3人分の順位とポイントを入力"
      submitLabel="記録する"
      successMessage="記録しました。"
      onSubmit={addGame}
      resetAfterSubmit
    />
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
  rankFields: {
    gap: Spacing.two,
  },
  rankField: {
    gap: Spacing.two,
    borderRadius: 8,
    backgroundColor: '#EED196',
    padding: Spacing.two,
  },
  rankHeader: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  rankTitle: {
    color: Colors.light.heading,
  },
  pointInput: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.input,
    color: Colors.light.text,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    fontWeight: '600',
  },
  playerOptions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  playerButton: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0D0',
  },
  playerButtonSelected: {
    borderColor: Colors.light.deepGreen,
    backgroundColor: Colors.light.deepGreen,
  },
  playerButtonAssignedElsewhere: {
    borderColor: Colors.light.brick,
    backgroundColor: Colors.light.surface,
  },
  playerText: {
    color: Colors.light.heading,
  },
  playerTextSelected: {
    color: '#FFFFFF',
  },
  messages: {
    gap: Spacing.one,
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    padding: Spacing.two,
  },
  messageText: {
    color: Colors.light.text,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  cancelButton: {
    minHeight: 52,
    flex: 1,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surface,
  },
  cancelText: {
    color: Colors.light.heading,
  },
  submitButton: {
    minHeight: 52,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.brick,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
  },
});
