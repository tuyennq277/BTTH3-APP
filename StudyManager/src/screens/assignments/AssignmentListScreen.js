import React, {useState} from 'react';
import {Alert, FlatList, Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import EmptyState from '../../components/common/EmptyState';
import SearchBar from '../../components/common/SearchBar';
import FilterChips from '../../components/common/FilterChips';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import AppButton from '../../components/common/AppButton';
import AssignmentItem from '../../components/assignment/AssignmentItem';
import {useAppData} from '../../context/AppDataContext';
import usePageState from '../../hooks/usePageState';
import {isOverdue} from '../../utils/date';
import {ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

const filters = [{label: 'Tất cả', value: 'all'}, {label: 'Chưa xong', value: 'todo'},
  {label: 'Đã xong', value: 'done'}, {label: 'Quá hạn', value: 'overdue'}];
export default function AssignmentListScreen({navigation}) {
  const app = useAppData();
  const page = usePageState([app.queries.assignments]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState([]);
  const filtered = app.assignments.filter(item => item.title.toLocaleLowerCase('vi').includes(search.trim().toLocaleLowerCase('vi')) &&
    (filter === 'all' || (filter === 'overdue' ? isOverdue(item) : item.status === filter)));
  const toggle = async item => {
    if (busy.includes(item.id)) {return;}
    setBusy(old => [...old, item.id]);
    try {await app.toggleAssignment(item);} catch (error) {Alert.alert('Không lưu được', `${error.message} Đã hoàn tác thay đổi.`);}
    finally {setBusy(old => old.filter(id => id !== item.id));}
  };
  return <ScreenContainer>
    {page.loading ? <LoadingView /> : page.error && !app.queries.assignments.data
      ? <ErrorView message={page.error.message} onRetry={page.refresh} />
      : <FlatList data={filtered} keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.content} refreshing={page.refreshing} onRefresh={page.refresh}
        ListHeaderComponent={<View style={styles.header}><Text style={styles.title}>Bài tập</Text>
          {page.isOnline === false ? <LastUpdatedText timestamp={page.lastUpdated} /> : null}
          {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
          <AppButton title="Thêm bài tập" onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)} />
          <SearchBar value={search} onChangeText={setSearch} placeholder="Tìm bài tập" />
          <FilterChips options={filters} selected={filter} onSelect={setFilter} /></View>}
        renderItem={({item}) => <AssignmentItem assignment={item} pending={item._pending}
          onPress={() => navigation.navigate(ROUTES.ASSIGNMENT_DETAIL, {id: item.id})}
          onToggleStatus={() => toggle(item)} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyState title="Không có bài tập phù hợp" description="Thử bộ lọc khác hoặc thêm một bài tập mới."
          actionLabel="Thêm bài tập" onAction={() => navigation.navigate(ROUTES.ASSIGNMENT_FORM)} />}
      />}
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  content: {padding: spacing.lg, paddingBottom: spacing.xxl}, header: {gap: spacing.md, paddingBottom: spacing.lg},
  title: {...typography.h1, color: colors.text}, separator: {height: spacing.md},
});
