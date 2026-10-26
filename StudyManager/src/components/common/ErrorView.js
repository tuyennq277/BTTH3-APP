/** @param {{message: string, onRetry: Function}} props Cả hai props bắt buộc */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import AppButton from './AppButton';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ErrorView({message, onRetry}) {
  return <View style={styles.container} accessibilityRole="alert">
    <Ionicons name="alert-circle-outline" size={spacing.xxl} color={colors.danger} />
    <Text style={styles.text}>{message}</Text><AppButton title="Thử lại" variant="outline" onPress={onRetry} />
  </View>;
}
const styles = StyleSheet.create({
  container: {padding: spacing.lg, alignItems: 'center', gap: spacing.md},
  text: {...typography.body, color: colors.danger, textAlign: 'center'},
});
