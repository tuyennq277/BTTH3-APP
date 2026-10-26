import React, {useMemo, useState} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import GpaSummary from '../../components/grade/GpaSummary';
import GradeRow from '../../components/grade/GradeRow';
import {useAppData} from '../../context/AppDataContext';
import usePageState from '../../hooks/usePageState';
import {calcGpa} from '../../utils/gpa';
import {ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function GradeListScreen({navigation}) {
  const app = useAppData();
  const page = usePageState([app.queries.grades, app.queries.courses]);
  const [semester, setSemester] = useState('all');
  const semesters = useMemo(() => [...new Set(app.grades.map(item => item.semester))], [app.grades]);
  const filtered = app.grades.filter(item => semester === 'all' || item.semester === semester);
  const summary = calcGpa(filtered, app.courses);
  return <ScreenContainer>
    {page.loading ? <LoadingView /> : page.error && !app.queries.grades.data
      ? <ErrorView message={page.error.message} onRetry={page.refresh} />
      : <FlatList data={filtered} keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content} refreshing={page.refreshing} onRefresh={page.refresh}
        ListHeaderComponent={<View style={styles.header}>
          <Text style={styles.title}>Kết quả học tập</Text>
          {page.isOnline === false ? <LastUpdatedText timestamp={page.lastUpdated} /> : null}
          {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
          <FilterChips options={[{label: 'Tất cả', value: 'all'}, ...semesters.map(value => ({label: value, value}))]}
            selected={semester} onSelect={setSemester} />
          <GpaSummary gpa={summary.gpa} totalCredits={summary.totalCredits} /></View>}
        renderItem={({item}) => <GradeRow grade={item} onPress={() => navigation.navigate(ROUTES.GRADE_DETAIL, {id: item.id})} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState title="Không có kết quả học tập" description="Chọn học kỳ khác hoặc kéo để tải lại." />}
      />}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  content: {padding: spacing.lg, paddingBottom: spacing.xxl}, header: {gap: spacing.md, paddingBottom: spacing.lg},
  title: {...typography.h1, color: colors.text}, separator: {height: spacing.md},
});
