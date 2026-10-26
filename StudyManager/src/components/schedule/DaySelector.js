/** @param {{selectedDay: number, onSelectDay: Function}} props Bắt buộc */
import React from 'react';
import {ScrollView, Pressable, Text, StyleSheet} from 'react-native';
import {dayLabel} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function DaySelector({selectedDay, onSelectDay}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
    {[2, 3, 4, 5, 6, 7, 8].map(day => <Pressable key={day} accessibilityLabel={dayLabel(day)}
      accessibilityRole="button" accessibilityState={{selected: day === selectedDay}} onPress={() => onSelectDay(day)}
      style={[styles.day, day === selectedDay && styles.active]}>
      <Text style={[styles.label, day === selectedDay && styles.activeLabel]}>{day === 8 ? 'CN' : `T${day}`}</Text>
    </Pressable>)}
  </ScrollView>;
}
const styles = StyleSheet.create({
  row: {gap: spacing.sm}, day: {width: spacing.touch, height: spacing.touch, borderRadius: spacing.round,
    backgroundColor: colors.surface, borderWidth: spacing.border, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center'}, active: {backgroundColor: colors.primary, borderColor: colors.primary},
  label: {...typography.button, color: colors.text}, activeLabel: {color: colors.white},
});
