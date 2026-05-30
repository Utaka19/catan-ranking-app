import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { DateField } from '@/components/DateField';
import { useGames } from '@/components/GameContext';
import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { Game, GameInput, Player, PlayerId } from '@/types/game';
import { getTodayString } from '@/utils/date';
import { rankParticipantsByPoints } from '@/utils/ranking';

type FormParticipant = {
  playerId: PlayerId;
  points: string;
};

function createInitialForm(players: readonly Player[]) {
  return {
    date: getTodayString(),
    participants: players.map<FormParticipant>((player) => ({
      playerId: player.id,
      points: '',
    })) as [FormParticipant, FormParticipant, FormParticipant],
  };
}

function createFormFromGame(game: Game, players: readonly Player[]) {
  const pointsByPlayer = new Map(
    game.participants.map((participant) => [participant.playerId, String(participant.points)]),
  );

  return {
    date: game.date,
    participants: players.map<FormParticipant>((player) => ({
      playerId: player.id,
      points: pointsByPlayer.get(player.id) ?? '',
    })) as [FormParticipant, FormParticipant, FormParticipant],
  };
}

function getPlayerName(players: readonly Player[], playerId: PlayerId) {
  return players.find((player) => player.id === playerId)?.name ?? playerId;
}

function hasInvalidPointText(pointText: string) {
  const trimmedText = pointText.trim();

  if (!trimmedText) {
    return true;
  }

  if (!/^\d+$/.test(trimmedText)) {
    return true;
  }

  const value = Number(trimmedText);
  return !Number.isInteger(value) || value < 0;
}

function toGameInput(date: string, participants: readonly FormParticipant[]): GameInput {
  return {
    date,
    participants: rankParticipantsByPoints(
      participants.map((participant) => ({
        playerId: participant.playerId,
        points: Number(participant.points),
      })),
    ),
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
  const initialForm = initialGame
    ? createFormFromGame(initialGame, players)
    : createInitialForm(players);
  const [date, setDate] = useState(initialForm.date);
  const [participants, setParticipants] = useState(initialForm.participants);
  const [messages, setMessages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const updateParticipantPoints = (playerId: PlayerId, points: string) => {
    setParticipants((currentParticipants) =>
      currentParticipants.map((participant) =>
        participant.playerId === playerId ? { ...participant, points } : participant,
      ) as [FormParticipant, FormParticipant, FormParticipant],
    );
    setMessages([]);
  };

  const handleSubmit = async () => {
    if (participants.some((participant) => hasInvalidPointText(participant.points))) {
      setMessages(['3人分のポイントを0以上の整数で入力してください。']);
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
      const nextInitialForm = createInitialForm(players);
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

      <View style={styles.pointFields}>
        {participants.map((participant) => (
          <View key={participant.playerId} style={styles.pointField}>
            <View style={styles.playerColumn}>
              <ThemedText type="smallBold" style={styles.playerName}>
                {getPlayerName(players, participant.playerId)}
              </ThemedText>
              <ThemedText type="small" style={styles.caption}>
                ポイント順で順位を自動判定
              </ThemedText>
            </View>
            <TextInput
              value={participant.points}
              onChangeText={(points) => updateParticipantPoints(participant.playerId, points)}
              placeholder="0"
              placeholderTextColor={Colors.light.mutedText}
              inputMode="numeric"
              keyboardType="number-pad"
              style={styles.pointInput}
            />
          </View>
        ))}
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
      description="3人分のポイントを入力すると順位を自動判定"
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
  pointFields: {
    gap: Spacing.two,
  },
  pointField: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: 8,
    backgroundColor: '#EED196',
    padding: Spacing.two,
  },
  playerColumn: {
    flex: 1,
    gap: 2,
  },
  playerName: {
    color: Colors.light.heading,
    fontSize: 16,
  },
  pointInput: {
    width: 104,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.input,
    color: Colors.light.text,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
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
