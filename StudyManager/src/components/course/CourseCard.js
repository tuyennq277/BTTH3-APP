/** @param {{course: object, onPress: Function}} props Bắt buộc */
import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function CourseCard({course, onPress}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Xem môn ${course.name}`} onPress={onPress} style={styles.card}>
    <View style={styles.row}><Text style={styles.code}>{course.code}</Text><Text style={styles.credits}>{course.credits} tín chỉ</Text></View>
    <Text style={styles.name}>{course.name}</Text><Text style={styles.meta}>{course.lecturer}</Text>
  </Pressable>;
}
export default React.memo(CourseCard);
const styles = StyleSheet.create({
  card: {minHeight: spacing.touch, padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface,
    borderColor: colors.border, borderWidth: spacing.border, borderRadius: spacing.radius},
  row: {flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md},
  code: {...typography.small, color: colors.primary, fontWeight: '700', flexShrink: 1},
  credits: {...typography.small, color: colors.textMuted}, name: {...typography.h3, color: colors.text},
  meta: {...typography.small, color: colors.textMuted},
});
