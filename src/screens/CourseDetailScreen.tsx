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
import {getDayLabel} from '../utils/studyHelpers';
import {ScheduleCard} from '../components/ScheduleCard';
import {AssignmentCard} from '../components/AssignmentCard';
import {EmptyState} from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'CourseDetail'>;

export const CourseDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {courseId} = route.params;
  const {courses, schedules, assignments, grades} = useStudy();

  const course = useMemo(
    () => courses.find(c => c.id === courseId),
    [courses, courseId],
  );

  const courseSchedules = useMemo(
    () => schedules.filter(s => s.courseId === courseId),
    [schedules, courseId],
  );

  const courseAssignments = useMemo(
    () => assignments.filter(a => a.courseId === courseId),
    [assignments, courseId],
  );

  const courseGrade = useMemo(
    () => grades.find(g => g.courseId === courseId),
    [grades, courseId],
  );

  if (!course) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="⚠️"
          title="Không tìm thấy thông tin môn học"
          description="Môn học bạn chọn không tồn tại trong hệ thống."
          actionLabel="Quay lại"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Thẻ thông tin chung của môn học */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.codePill}>
            <Text style={styles.codePillText}>{course.code}</Text>
          </View>
          <View style={styles.semesterPill}>
            <Text style={styles.semesterPillText}>{course.semester}</Text>
          </View>
          <View style={styles.creditPill}>
            <Text style={styles.creditPillText}>{course.credits} tín chỉ</Text>
          </View>
        </View>

        <Text style={styles.courseTitle}>{course.name}</Text>

        <View style={styles.metaBox}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>👨‍🏫 Giảng viên phụ trách:</Text>
            <Text style={styles.metaValue}>{course.instructor}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>✉️ Email giảng viên:</Text>
            <Text style={styles.metaValue}>{course.instructorEmail}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>📍 Phòng học chính:</Text>
            <Text style={styles.metaValue}>{course.room}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>🗓️ Lịch học tóm tắt:</Text>
            <Text style={styles.metaValue}>{course.scheduleSummary}</Text>
          </View>
        </View>

        <View style={styles.descBox}>
          <Text style={styles.descTitle}>📖 Đề cương & Mô tả môn học</Text>
          <Text style={styles.descText}>{course.description}</Text>
        </View>
      </View>

      {/* Kết quả học tập liên quan */}
      <View style={styles.sectionBlock}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🏆 Kết quả học tập liên quan</Text>
          {courseGrade && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('GradeDetail', {
                  gradeId: courseGrade.id,
                  courseId: course.id,
                })
              }>
              <Text style={styles.linkText}>Xem bảng điểm ›</Text>
            </TouchableOpacity>
          )}
        </View>

        {courseGrade ? (
          <TouchableOpacity
            style={styles.gradeOverviewCard}
            onPress={() =>
              navigation.navigate('GradeDetail', {
                gradeId: courseGrade.id,
                courseId: course.id,
              })
            }
            activeOpacity={0.8}>
            <View style={styles.gradeColumnsRow}>
              <View style={styles.gradeCol}>
                <Text style={styles.gradeColLabel}>Chuyên cần</Text>
                <Text style={styles.gradeColValue}>
                  {courseGrade.attendanceScore.toFixed(1)}
                </Text>
              </View>
              <View style={styles.gradeCol}>
                <Text style={styles.gradeColLabel}>Bài tập</Text>
                <Text style={styles.gradeColValue}>
                  {courseGrade.assignmentScore.toFixed(1)}
                </Text>
              </View>
              <View style={styles.gradeCol}>
                <Text style={styles.gradeColLabel}>Giữa kỳ</Text>
                <Text style={styles.gradeColValue}>
                  {courseGrade.midtermScore.toFixed(1)}
                </Text>
              </View>
              <View style={styles.gradeCol}>
                <Text style={styles.gradeColLabel}>Cuối kỳ</Text>
                <Text style={styles.gradeColValue}>
                  {courseGrade.finalScore !== null
                    ? courseGrade.finalScore.toFixed(1)
                    : '-'}
                </Text>
              </View>
            </View>

            <View style={styles.gradeSummaryFooter}>
              <Text style={styles.gradeSummaryLabel}>
                Điểm tổng kết:{' '}
                <Text style={styles.gradeTotalHighlight}>
                  {courseGrade.totalScore10.toFixed(1)} / 10
                </Text>{' '}
                (Hệ 4: {courseGrade.totalScore4.toFixed(1)} • Điểm chữ:{' '}
                {courseGrade.letterGrade})
              </Text>
              <Text style={styles.detailArrow}>Chi tiết ›</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <EmptyState
            icon="📊"
            title="Chưa cập nhật điểm"
            description="Môn học hiện chưa có bảng điểm tổng kết."
          />
        )}
      </View>

      {/* Lịch học của môn học */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          🗓️ Lịch học trong tuần ({courseSchedules.length} buổi)
        </Text>
        <Text style={styles.sectionHint}>
          Nhấn vào buổi học để xem chi tiết nội dung và phòng học
        </Text>

        {courseSchedules.length === 0 ? (
          <EmptyState
            icon="📅"
            title="Không có lịch học cố định tuần này"
            description="Môn học thuộc học kỳ trước đã kết thúc lịch học trên lớp."
          />
        ) : (
          courseSchedules.map(sched => (
            <View key={sched.id}>
              <Text style={styles.daySubHeader}>
                • {getDayLabel(sched.dayOfWeek)}
              </Text>
              <ScheduleCard
                item={sched}
                onPress={() =>
                  navigation.navigate('ScheduleDetail', {scheduleId: sched.id})
                }
              />
            </View>
          ))
        )}
      </View>

      {/* Danh sách bài tập thuộc môn học */}
      <View style={styles.sectionBlock}>
        <Text style={styles.sectionTitle}>
          📝 Danh sách bài tập ({courseAssignments.length})
        </Text>
        <Text style={styles.sectionHint}>
          Nhấn vào bài tập để xem yêu cầu chi tiết và cập nhật trạng thái
        </Text>

        {courseAssignments.length === 0 ? (
          <EmptyState
            icon="✅"
            title="Không có bài tập nào"
            description="Môn học này hiện không có bài tập cần nộp."
          />
        ) : (
          courseAssignments.map(assign => (
            <AssignmentCard
              key={assign.id}
              assignment={assign}
              compact
              onPress={() =>
                navigation.navigate('AssignmentDetail', {
                  assignmentId: assign.id,
                })
              }
            />
          ))
        )}
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
    paddingBottom: 36,
  },
  centerContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  codePill: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codePillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  semesterPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  semesterPillText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '600',
  },
  creditPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  creditPillText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
    lineHeight: 27,
  },
  metaBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  metaLabel: {
    fontSize: 12.5,
    color: '#64748B',
    width: 145,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  descBox: {
    paddingTop: 4,
  },
  descTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 5,
  },
  descText: {
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
  },
  sectionBlock: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionHint: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  gradeOverviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  gradeColumnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  gradeCol: {
    flex: 1,
    alignItems: 'center',
  },
  gradeColLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 4,
  },
  gradeColValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  gradeSummaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  gradeSummaryLabel: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  gradeTotalHighlight: {
    color: '#1D4ED8',
    fontWeight: '800',
  },
  detailArrow: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  daySubHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginLeft: 4,
  },
  backButton: {
    marginTop: 4,
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
