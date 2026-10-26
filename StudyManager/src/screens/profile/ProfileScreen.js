import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import ScreenContainer from '../../components/common/ScreenContainer';
import LoadingView from '../../components/common/LoadingView';
import ErrorView from '../../components/common/ErrorView';
import LastUpdatedText from '../../components/common/LastUpdatedText';
import SyncBadge from '../../components/common/SyncBadge';
import AppButton from '../../components/common/AppButton';
import GpaSummary from '../../components/grade/GpaSummary';
import InfoRow from '../../components/profile/InfoRow';
import {useAppData} from '../../context/AppDataContext';
import usePageState from '../../hooks/usePageState';
import {calcGpa} from '../../utils/gpa';
import {ROUTES} from '../../navigation/routes';
import colors from '../../theme/colors';
import spacing from '../../theme/spacing';
import typography from '../../theme/typography';

export default function ProfileScreen({navigation}) {
  const app = useAppData();
  const page = usePageState([app.queries.student, app.queries.grades, app.queries.courses]);
  if (page.loading && !app.student) {return <ScreenContainer><LoadingView /></ScreenContainer>;}
  if (!app.student) {return <ScreenContainer><ErrorView message={page.error?.message || 'Chưa có hồ sơ trên thiết bị.'} onRetry={page.refresh} /></ScreenContainer>;}
  const result = calcGpa(app.grades, app.courses);
  return <ScreenContainer scroll>
    <Text style={styles.title}>Cá nhân</Text>
    {page.isOnline === false ? <LastUpdatedText timestamp={page.lastUpdated} /> : null}
    {page.error ? <ErrorView message={page.error.message} onRetry={page.refresh} /> : null}
    <View style={styles.card}>
      <Text style={styles.name}>{app.student.fullName}</Text><SyncBadge pending={app.student._pending} />
      <InfoRow label="Mã sinh viên" value={app.student.studentCode} />
      <InfoRow label="Lớp" value={app.student.className} />
      <InfoRow label="Ngành" value={app.student.major} />
      <InfoRow label="Email" value={app.student.email} />
      <InfoRow label="Số điện thoại" value={app.student.phone} />
      <AppButton title="Chỉnh sửa thông tin" variant="outline" onPress={() => navigation.navigate(ROUTES.EDIT_PROFILE)} />
    </View>
    <Text style={styles.section}>Kết quả học tập</Text>
    <GpaSummary gpa={result.gpa} totalCredits={result.totalCredits} />
    <AppButton title="Xem bảng điểm" onPress={() => navigation.navigate(ROUTES.GRADE_LIST)} />
  </ScreenContainer>;
}
const styles = StyleSheet.create({
  title: {...typography.h1, color: colors.text}, name: {...typography.h2, color: colors.text},
  section: {...typography.h2, color: colors.text, marginTop: spacing.md},
  card: {backgroundColor: colors.surface, padding: spacing.lg, gap: spacing.sm,
    borderWidth: spacing.border, borderColor: colors.border, borderRadius: spacing.radius},
});
