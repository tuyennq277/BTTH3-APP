/** @param {{label: string, value: string}} props Bắt buộc */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function InfoRow({label, value}) {
  return <View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value || '—'}</Text></View>;
}
const styles = StyleSheet.create({
  row: {paddingVertical: spacing.sm, borderBottomWidth: spacing.border, borderBottomColor: colors.border, gap: spacing.xs},
  label: {...typography.small, color: colors.textMuted}, value: {...typography.body, color: colors.text},
});
