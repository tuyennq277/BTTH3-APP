import React, {useEffect} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import {useAppData} from '../../context/AppDataContext';
import useDetail from '../../hooks/useDetail';
import usePageState from '../../hooks/usePageState';
import {dayLabel, formatDateTime} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseDetailScreen({route, navigation}) {
  const {id} = route.params;
  const app = useAppData();
  const query = useDetail('courses', id);
  const page = usePageState([query, app.queries.sessions, app.queries.assignments]);
  const course = query.data;
  useEffect(() => {if (course?.name) {navigation.setOptions({title: course.name});}}, [course?.name, navigation]);
  if (page.loading && !course) {return <ScreenContainer><LoadingView /></ScreenContainer>;}
  if (!course) {return <ScreenContainer><ErrorView message={query.error?.message || 'Không tìm thấy môn học.'} onRetry={query.refresh} /></ScreenContainer>;}
  const sessions = app.sessions.filter(item => String(item.courseId) === String(id));
  const assignments = app.assignments.filter(item => String(item.courseId) === String(id));
  return <ScreenContainer scroll>
    <Text style={styles.code}>{course.code} · {course.credits} tín chỉ</Text><Text style={styles.title}>{course.name}</Text>
    {page.isOnline === false ? <LastUpdatedText timestamp={query.lastUpdated || page.lastUpdated} /> : null}
    {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
    <View style={styles.card}><Text style={styles.label}>Giảng viên</Text><Text style={styles.body}>{course.lecturer}</Text>
      <Text style={styles.label}>Học kỳ</Text><Text style={styles.body}>{course.semester}</Text>
      <Text style={styles.label}>Mô tả</Text><Text style={styles.body}>{course.description}</Text></View>
    <Text style={styles.section}>Lịch học</Text>
    {sessions.length ? sessions.map(item => <View key={item.id} style={styles.card}>
      <Text style={styles.body}>{dayLabel(item.dayOfWeek)} · {item.startTime}–{item.endTime}</Text>
      <Text style={styles.label}>{item.room}</Text></View>) : <Text style={styles.label}>Chưa có buổi học.</Text>}
    <Text style={styles.section}>Bài tập</Text>
    {assignments.length ? assignments.map(item => <View key={item.id} style={styles.card}>
      <Text style={styles.body}>{item.title}</Text><Text style={styles.label}>Hạn: {formatDateTime(item.dueDate)}</Text></View>)
      : <Text style={styles.label}>Chưa có bài tập.</Text>}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  code: {...typography.small, color: colors.primary, fontWeight: '700'},
  title: {...typography.h1, color: colors.text}, section: {...typography.h2, color: colors.text, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, borderRadius: spacing.radius, borderWidth: spacing.border,
    borderColor: colors.border, padding: spacing.lg, gap: spacing.sm},
  body: {...typography.body, color: colors.text}, label: {...typography.small, color: colors.textMuted},
});
