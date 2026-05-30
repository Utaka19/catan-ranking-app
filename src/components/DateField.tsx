import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import {
  getEndOfMonthString,
  getStartOfMonthString,
  getTodayString,
  getYesterdayString,
  normalizeDateInput,
} from '@/utils/date';

type DateFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function DateField({ label, value, onChange }: DateFieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.header}>
        <ThemedText type="smallBold" style={styles.label}>
          {label}
        </ThemedText>
      </View>
      <View style={styles.quickButtons}>
        <QuickDateButton label="今日" onPress={() => onChange(getTodayString())} />
        <QuickDateButton label="昨日" onPress={() => onChange(getYesterdayString())} />
        <QuickDateButton label="今月1日" onPress={() => onChange(getStartOfMonthString())} />
        <QuickDateButton label="今月末" onPress={() => onChange(getEndOfMonthString())} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        onBlur={() => onChange(normalizeDateInput(value))}
        placeholder="例: 2026-5-3 / 20260503"
        placeholderTextColor={Colors.light.textSecondary}
        inputMode="numeric"
        keyboardType="number-pad"
        maxLength={10}
        style={styles.input}
      />
      <ThemedText type="small" style={styles.helpText}>
        2026-5-3、2026/5/3、20260503 の形で入力できます。
      </ThemedText>
    </View>
  );
}

function QuickDateButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.quickButton}>
      <ThemedText type="smallBold" style={styles.quickButtonText}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },
  header: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  label: {
    color: Colors.light.heading,
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  quickButton: {
    minHeight: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.light.deepGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.two,
    backgroundColor: Colors.light.surface,
  },
  quickButtonText: {
    color: Colors.light.deepGreen,
  },
  input: {
    minHeight: 50,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
    borderRadius: 8,
    backgroundColor: Colors.light.input,
    color: Colors.light.text,
    paddingHorizontal: Spacing.three,
    fontSize: 17,
    fontWeight: '700',
  },
  helpText: {
    color: Colors.light.mutedText,
  },
});
