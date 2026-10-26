/** @param {{options: Array<{label: string, value: any}>, selected: any, onSelect: Function}} props Tất cả bắt buộc */
import React from 'react';
import {ScrollView, Pressable, Text, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FilterChips({options, selected, onSelect}) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
    {options.map(option => <Pressable key={String(option.value)} accessibilityRole="button" accessibilityLabel={option.label}
      accessibilityState={{selected: selected === option.value}} onPress={() => onSelect(option.value)}
      style={[styles.chip, selected === option.value && styles.active]}>
      <Text style={[styles.text, selected === option.value && styles.activeText]}>{option.label}</Text></Pressable>)}
  </ScrollView>;
}
const styles = StyleSheet.create({
  container: {gap: spacing.sm}, chip: {minHeight: spacing.touch, minWidth: spacing.touch, paddingHorizontal: spacing.lg,
    justifyContent: 'center', borderWidth: spacing.border, borderColor: colors.border, borderRadius: spacing.round, backgroundColor: colors.surface},
  active: {backgroundColor: colors.primary, borderColor: colors.primary},
  text: {...typography.small, color: colors.textMuted, fontWeight: '600'}, activeText: {color: colors.white},
});
