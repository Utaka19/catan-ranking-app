import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useGames } from '@/components/GameContext';
import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { PlayerId } from '@/types/game';

type DraftNames = Partial<Record<PlayerId, string>>;

export function PlayerNameEditor() {
  const { players, updatePlayerName } = useGames();
  const [draftNames, setDraftNames] = useState<DraftNames>({});
  const [message, setMessage] = useState<string | null>(null);
  const [savingPlayerId, setSavingPlayerId] = useState<PlayerId | null>(null);

  const handleSave = async (playerId: PlayerId) => {
    setSavingPlayerId(playerId);
    const result = await updatePlayerName(
      playerId,
      draftNames[playerId] ?? players.find((player) => player.id === playerId)?.name ?? '',
    );
    setSavingPlayerId(null);

    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    setDraftNames((currentDraftNames) => ({
      ...currentDraftNames,
      [playerId]: draftNames[playerId]?.trim(),
    }));
    setMessage('名前を保存しました。');
  };

  return (
    <Card>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.heading}>
          開拓者名
        </ThemedText>
        <ThemedText type="small" style={styles.caption}>
          IDは固定のまま、開拓者の表示名だけ変更
        </ThemedText>
      </View>

      <View style={styles.rows}>
        {players.map((player) => {
          const hasDraft = draftNames[player.id] !== undefined;
          const draftName = draftNames[player.id] ?? '';

          return (
            <View key={player.id} style={styles.rowGroup}>
              <ThemedText type="smallBold" style={styles.fieldLabel}>
                {player.name}
              </ThemedText>
              <View style={styles.row}>
                <TextInput
                  value={hasDraft ? draftName : ''}
                  onChangeText={(name) =>
                    setDraftNames((currentDraftNames) => ({
                      ...currentDraftNames,
                      [player.id]: name,
                    }))
                  }
                  placeholder={player.name}
                  placeholderTextColor={Colors.light.mutedText}
                  style={[styles.input, hasDraft && draftName.length === 0 && styles.inputEmpty]}
                />
                <Pressable
                  accessibilityRole="button"
                  disabled={savingPlayerId === player.id}
                  onPress={() => handleSave(player.id)}
                  style={[
                    styles.saveButton,
                    savingPlayerId === player.id && styles.saveButtonDisabled,
                  ]}>
                  <ThemedText type="smallBold" style={styles.saveText}>
                    保存
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {message && (
        <View style={styles.message}>
          <ThemedText type="small">{message}</ThemedText>
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
  rows: {
    gap: Spacing.two,
  },
  rowGroup: {
    gap: Spacing.one,
  },
  fieldLabel: {
    color: Colors.light.heading,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.input,
    color: Colors.light.text,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    fontWeight: '700',
  },
  inputEmpty: {
    borderColor: Colors.light.brick,
    backgroundColor: '#FFF3DC',
  },
  saveButton: {
    minWidth: 72,
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.deepGreen,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveText: {
    color: '#FFFFFF',
  },
  message: {
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    padding: Spacing.two,
  },
});
