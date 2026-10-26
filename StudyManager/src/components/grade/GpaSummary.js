/** @param {{gpa: number, totalCredits: number}} props Bắt buộc */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GpaSummary({gpa, totalCredits}) {
  return <View style={styles.card}>
    <View><Text style={styles.label}>GPA hệ 4</Text><Text style={styles.number}>{Number(gpa).toFixed(2)}</Text></View>
    <View><Text style={styles.label}>Tín chỉ tích lũy</Text><Text style={styles.number}>{totalCredits}</Text></View>
  </View>;
}
const styles = StyleSheet.create({
  card: {backgroundColor: colors.primarySoft, borderRadius: spacing.radius, padding: spacing.lg,
    flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg},
  label: {...typography.small, color: colors.textMuted}, number: {...typography.h1, color: colors.primary},
});
