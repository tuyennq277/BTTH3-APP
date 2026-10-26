/** @param {{children: React.ReactNode, scroll?: boolean}} props children bắt buộc */
import React from 'react';
import {ScrollView, View, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';

export default function ScreenContainer({children, scroll = false}) {
  return (
    <SafeAreaView edges={['left', 'right']} style={styles.container}>
      <OfflineBanner />
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>{children}</ScrollView>
          : <View style={styles.container}>{children}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.background},
  content: {padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl},
});
