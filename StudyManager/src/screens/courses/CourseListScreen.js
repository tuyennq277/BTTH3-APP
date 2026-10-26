import React, {useMemo, useState} from 'react';
import {FlatList, Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import CourseCard from '../../components/course/CourseCard';
import {useAppData} from '../../context/AppDataContext';
import usePageState from '../../hooks/usePageState';
import {ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function CourseListScreen({navigation}) {
  const app = useAppData();
  const page = usePageState([app.queries.courses]);
  const [search, setSearch] = useState('');
  const [semester, setSemester] = useState('all');
  const semesters = useMemo(() => [...new Set(app.courses.map(item => item.semester))], [app.courses]);
  const filtered = app.courses.filter(course => (semester === 'all' || course.semester === semester) &&
    `${course.name} ${course.code}`.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')));
  return <ScreenContainer>
    {page.loading ? <LoadingView /> : page.error && !app.queries.courses.data
      ? <ErrorView message={page.error.message} onRetry={page.refresh} />
      : <FlatList data={filtered} keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content} refreshing={page.refreshing} onRefresh={page.refresh}
        ListHeaderComponent={<View style={styles.header}>
          <Text style={styles.title}>Môn học</Text><Text style={styles.subtitle}>Tra cứu theo tên, mã môn và học kỳ.</Text>
          {page.isOnline === false ? <LastUpdatedText timestamp={page.lastUpdated} /> : null}
          {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
          <SearchBar value={search} onChangeText={setSearch} placeholder="Tìm tên hoặc mã môn" />
          <FilterChips options={[{label: 'Tất cả', value: 'all'}, ...semesters.map(value => ({label: value, value}))]}
            selected={semester} onSelect={setSemester} /></View>}
        renderItem={({item}) => <CourseCard course={item} onPress={() => navigation.navigate(ROUTES.COURSE_DETAIL, {id: item.id})} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState title="Không tìm thấy môn học" description="Thử tên khác hoặc chọn học kỳ khác." />}
      />}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  content: {padding: spacing.lg, paddingBottom: spacing.xxl}, header: {gap: spacing.md, paddingBottom: spacing.lg},
  title: {...typography.h1, color: colors.text}, subtitle: {...typography.body, color: colors.textMuted},
  separator: {height: spacing.md},
});
