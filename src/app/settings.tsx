import { useMemo, useState } from 'react';
import { Image, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { useGames } from '@/components/GameContext';
import { PlayerNameEditor } from '@/components/PlayerNameEditor';
import { Card, ScreenShell } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { IllustrationImages } from '@/constants/images';
import { Colors, Spacing } from '@/constants/theme';
import { confirmAction } from '@/utils/confirm';
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

  const handleReset = async () => {
    const firstConfirmed = await confirmAction(
      'すべての試合履歴を削除します。',
      'この操作は元に戻せません。\n開拓者名は削除されません。',
    );

    if (!firstConfirmed) {
      return;
    }

    const secondConfirmed = await confirmAction('本当に削除しますか？');

    if (!secondConfirmed) {
      return;
    }

    await clearGames();
    setMessage('すべての試合履歴を削除しました。');
  };

  return (
    <ScreenShell>
      <View style={styles.hero}>
        <View style={styles.heroText}>
          <ThemedText type="subtitle" style={styles.title}>
            設定
          </ThemedText>
          <ThemedText type="small" style={styles.lead}>
            開拓者名、CSV出力、戦績リセットを管理。
          </ThemedText>
        </View>
        <Image
          source={IllustrationImages.headerJournal}
          resizeMode="contain"
          style={styles.heroImage}
        />
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
        <Pressable accessibilityRole="button" onPress={() => void handleReset()} style={styles.resetButton}>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 8,
    backgroundColor: Colors.light.deepGreen,
    padding: Spacing.four,
  },
  heroText: {
    flex: 1,
    gap: Spacing.two,
  },
  heroImage: {
    width: 96,
    height: 96,
    opacity: 0.92,
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
