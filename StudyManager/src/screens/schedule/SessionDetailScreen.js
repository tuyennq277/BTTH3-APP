import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import useDetail from '../../hooks/useDetail';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import {dayLabel} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function SessionDetailScreen({route, navigation}) {
  const query = useDetail('sessions', route.params.id);
  const {isOnline} = useNetworkStatus();
  const session = query.data;
  useEffect(() => {if (session?.course?.name) {navigation.setOptions({title: session.course.name});}}, [session?.course?.name, navigation]);
  if (query.loading) {return <ScreenContainer><LoadingView /></ScreenContainer>;}
  if (!session) {return <ScreenContainer><ErrorView message={query.error?.message || 'Không tìm thấy buổi học.'} onRetry={query.refresh} /></ScreenContainer>;}
  return <ScreenContainer scroll>
    <Text style={styles.title}>{session.course?.name || 'Buổi học'}</Text>
    {isOnline === false ? <LastUpdatedText timestamp={query.lastUpdated} /> : null}
    {query.error ? <ErrorView message={query.error.message} onRetry={query.refresh} /> : null}
    <View style={styles.card}><Text style={styles.label}>Ngày học</Text><Text style={styles.body}>{dayLabel(session.dayOfWeek)}</Text>
      <Text style={styles.label}>Thời gian</Text><Text style={styles.body}>{session.startTime} – {session.endTime}</Text>
      <Text style={styles.label}>Phòng học</Text><Text style={styles.body}>{session.room}</Text>
      <Text style={styles.label}>Ghi chú</Text><Text style={styles.body}>{session.note || 'Không có'}</Text></View>
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  title: {...typography.h1, color: colors.text}, card: {backgroundColor: colors.surface, borderRadius: spacing.radius,
    borderWidth: spacing.border, borderColor: colors.border, padding: spacing.lg, gap: spacing.sm},
  body: {...typography.body, color: colors.text}, label: {...typography.small, color: colors.textMuted},
});
