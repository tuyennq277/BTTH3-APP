import React, {useEffect, useState} from 'react';
import {Alert, Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import StatusToggle from '../../components/assignment/StatusToggle';
import {useAppData} from '../../context/AppDataContext';
import useDetail from '../../hooks/useDetail';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import {formatDateTime, isOverdue} from '../../utils/date';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function AssignmentDetailScreen({route, navigation}) {
  const app = useAppData();
  const query = useDetail('assignments', route.params.id);
  const {isOnline} = useNetworkStatus();
  const [saving, setSaving] = useState(false);
  const assignment = query.data;
  useEffect(() => {if (assignment?.title) {navigation.setOptions({title: assignment.title});}}, [assignment?.title, navigation]);
  if (query.loading) {return <ScreenContainer><LoadingView /></ScreenContainer>;}
  if (!assignment) {return <ScreenContainer><ErrorView message={query.error?.message || 'Không tìm thấy bài tập.'} onRetry={query.refresh} /></ScreenContainer>;}
  const toggle = async () => {
    if (saving) {return;}
    setSaving(true);
    try {await app.toggleAssignment(assignment);} catch (e) {Alert.alert('Không lưu được', `${e.message} Đã hoàn tác thay đổi.`);}
    finally {setSaving(false);}
  };
  return <ScreenContainer scroll>
    <Text style={styles.title}>{assignment.title}</Text>
    <Text style={styles.subtitle}>{assignment.course?.name || 'Môn học'}</Text>
    <SyncBadge pending={assignment._pending} />
    {isOnline === false ? <LastUpdatedText timestamp={query.lastUpdated} /> : null}
    {query.error ? <ErrorView message={query.error.message} onRetry={query.refresh} /> : null}
    <View style={styles.card}><Text style={styles.label}>Hạn nộp</Text>
      <Text style={[styles.body, isOverdue(assignment) && styles.overdue]}>{formatDateTime(assignment.dueDate)}</Text>
      <Text style={styles.label}>Trạng thái</Text><StatusToggle status={assignment.status} onToggle={toggle} />
      <Text style={styles.label}>Mô tả</Text><Text style={styles.body}>{assignment.description || 'Không có mô tả.'}</Text></View>
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  title: {...typography.h1, color: colors.text}, subtitle: {...typography.body, color: colors.textMuted},
  card: {padding: spacing.lg, borderRadius: spacing.radius, backgroundColor: colors.surface,
    borderWidth: spacing.border, borderColor: colors.border, gap: spacing.sm},
  label: {...typography.small, color: colors.textMuted}, body: {...typography.body, color: colors.text},
  overdue: {color: colors.danger},
});
