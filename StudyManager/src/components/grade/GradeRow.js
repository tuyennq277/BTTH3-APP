/** @param {{grade: object, onPress: Function}} props Bắt buộc */
import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function GradeRow({grade, onPress}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Xem điểm môn ${grade.course?.name || ''}`}
    onPress={onPress} style={styles.card}>
    <View style={styles.row}><Text style={styles.name}>{grade.course?.name || grade.courseId}</Text>
      <Text style={styles.score}>{grade.total} · {grade.letter}</Text></View>
    <Text style={styles.meta}>{grade.course?.credits || 0} tín chỉ</Text>
  </Pressable>;
}
export default React.memo(GradeRow);
const styles = StyleSheet.create({
  card: {minHeight: spacing.touch, backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.sm,
    borderRadius: spacing.radius, borderWidth: spacing.border, borderColor: colors.border},
  row: {flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md},
  name: {...typography.h3, color: colors.text, flex: 1},
  score: {...typography.button, color: colors.primary}, meta: {...typography.small, color: colors.textMuted},
});
