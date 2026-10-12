import React, {useMemo, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  DayOfWeek,
  MainTabParamList,
  RootStackParamList,
} from '../types';
import {useStudy} from '../context/StudyContext';
import {DAYS_OF_WEEK} from '../data/mockData';
import {
  getDayLabel,
  getDaysRemaining,
  getTodayDayOfWeek,
} from '../utils/studyHelpers';
import {ScheduleCard} from '../components/ScheduleCard';
import {AssignmentCard} from '../components/AssignmentCard';
import {CourseCard} from '../components/CourseCard';
import {EmptyState} from '../components/EmptyState';

type DashboardNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'DashboardTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardNavProp>();
  const {
    student,
    currentSemesterCourses,
    schedules,
    assignments,
    currentSemesterGPA,
    incompleteAssignmentsCount,
  } = useStudy();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(
    getTodayDayOfWeek(),
  );

  // Lịch học trong ngày được chọn
  const todaySchedules = useMemo(() => {
    return schedules
      .filter(s => s.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, selectedDay]);

  // Các bài tập sắp đến hạn nộp (ưu tiên bài tập chưa hoàn thành & sắp xếp theo hạn nộp gần nhất)
  const upcomingAssignments = useMemo(() => {
    return assignments
      .filter(a => a.status !== 'completed')
      .sort((a, b) => getDaysRemaining(a.dueDate) - getDaysRemaining(b.dueDate))
      .slice(0, 4);
  }, [assignments]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Thẻ thông tin sinh viên */}
      <View style={styles.studentBanner}>
        <View style={styles.studentTopRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>
              {student.fullName
                .split(' ')
                .slice(-2)
                .map(w => w[0])
                .join('')}
            </Text>
          </View>
          <View style={styles.studentInfoBox}>
            <Text style={styles.greetingText}>Xin chào sinh viên 👋</Text>
            <Text style={styles.studentName}>{student.fullName}</Text>
            <View style={styles.studentBadgeRow}>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>
                  MSSV: {student.studentId}
                </Text>
              </View>
              <View style={styles.infoPill}>
                <Text style={styles.infoPillText}>
                  Lớp: {student.className}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.semesterBar}>
          <Text style={styles.semesterBarLabel}>
            🎓 Học kỳ hiện tại: {student.currentSemester}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileTab')}
            activeOpacity={0.8}>
            <Text style={styles.semesterBarAction}>Hồ sơ & Điểm ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Thống kê nhanh: Điểm trung bình học kỳ & Số bài tập chưa hoàn thành */}
      <View style={styles.statsRow}>
        <TouchableOpacity
          style={[styles.statCard, styles.statCardBlue]}
          onPress={() => navigation.navigate('ProfileTab')}
          activeOpacity={0.85}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statValue}>
            {currentSemesterGPA.gpa10.toFixed(2)}
            <Text style={styles.statSubValue}> / 10</Text>
          </Text>
          <Text style={styles.statLabel}>Điểm TB học kỳ</Text>
          <Text style={styles.statHint}>
            Hệ 4: {currentSemesterGPA.gpa4.toFixed(2)} ({currentSemesterGPA.totalCredits} TC)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statCard, styles.statCardAmber]}
          onPress={() => navigation.navigate('AssignmentsTab')}
          activeOpacity={0.85}>
          <Text style={styles.statIcon}>📝</Text>
          <Text style={[styles.statValue, styles.statValueAmber]}>
            {incompleteAssignmentsCount}
            <Text style={styles.statSubValue}> bài</Text>
          </Text>
          <Text style={styles.statLabel}>Bài tập chưa hoàn thành</Text>
          <Text style={styles.statHint}>Nhấn để xử lý ngay ›</Text>
        </TouchableOpacity>
      </View>

      {/* Lịch học trong ngày */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            📅 Lịch học trong ngày ({getDayLabel(selectedDay)})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Hiển thị tên môn học, thời gian và phòng học
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('ScheduleTab')}
          activeOpacity={0.75}>
          <Text style={styles.seeAllText}>Cả tuần ›</Text>
        </TouchableOpacity>
      </View>

      {/* Thanh chọn nhanh ngày trên Dashboard */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daySelectorRow}>
        {DAYS_OF_WEEK.map(d => {
          const active = d.day === selectedDay;
          return (
            <TouchableOpacity
              key={d.day}
              style={[styles.dayChip, active && styles.dayChipActive]}
              onPress={() => setSelectedDay(d.day)}
              activeOpacity={0.75}>
              <Text
                style={[
                  styles.dayChipText,
                  active && styles.dayChipTextActive,
                ]}>
                {d.shortLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {todaySchedules.length === 0 ? (
        <EmptyState
          icon="🎉"
          title="Không có lịch học trong ngày này"
          description="Bạn có thể dành thời gian ôn bài hoặc hoàn thành các bài tập sắp đến hạn."
        />
      ) : (
        todaySchedules.map(item => (
          <ScheduleCard
            key={item.id}
            item={item}
            onPress={() =>
              navigation.navigate('ScheduleDetail', {scheduleId: item.id})
            }
          />
        ))
      )}

      {/* Các bài tập sắp đến hạn nộp */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>⏰ Bài tập sắp đến hạn nộp</Text>
          <Text style={styles.sectionSubtitle}>
            Nhấn vào bài tập để xem chi tiết hoặc cập nhật trạng thái
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('AssignmentsTab')}
          activeOpacity={0.75}>
          <Text style={styles.seeAllText}>Tất cả ›</Text>
        </TouchableOpacity>
      </View>

      {upcomingAssignments.length === 0 ? (
        <EmptyState
          icon="✅"
          title="Tuyệt vời! Bạn đã hoàn thành hết bài tập"
          description="Hiện không còn bài tập nào đang chờ xử lý."
        />
      ) : (
        upcomingAssignments.map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            compact
            onPress={() =>
              navigation.navigate('AssignmentDetail', {
                assignmentId: assignment.id,
              })
            }
          />
        ))
      )}

      {/* Danh sách môn học đang học trong học kỳ */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>
            📚 Môn học trong học kỳ ({currentSemesterCourses.length})
          </Text>
          <Text style={styles.sectionSubtitle}>
            Học kỳ {student.currentSemester} — Nhấn vào môn học để xem chi tiết
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CoursesTab')}
          activeOpacity={0.75}>
          <Text style={styles.seeAllText}>Xem hết ›</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentSemesterCourses}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        renderItem={({item}) => (
          <CourseCard
            course={item}
            compact
            onPress={() =>
              navigation.navigate('CourseDetail', {courseId: item.id})
            }
          />
        )}
      />
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
  studentBanner: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 5,
  },
  studentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#3B82F6',
    borderWidth: 2,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitials: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  studentInfoBox: {
    flex: 1,
  },
  greetingText: {
    fontSize: 12.5,
    color: '#BFDBFE',
    marginBottom: 2,
    fontWeight: '500',
  },
  studentName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  studentBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoPillText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  semesterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.16)',
  },
  semesterBarLabel: {
    color: '#DBEAFE',
    fontSize: 12.5,
    fontWeight: '600',
  },
  semesterBarAction: {
    color: '#93C5FD',
    fontSize: 12.5,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  statCardBlue: {
    borderColor: '#BFDBFE',
  },
  statCardAmber: {
    borderColor: '#FDE68A',
  },
  statIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  statValueAmber: {
    color: '#D97706',
  },
  statSubValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 4,
  },
  statHint: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  daySelectorRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  dayChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dayChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dayChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
});
