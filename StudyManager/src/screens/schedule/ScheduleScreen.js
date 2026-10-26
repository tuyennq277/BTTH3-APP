import React, {useState} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import DaySelector from '../../components/schedule/DaySelector';
import SessionCard from '../../components/schedule/SessionCard';
import {useAppData} from '../../context/AppDataContext';
import usePageState from '../../hooks/usePageState';
import {today, dayLabel} from '../../utils/date';
import {ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ScheduleScreen({navigation}) {
  const app = useAppData();
  const page = usePageState([app.queries.sessions]);
  const [day, setDay] = useState(today());
  const filtered = app.sessions.filter(item => Number(item.dayOfWeek) === day)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  return <ScreenContainer>
    {page.loading ? <LoadingView /> : page.error && !app.queries.sessions.data
      ? <ErrorView message={page.error.message} onRetry={page.refresh} />
      : <FlatList data={filtered} keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content} refreshing={page.refreshing} onRefresh={page.refresh}
        ListHeaderComponent={<View style={styles.header}>
          <Text style={styles.title}>Thời khóa biểu</Text>
          {page.isOnline === false ? <LastUpdatedText timestamp={page.lastUpdated} /> : null}
          {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
          <DaySelector selectedDay={day} onSelectDay={setDay} />
          <Text style={styles.subtitle}>{dayLabel(day)} · {filtered.length} buổi học</Text></View>}
        renderItem={({item}) => <SessionCard session={item} onPress={() => navigation.navigate(ROUTES.SESSION_DETAIL, {id: item.id})} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState title="Không có buổi học" description="Chọn ngày khác để xem lịch." />}
      />}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  content: {padding: spacing.lg, paddingBottom: spacing.xxl}, header: {gap: spacing.md, paddingBottom: spacing.lg},
  title: {...typography.h1, color: colors.text}, subtitle: {...typography.body, color: colors.textMuted},
  separator: {height: spacing.md},
});
