/** @param {{label: string, value: string, onChangeText: Function, error?: string, keyboardType?: string}} props label value onChangeText bắt buộc */
import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function FormInput({label, value, onChangeText, error = '', keyboardType = 'default', multiline = false}) {
  return <View style={styles.container}><Text style={styles.label}>{label}</Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} keyboardType={keyboardType}
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'} multiline={multiline}
      style={[styles.input, error && styles.invalid, multiline && styles.multiline]} />
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: {gap: spacing.sm}, label: {...typography.body, color: colors.text, fontWeight: '600'},
  input: {...typography.body, color: colors.text, backgroundColor: colors.surface, minHeight: spacing.touch,
    padding: spacing.md, borderWidth: spacing.border, borderColor: colors.border, borderRadius: spacing.md},
  invalid: {borderColor: colors.danger}, error: {...typography.small, color: colors.danger},
  multiline: {minHeight: spacing.touch * 2, textAlignVertical: 'top'},
});
