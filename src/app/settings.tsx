import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useGames } from '@/components/GameContext';
import { PlayerNameEditor } from '@/components/PlayerNameEditor';
import { Card, ScreenShell } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { exportGamesToCsv } from '@/utils/csv';

export default function SettingsScreen() {
  const { games, players, clearGames } = useGames();
  const [message, setMessage] = useState<string | null>(null);
  const csv = useMemo(() => exportGamesToCsv(games, players), [games, players]);
  const hasGames = games.length > 0;

  const handleCopyCsv = async () => {
    if (!hasGames) {
      setMessage('出力できる試合履歴がありません。');
      return;
    }

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(csv);
      setMessage('CSVをコピーしました。');
      return;
    }

    setMessage('CSV欄を長押しして手動でコピーしてください。');
  };

  const handleReset = () => {
    Alert.alert(
      'すべての試合履歴を削除します。',
      'この操作は元に戻せません。\n開拓者名は削除されません。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '続ける',
          style: 'destructive',
          onPress: () => {
            Alert.alert('本当に削除しますか？', undefined, [
              { text: 'キャンセル', style: 'cancel' },
              {
                text: '削除する',
                style: 'destructive',
                onPress: () => {
                  void clearGames().then(() => setMessage('すべての試合履歴を削除しました。'));
                },
              },
            ]);
          },
        },
      ],
    );
  };

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <ThemedText type="subtitle" style={styles.title}>
          設定
        </ThemedText>
        <ThemedText type="small" style={styles.lead}>
          開拓者名、CSV出力、戦績リセットを管理。
        </ThemedText>
      </View>

      <PlayerNameEditor />

      <Card>
        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.heading}>
            CSVエクスポート
          </ThemedText>
          <ThemedText type="small" style={styles.caption}>
            現在の開拓者名で試合履歴を出力します。
          </ThemedText>
        </View>

        {hasGames ? (
          <TextInput
            value={csv}
            editable={false}
            multiline
            selectTextOnFocus
            style={styles.csvBox}
          />
        ) : (
          <View style={styles.emptyBox}>
            <ThemedText type="smallBold" style={styles.emptyText}>
              出力できる試合履歴がありません。
            </ThemedText>
          </View>
        )}

        <Pressable accessibilityRole="button" onPress={handleCopyCsv} style={styles.copyButton}>
          <ThemedText type="smallBold" style={styles.copyText}>
            CSVをコピー
          </ThemedText>
        </Pressable>
      </Card>

      <Card>
        <View style={styles.header}>
          <ThemedText type="smallBold" style={styles.dangerHeading}>
            危険な操作
          </ThemedText>
          <ThemedText type="small" style={styles.caption}>
            開拓者名は残し、試合履歴だけを削除します。
          </ThemedText>
        </View>
        <Pressable accessibilityRole="button" onPress={handleReset} style={styles.resetButton}>
          <ThemedText type="smallBold" style={styles.resetText}>
            戦績をリセット
          </ThemedText>
        </Pressable>
      </Card>

      {message ? (
        <View style={styles.message}>
          <ThemedText type="smallBold">{message}</ThemedText>
        </View>
      ) : null}
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
  title: {
    color: '#FFFFFF',
  },
  lead: {
    color: '#F9E6B6',
  },
  header: {
    gap: Spacing.one,
  },
  heading: {
    color: Colors.light.heading,
  },
  dangerHeading: {
    color: Colors.light.brick,
  },
  caption: {
    color: Colors.light.mutedText,
  },
  csvBox: {
    minHeight: 160,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.input,
    color: Colors.light.text,
    padding: Spacing.three,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyBox: {
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    padding: Spacing.three,
  },
  emptyText: {
    color: Colors.light.heading,
  },
  copyButton: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.deepGreen,
  },
  copyText: {
    color: '#FFFFFF',
  },
  resetButton: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.brick,
  },
  resetText: {
    color: '#FFFFFF',
  },
  message: {
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    padding: Spacing.three,
  },
});
