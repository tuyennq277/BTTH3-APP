/** @param {{status: string, onToggle: Function}} props Bắt buộc */
import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function StatusToggle({status, onToggle}) {
  const done = status === 'done';
  return <Pressable accessibilityRole="button" accessibilityLabel={done ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
    onPress={onToggle} style={styles.button}>
    <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={spacing.icon} color={done ? colors.success : colors.textMuted} />
    <Text style={[styles.text, done && styles.done]}>{done ? 'Đã xong' : 'Chưa xong'}</Text>
  </Pressable>;
}
const styles = StyleSheet.create({
  button: {minHeight: spacing.touch, minWidth: spacing.touch, flexDirection: 'row', alignItems: 'center', gap: spacing.sm},
  text: {...typography.small, color: colors.textMuted}, done: {color: colors.success, fontWeight: '700'},
});
