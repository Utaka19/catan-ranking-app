import { Pressable, StyleSheet, View } from 'react-native';

import { DateField } from '@/components/DateField';
import { Card } from '@/components/ScreenShell';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import type { PeriodPreset, PeriodSelection } from '@/types/game';
import { getPeriodSelectionError } from '@/utils/date';

const OPTIONS: { label: string; value: PeriodPreset }[] = [
  { label: '全期間', value: 'all' },
  { label: '今月', value: 'thisMonth' },
  { label: '先月', value: 'lastMonth' },
  { label: '任意期間', value: 'custom' },
];

type PeriodSelectorProps = {
  selection: PeriodSelection;
  onChange: (selection: PeriodSelection) => void;
};

export function PeriodSelector({ selection, onChange }: PeriodSelectorProps) {
  const customRangeError = getPeriodSelectionError(selection);

  return (
    <Card>
      <ThemedText type="smallBold" style={styles.heading}>
        集計期間
      </ThemedText>
      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const selected = option.value === selection.preset;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() =>
                onChange({
                  ...selection,
                  preset: option.value,
                })
              }
              style={[styles.optionButton, selected && styles.optionButtonSelected]}>
              <ThemedText
                type="smallBold"
                style={selected ? styles.optionTextSelected : styles.optionText}>
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>

      {selection.preset === 'custom' ? (
        <View style={styles.customRange}>
          <DateField
            label="開始日"
            value={selection.startDate}
            onChange={(startDate) => onChange({ ...selection, startDate })}
          />
          <DateField
            label="終了日"
            value={selection.endDate}
            onChange={(endDate) => onChange({ ...selection, endDate })}
          />
          {customRangeError ? (
            <ThemedText type="small" style={styles.errorText}>
              {customRangeError}
            </ThemedText>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  heading: {
    color: Colors.light.heading,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#FFF0D0',
  },
  optionButtonSelected: {
    borderColor: Colors.light.deepGreen,
    backgroundColor: Colors.light.deepGreen,
  },
  optionText: {
    color: Colors.light.heading,
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  customRange: {
    gap: Spacing.two,
  },
  errorText: {
    borderRadius: 8,
    backgroundColor: Colors.light.wheatSoft,
    color: Colors.light.brick,
    padding: Spacing.two,
  },
});
