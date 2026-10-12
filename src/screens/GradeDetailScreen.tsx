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
import {EmptyState} from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'GradeDetail'>;

export const GradeDetailScreen: React.FC<Props> = ({route, navigation}) => {
  const {gradeId, courseId} = route.params;
  const {grades, courses, student} = useStudy();

  const grade = useMemo(() => {
    if (gradeId) {
      return grades.find(g => g.id === gradeId);
    }
    if (courseId) {
      return grades.find(g => g.courseId === courseId);
    }
    return undefined;
  }, [grades, gradeId, courseId]);

  const relatedCourse = useMemo(
    () => (grade ? courses.find(c => c.id === grade.courseId) : undefined),
    [courses, grade],
  );

  if (!grade) {
    return (
      <View style={styles.centerContainer}>
        <EmptyState
          icon="📊"
          title="Không tìm thấy kết quả học tập"
          description="Bảng điểm của môn học này hiện chưa được cập nhật."
          actionLabel="Quay lại"
          onActionPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  const componentScores = [
    {
      label: 'Điểm chuyên cần',
      weight: '10%',
      score: grade.attendanceScore,
      color: '#10B981',
    },
    {
      label: 'Điểm bài tập / Thực hành',
      weight: '20%',
      score: grade.assignmentScore,
      color: '#3B82F6',
    },
    {
      label: 'Điểm kiểm tra giữa kỳ',
      weight: '20%',
      score: grade.midtermScore,
      color: '#6366F1',
    },
    {
      label: 'Điểm thi cuối kỳ',
      weight: '50%',
      score: grade.finalScore ?? 0,
      color: '#1D4ED8',
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Thẻ tổng quan điểm môn học */}
      <View style={styles.summaryBanner}>
        <View style={styles.bannerTop}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{grade.courseCode}</Text>
          </View>
          <View style={styles.passBadge}>
            <Text style={styles.passBadgeText}>
              {grade.isPassed ? '✓ ĐẠT HỌC PHẦN' : 'CHƯA ĐẠT'}
            </Text>
          </View>
        </View>

        <Text style={styles.courseTitle}>{grade.courseName}</Text>
        <Text style={styles.studentLine}>
          Sinh viên: {student.fullName} ({student.studentId}) • {grade.semester}
        </Text>

        <View style={styles.scoreBoxesRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreBoxLabel}>Hệ 10</Text>
            <Text style={styles.scoreBoxValue}>
              {grade.totalScore10.toFixed(1)}
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreBoxLabel}>Hệ 4</Text>
            <Text style={styles.scoreBoxValue}>
              {grade.totalScore4.toFixed(1)}
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreBoxLabel}>Điểm chữ</Text>
            <Text style={styles.scoreBoxValue}>{grade.letterGrade}</Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreBoxLabel}>Số tín chỉ</Text>
            <Text style={styles.scoreBoxValue}>{grade.credits}</Text>
          </View>
        </View>
      </View>

      {/* Bảng phân rã điểm thành phần */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          📈 Bảng điểm thành phần chi tiết
        </Text>
        <Text style={styles.sectionSubtitle}>
          Công thức tính: CC (10%) + BT (20%) + GK (20%) + CK (50%)
        </Text>

        <View style={styles.componentsList}>
          {componentScores.map((comp, idx) => {
            const widthPercent = Math.min(Math.max(comp.score * 10, 0), 100);
            return (
              <View key={idx} style={styles.compItem}>
                <View style={styles.compHeader}>
                  <Text style={styles.compLabel}>
                    {comp.label}{' '}
                    <Text style={styles.compWeight}>({comp.weight})</Text>
                  </Text>
                  <Text style={styles.compScoreText}>
                    {comp.score.toFixed(1)} / 10
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${widthPercent}%`,
                        backgroundColor: comp.color,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Nhận xét của giảng viên */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💬 Đánh giá của giảng viên</Text>
        {relatedCourse && (
          <Text style={styles.instructorLine}>
            Giảng viên phụ trách: {relatedCourse.instructor}
          </Text>
        )}
        <View style={styles.commentBox}>
          <Text style={styles.commentText}>“{grade.teacherComment}”</Text>
        </View>
      </View>

      {relatedCourse && (
        <TouchableOpacity
          style={styles.courseDetailBtn}
          onPress={() =>
            navigation.navigate('CourseDetail', {courseId: relatedCourse.id})
          }
          activeOpacity={0.8}>
          <Text style={styles.courseDetailBtnText}>
            📚 Xem thông tin môn học {relatedCourse.code}
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
  summaryBanner: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeBadge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  passBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  passBadgeText: {
    color: '#15803D',
    fontSize: 11.5,
    fontWeight: '800',
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 27,
  },
  studentLine: {
    fontSize: 12.5,
    color: '#BFDBFE',
    marginBottom: 16,
  },
  scoreBoxesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  scoreBoxLabel: {
    fontSize: 11,
    color: '#DBEAFE',
    marginBottom: 3,
  },
  scoreBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  card: {
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
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  componentsList: {
    gap: 14,
  },
  compItem: {
    gap: 6,
  },
  compHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  compWeight: {
    color: '#64748B',
    fontWeight: '500',
  },
  compScoreText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  instructorLine: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 10,
  },
  commentBox: {
    backgroundColor: '#F8FAFC',
    padding: 13,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  commentText: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: '#334155',
    lineHeight: 20,
  },
  courseDetailBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  courseDetailBtnText: {
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
