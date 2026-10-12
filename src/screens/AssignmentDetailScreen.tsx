import React, {useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AssignmentStatus, RootStackParamList} from '../types';
import {useStudy} from '../context/StudyContext';
import {
  formatVietnameseDate,
  getAssignmentStatusMeta,
  getDaysRemaining,
  isAssignmentDueSoon,
  isAssignmentOverdue,
} from '../utils/studyHelpers';
import {EmptyState} from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'AssignmentDetail'>;

const STATUS_ACTIONS: {status: AssignmentStatus; label: string; icon: string}[] =
  [
    {status: 'todo', label: 'Chưa thực hiện', icon: '⏳'},
    {status: 'in_progress', label: 'Đang thực hiện', icon: '⚡'},
    {status: 'completed', label: 'Đã hoàn thành', icon: '✅'},
    {status: 'overdue', label: 'Quá hạn', icon: '⚠️'},
  ];

export const AssignmentDetailScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const {assignmentId} = route.params;
  const {assignments, updateAssignmentStatus} = useStudy();
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const assignment = useMemo(
    () => assignments.find(a => a.id === assignmentId),
    [assignments, assignmentId],
  );

  if (!assignment) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="📝"
          title="Không tìm thấy bài tập"
          description="Bài tập bạn chọn không tồn tại."
          actionLabel="Quay lại"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const statusMeta = getAssignmentStatusMeta(assignment.status);
  const dueSoon = isAssignmentDueSoon(assignment);
  const overdue = isAssignmentOverdue(assignment);
  const daysRemaining = getDaysRemaining(assignment.dueDate);

  const handleSelectStatus = async (newStatus: AssignmentStatus) => {
    await updateAssignmentStatus(assignment.id, newStatus);
    const meta = getAssignmentStatusMeta(newStatus);
    setFeedbackMsg(`Đã cập nhật trạng thái thành "${meta.label}"`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Cảnh báo nổi bật nếu sắp đến hạn hoặc quá hạn */}
      {overdue && (
        <View style={styles.overdueBanner}>
          <Text style={styles.overdueTitle}>⚠️ BÀI TẬP ĐÃ QUÁ HẠN NỘP</Text>
          <Text style={styles.overdueDesc}>
            Đã quá hạn {Math.abs(daysRemaining)} ngày so với thời hạn nộp bài. Vui lòng hoàn thành và liên hệ giảng viên.
          </Text>
        </View>
      )}

      {!overdue && dueSoon && (
        <View style={styles.dueSoonBanner}>
          <Text style={styles.dueSoonTitle}>🔥 BÀI TẬP SẮP ĐẾN HẠN NỘP</Text>
          <Text style={styles.dueSoonDesc}>
            Chỉ còn {daysRemaining === 0 ? 'hôm nay' : `${daysRemaining} ngày`} nữa là đến hạn nộp. Hãy ưu tiên hoàn thành sớm!
          </Text>
        </View>
      )}

      {/* Thẻ thông tin chính của bài tập */}
      <View style={styles.mainCard}>
        <View style={styles.topRow}>
          <TouchableOpacity
            style={styles.courseTag}
            onPress={() =>
              navigation.navigate('CourseDetail', {
                courseId: assignment.courseId,
              })
            }>
            <Text style={styles.courseTagText}>
              📚 {assignment.courseCode} • {assignment.courseName} ›
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.assignmentTitle}>{assignment.title}</Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>⏰ Thời hạn nộp:</Text>
            <Text
              style={[
                styles.metaValue,
                overdue && {color: '#DC2626'},
                dueSoon && {color: '#D97706'},
              ]}>
              {formatVietnameseDate(assignment.dueDate)} - {assignment.dueTime}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>📊 Trọng số điểm:</Text>
            <Text style={styles.metaValue}>
              {assignment.weightPercent}% điểm bài tập môn học
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>📌 Trạng thái hiện tại:</Text>
            <View
              style={[
                styles.currentStatusBadge,
                {
                  backgroundColor: statusMeta.bgColor,
                  borderColor: statusMeta.borderColor,
                },
              ]}>
              <Text
                style={[styles.currentStatusText, {color: statusMeta.color}]}>
                {statusMeta.label}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Mô tả chi tiết & Yêu cầu bài tập */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>📖 Mô tả chi tiết bài tập</Text>
        <Text style={styles.descriptionText}>{assignment.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>
          ✅ Các yêu cầu cần thực hiện ({assignment.requirements.length})
        </Text>
        <View style={styles.reqList}>
          {assignment.requirements.map((req, index) => (
            <View key={index} style={styles.reqItem}>
              <View style={styles.reqNumberCircle}>
                <Text style={styles.reqNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.reqText}>{req}</Text>
            </View>
          ))}
        </View>

        <View style={styles.submissionBox}>
          <Text style={styles.submissionLabel}>📤 Hình thức nộp bài:</Text>
          <Text style={styles.submissionValue}>
            {assignment.submissionFormat}
          </Text>
        </View>
      </View>

      {/* Khu vực cập nhật trạng thái bài tập */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>🔄 Cập nhật trạng thái bài tập</Text>
        <Text style={styles.sectionSubtitle}>
          Chọn trạng thái bên dưới để lưu tiến độ thực hiện (tự động đồng bộ với màn hình Tổng quan & Bài tập)
        </Text>

        {feedbackMsg.length > 0 && (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{feedbackMsg}</Text>
          </View>
        )}

        <View style={styles.statusButtonsGrid}>
          {STATUS_ACTIONS.map(item => {
            const isSelected = assignment.status === item.status;
            const meta = getAssignmentStatusMeta(item.status);
            return (
              <TouchableOpacity
                key={item.status}
                style={[
                  styles.statusOptionBtn,
                  isSelected && {
                    backgroundColor: meta.bgColor,
                    borderColor: meta.color,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => handleSelectStatus(item.status)}
                activeOpacity={0.78}>
                <Text style={styles.statusOptionIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.statusOptionLabel,
                    isSelected && {color: meta.color, fontWeight: '800'},
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Nút quay lại màn hình trước đó */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}>
        <Text style={styles.backButtonText}>‹ Quay lại màn hình trước</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  overdueBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#EF4444',
  },
  overdueTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#B91C1C',
    marginBottom: 4,
  },
  overdueDesc: {
    fontSize: 12.5,
    color: '#991B1B',
    lineHeight: 18,
  },
  dueSoonBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  dueSoonTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#B45309',
    marginBottom: 4,
  },
  dueSoonDesc: {
    fontSize: 12.5,
    color: '#92400E',
    lineHeight: 18,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    marginBottom: 10,
  },
  courseTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  courseTagText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  assignmentTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 26,
    marginBottom: 14,
  },
  metaGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  metaValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  currentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  currentStatusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 18,
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  reqList: {
    gap: 10,
    marginTop: 6,
    marginBottom: 14,
  },
  reqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reqNumberCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  reqNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  reqText: {
    flex: 1,
    fontSize: 13.5,
    color: '#1E293B',
    lineHeight: 20,
  },
  submissionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  submissionLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 3,
  },
  submissionValue: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  feedbackBanner: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  feedbackText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803D',
  },
  statusButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statusOptionBtn: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  statusOptionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  statusOptionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
  },
  backButton: {
    backgroundColor: '#1E293B',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
