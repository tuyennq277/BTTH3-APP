import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {formatDateTime} from '../../utils/date';
import colors from '../../theme/colors';
import typography from '../../theme/typography';

export default function LastUpdatedText({timestamp = null}) {
  return timestamp ? <Text style={styles.text}>Cập nhật lần cuối: {formatDateTime(timestamp)}</Text> : null;
}
const styles = StyleSheet.create({text: {...typography.small, color: colors.textMuted}});
