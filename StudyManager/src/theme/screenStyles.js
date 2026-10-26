import {StyleSheet} from 'react-native';
import colors from './colors';
import spacing from './spacing';
import typography from './typography';

export default StyleSheet.create({
  content: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl},
  header: {gap: spacing.md, paddingBottom: spacing.md},
  title: {...typography.h1, color: colors.text},
  subtitle: {...typography.body, color: colors.textMuted},
  section: {...typography.h2, color: colors.text, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, borderRadius: spacing.radius, padding: spacing.lg, gap: spacing.sm,
    borderWidth: spacing.border, borderColor: colors.border},
  body: {...typography.body, color: colors.text},
  label: {...typography.small, color: colors.textMuted},
  error: {...typography.small, color: colors.danger},
  row: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm},
  grow: {flex: 1},
});
