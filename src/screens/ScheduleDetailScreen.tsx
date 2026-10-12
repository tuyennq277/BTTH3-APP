import React, {useMemo} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types';
import {useStudy} from '../context/StudyContext';
import {
  getDayLabel,
  getScheduleSessionStatus,
  getSessionStatusMeta,
} from '../utils/studyHelpers';
import {EmptyState} from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleDetail'>;

export const ScheduleDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {scheduleId} = route.params;
  const {schedules, courses} = useStudy();

  const scheduleItem = useMemo(
    () => schedules.find(s => s.id === scheduleId),
    [schedules, scheduleId],
  );

  const relatedCourse = useMemo(
    () =>
      scheduleItem
        ? courses.find(c => c.id === scheduleItem.courseId)
        : undefined,
    [courses, scheduleItem],
  );

  if (!scheduleItem) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="🗓️"
          title="Không tìm thấy buổi học"
          description="Buổi học không tồn tại trong thời khóa biểu."
          actionLabel="Quay lại"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const sessionStatus = getScheduleSessionStatus(scheduleItem);
  const statusMeta = getSessionStatusMeta(sessionStatus);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Thẻ tiêu đề buổi học */}
      <View style={styles.mainCard}>
        <View style={styles.topRow}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeBadgeText}>{scheduleItem.courseCode}</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              {backgroundColor: statusMeta.bgColor},
            ]}>
            <View
              style={[
                styles.statusDot,
                {backgroundColor: statusMeta.dotColor},
              ]}
            />
            <Text style={[styles.statusText, {color: statusMeta.color}]}>
              {statusMeta.label}
            </Text>
          </View>
        </View>

        <Text style={styles.courseTitle}>{scheduleItem.courseName}</Text>

        {/* Khung giờ và ngày học nổi bật */}
        <View style={styles.timeHighlightBox}>
          <View style={styles.timeCol}>
            <Text style={styles.timeBoxLabel}>Ngày học</Text>
            <Text style={styles.timeBoxValue}>
              {getDayLabel(scheduleItem.dayOfWeek)}
            </Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.timeCol}>
            <Text style={styles.timeBoxLabel}>Thời gian</Text>
            <Text style={styles.timeBoxValue}>
              {scheduleItem.startTime} - {scheduleItem.endTime}
            </Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.timeCol}>
            <Text style={styles.timeBoxLabel}>Ca học</Text>
            <Text style={styles.timeBoxValue}>{scheduleItem.periods}</Text>
          </View>
        </View>

        {/* Thông tin chi tiết địa điểm & giảng viên */}
        <View style={styles.detailRowsBox}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Phòng học:</Text>
            <Text style={styles.detailValue}>{scheduleItem.room}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🏢 Cơ sở đào tạo:</Text>
            <Text style={styles.detailValue}>{scheduleItem.campus}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>👨‍🏫 Giảng viên:</Text>
            <Text style={styles.detailValue}>{scheduleItem.instructor}</Text>
          </View>
          {relatedCourse && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🎓 Số tín chỉ:</Text>
              <Text style={styles.detailValue}>
                {relatedCourse.credits} tín chỉ ({relatedCourse.semester})
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Nội dung bài giảng và ghi chú */}
      <View style={styles.topicCard}>
        <Text style={styles.sectionHeader}>📖 Nội dung bài giảng trong buổi</Text>
        <Text style={styles.topicText}>{scheduleItem.topic}</Text>

        <View style={styles.noteBox}>
          <Text style={styles.noteTitle}>📌 Lưu ý & Chuẩn bị trước buổi học:</Text>
          <Text style={styles.noteContent}>{scheduleItem.notes}</Text>
        </View>
      </View>

      {/* Điều hướng sang Chi tiết môn học hoặc quay lại */}
      {relatedCourse && (
        <TouchableOpacity
          style={styles.courseButton}
          onPress={() =>
            navigation.navigate('CourseDetail', {courseId: relatedCourse.id})
          }
          activeOpacity={0.8}>
          <Text style={styles.courseButtonText}>
            📚 Xem chi tiết môn học {relatedCourse.code}
          </Text>
        </TouchableOpacity>
      )}

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
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeBadgeText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
    lineHeight: 27,
  },
  timeHighlightBox: {
    flexDirection: 'row',
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    paddingVertical: 13,
    paddingHorizontal: 10,
    marginBottom: 14,
    alignItems: 'center',
  },
  timeCol: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  timeBoxLabel: {
    fontSize: 11,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  timeBoxValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  detailRowsBox: {
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
    width: 130,
  },
  detailValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    textAlign: 'right',
  },
  topicCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  topicText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 14,
  },
  noteBox: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 4,
  },
  noteContent: {
    fontSize: 13,
    color: '#78350F',
    lineHeight: 19,
  },
  courseButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  courseButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
