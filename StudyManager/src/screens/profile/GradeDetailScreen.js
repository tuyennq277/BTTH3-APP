import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import useDetail from '../../hooks/useDetail';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeDetailScreen({route, navigation}) {
  const query = useDetail('grades', route.params.id);
  const {isOnline} = useNetworkStatus();
  const grade = query.data;
  useEffect(() => {if (grade?.course?.name) {navigation.setOptions({title: grade.course.name});}}, [grade?.course?.name, navigation]);
  if (query.loading) {return <ScreenContainer><LoadingView /></ScreenContainer>;}
  if (!grade) {return <ScreenContainer><ErrorView message={query.error?.message || 'Không tìm thấy kết quả.'} onRetry={query.refresh} /></ScreenContainer>;}
  return <ScreenContainer scroll>
    <Text style={styles.title}>{grade.course?.name || 'Kết quả học tập'}</Text>
    <Text style={styles.subtitle}>{grade.semester} · {grade.course?.credits || 0} tín chỉ</Text>
    {isOnline === false ? <LastUpdatedText timestamp={query.lastUpdated} /> : null}
    {query.error ? <ErrorView message={query.error.message} onRetry={query.refresh} /> : null}
    <View style={styles.card}>
      <View style={styles.row}><Text style={styles.label}>Chuyên cần · 10%</Text><Text style={styles.score}>{grade.attendance}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Giữa kỳ · 30%</Text><Text style={styles.score}>{grade.midterm}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Cuối kỳ · 60%</Text><Text style={styles.score}>{grade.final}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Tổng kết</Text><Text style={styles.highlight}>{grade.total}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Điểm chữ</Text><Text style={styles.highlight}>{grade.letter}</Text></View>
    </View>
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  title: {...typography.h1, color: colors.text}, subtitle: {...typography.body, color: colors.textMuted},
  card: {backgroundColor: colors.surface, padding: spacing.lg, borderRadius: spacing.radius,
    borderColor: colors.border, borderWidth: spacing.border, gap: spacing.lg},
  row: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg},
  label: {...typography.body, color: colors.textMuted}, score: {...typography.h3, color: colors.text},
  highlight: {...typography.h2, color: colors.primary},
});
