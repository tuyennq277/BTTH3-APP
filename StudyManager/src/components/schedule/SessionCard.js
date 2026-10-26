/** @param {{session: object, onPress: Function}} props Bắt buộc */
import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function SessionCard({session, onPress}) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Xem buổi học ${session.course?.name || ''}`} onPress={onPress} style={styles.card}>
    <Text style={styles.time}>{session.startTime} – {session.endTime}</Text>
    <Text style={styles.name}>{session.course?.name || 'Môn học'}</Text><Text style={styles.meta}>{session.room}</Text>
  </Pressable>;
}
export default React.memo(SessionCard);
const styles = StyleSheet.create({
  card: {minHeight: spacing.touch, padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.surface,
    borderColor: colors.border, borderWidth: spacing.border, borderRadius: spacing.radius},
  time: {...typography.small, color: colors.primary, fontWeight: '700'},
  name: {...typography.h3, color: colors.text}, meta: {...typography.small, color: colors.textMuted},
});
