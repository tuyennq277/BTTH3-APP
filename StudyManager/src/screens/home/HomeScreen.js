import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import CourseCard from '../../components/course/CourseCard';
import {useAppData} from '../../context/AppDataContext';
import {useSync} from '../../context/SyncContext';
import usePageState from '../../hooks/usePageState';
import {daysLeft, formatDateTime} from '../../utils/date';
import {CURRENT_SEMESTER} from '../../config';
import {ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function HomeScreen({navigation}) {
  const app = useAppData();
  const {pendingCount, syncing, syncNow, error: syncError} = useSync();
  const page = usePageState([app.queries.student, app.queries.courses, app.queries.assignments]);
  if (page.loading) {return <ScreenContainer><LoadingView /></ScreenContainer>;}
  if (page.error && !app.student) {return <ScreenContainer><ErrorView message={page.error.message} onRetry={page.refresh} /></ScreenContainer>;}
  const current = app.courses.filter(course => course.semester === CURRENT_SEMESTER);
  const dueSoon = app.assignments.filter(item => item.status !== 'done' && daysLeft(item.dueDate) >= 0 && daysLeft(item.dueDate) <= 7);
  return <ScreenContainer scroll>
    <View style={styles.hero}><Text style={styles.eyebrow}>Xin chào</Text>
      <Text style={styles.name}>{app.student?.fullName || 'Sinh viên'}</Text>
      <Text style={styles.eyebrow}>{app.student?.studentCode || ''}</Text></View>
    {page.isOnline === false ? <LastUpdatedText timestamp={page.lastUpdated} /> : null}
    {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
    <View style={styles.syncCard}><Text style={styles.syncTitle}>{pendingCount} thay đổi chưa đồng bộ</Text>
      <Text style={styles.syncHint}>{syncError || (syncing ? 'Đang đồng bộ…' : 'Tự đồng bộ khi có mạng')}</Text>
      {page.isOnline && pendingCount ? <Pressable accessibilityRole="button" accessibilityLabel="Đồng bộ ngay" onPress={syncNow} style={styles.syncButton}>
        <Text style={styles.syncLink}>Đồng bộ ngay</Text></Pressable> : null}</View>
    <Text style={styles.heading}>Môn đang học · {current.length}</Text>
    {current.length ? current.map(course => <CourseCard key={course.id} course={course}
      onPress={() => navigation.navigate(ROUTES.COURSE_DETAIL, {id: course.id})} />)
      : <Text style={styles.empty}>Chưa có môn học trong học kỳ này.</Text>}
    <Text style={styles.heading}>Bài tập trong 7 ngày tới · {dueSoon.length}</Text>
    {dueSoon.length ? dueSoon.map(item => <Pressable key={item.id} accessibilityRole="button"
      accessibilityLabel={`Xem bài tập ${item.title}`} onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, {id: item.id})}
      style={styles.assignment}><Text style={styles.assignmentTitle}>{item.title}</Text>
      <Text style={styles.assignmentMeta}>{item.course?.name} · {formatDateTime(item.dueDate)}</Text>
      <SyncBadge pending={item._pending} /></Pressable>)
      : <Text style={styles.empty}>Không có bài tập sắp đến hạn.</Text>}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  hero: {backgroundColor: colors.primary, borderRadius: spacing.radius, padding: spacing.xl, gap: spacing.xs},
  eyebrow: {...typography.small, color: colors.white}, name: {...typography.h1, color: colors.white},
  heading: {...typography.h2, color: colors.text, marginTop: spacing.lg},
  empty: {...typography.body, color: colors.textMuted},
  syncCard: {backgroundColor: colors.primarySoft, borderRadius: spacing.radius, padding: spacing.lg, gap: spacing.xs},
  syncTitle: {...typography.h3, color: colors.text}, syncHint: {...typography.small, color: colors.textMuted},
  syncButton: {minHeight: spacing.touch, justifyContent: 'center', alignSelf: 'flex-start'},
  syncLink: {...typography.button, color: colors.primary},
  assignment: {minHeight: spacing.touch, backgroundColor: colors.surface, borderRadius: spacing.radius,
    borderWidth: spacing.border, borderColor: colors.border, padding: spacing.lg, gap: spacing.xs},
  assignmentTitle: {...typography.h3, color: colors.text}, assignmentMeta: {...typography.small, color: colors.textMuted},
});
