/** @param {{assignment: object, pending?: boolean, onPress: Function, onToggleStatus: Function}} props assignment onPress onToggleStatus bắt buộc */
import React from 'react';
import {Pressable, Text, View, StyleSheet} from 'react-native';
import StatusToggle from './StatusToggle';
import SyncBadge from '../common/SyncBadge';
import {formatDateTime, isOverdue} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

function AssignmentItem({assignment, pending = false, onPress, onToggleStatus}) {
  return <View style={[styles.card, isOverdue(assignment) && styles.overdue]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`Xem bài tập ${assignment.title}`} onPress={onPress} style={styles.content}>
      <Text style={styles.title}>{assignment.title}</Text>
      <Text style={styles.meta}>{assignment.course?.name || 'Môn học'}</Text>
      <Text style={[styles.meta, isOverdue(assignment) && styles.danger]}>Hạn: {formatDateTime(assignment.dueDate)}</Text>
    </Pressable>
    <View style={styles.footer}><StatusToggle status={assignment.status} onToggle={onToggleStatus} /><SyncBadge pending={pending} /></View>
  </View>;
}
export default React.memo(AssignmentItem);
const styles = StyleSheet.create({
  card: {padding: spacing.lg, backgroundColor: colors.surface, borderRadius: spacing.radius,
    borderWidth: spacing.border, borderColor: colors.border}, overdue: {borderColor: colors.danger},
  content: {gap: spacing.xs, minHeight: spacing.touch}, title: {...typography.h3, color: colors.text},
  meta: {...typography.small, color: colors.textMuted}, danger: {color: colors.danger},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap'},
});
