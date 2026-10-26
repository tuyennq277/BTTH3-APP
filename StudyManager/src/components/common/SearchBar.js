/** @param {{value: string, onChangeText: Function, placeholder?: string}} props value và onChangeText bắt buộc */
import React from 'react';
import {View, TextInput, Pressable, StyleSheet} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SearchBar({value, onChangeText, placeholder = 'Tìm kiếm…'}) {
  return <View style={styles.container}>
    <Ionicons name="search-outline" size={spacing.icon} color={colors.textMuted} />
    <TextInput accessibilityLabel={placeholder} placeholder={placeholder} placeholderTextColor={colors.textMuted}
      value={value} onChangeText={onChangeText} style={styles.input} />
    {value ? <Pressable accessibilityLabel="Xóa tìm kiếm" accessibilityRole="button" onPress={() => onChangeText('')} style={styles.clear}>
      <Ionicons name="close-circle" size={spacing.icon} color={colors.textMuted} /></Pressable> : null}
  </View>;
}
const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', borderWidth: spacing.border, borderColor: colors.border,
    borderRadius: spacing.md, backgroundColor: colors.surface, paddingLeft: spacing.md},
  input: {...typography.body, color: colors.text, flex: 1, minHeight: spacing.touch, padding: spacing.md},
  clear: {minWidth: spacing.touch, minHeight: spacing.touch, alignItems: 'center', justifyContent: 'center'},
});
