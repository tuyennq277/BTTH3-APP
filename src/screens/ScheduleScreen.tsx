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
  SessionStatus,
} from '../types';
import {useStudy} from '../context/StudyContext';
import {DAYS_OF_WEEK} from '../data/mockData';
import {
  getDayLabel,
  getScheduleSessionStatus,
  getTodayDayOfWeek,
} from '../utils/studyHelpers';
import {ScheduleCard} from '../components/ScheduleCard';
import {EmptyState} from '../components/EmptyState';

type ScheduleNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ScheduleTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<ScheduleNavProp>();
  const {schedules} = useStudy();

  const today = getTodayDayOfWeek();
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(today);
  const [statusFilter, setStatusFilter] = useState<
    'ALL' | 'completed' | 'upcoming'
  >('ALL');

  const daySchedules = useMemo(() => {
    return schedules
      .filter(s => s.dayOfWeek === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [schedules, selectedDay]);

  const filteredSchedules = useMemo(() => {
    if (statusFilter === 'ALL') {
      return daySchedules;
    }
    return daySchedules.filter(item => {
      const st: SessionStatus = getScheduleSessionStatus(item);
      if (statusFilter === 'completed') {
        return st === 'completed';
      }
      return st === 'upcoming' || st === 'ongoing';
    });
  }, [daySchedules, statusFilter]);

  const completedCount = useMemo(
    () =>
      daySchedules.filter(s => getScheduleSessionStatus(s) === 'completed')
        .length,
    [daySchedules],
  );

  const upcomingCount = useMemo(
    () =>
      daySchedules.filter(s => getScheduleSessionStatus(s) !== 'completed')
        .length,
    [daySchedules],
  );

  return (
    <View style={styles.container}>
      {/* Thanh chuyển đổi giữa các ngày trong tuần */}
      <View style={styles.topHeader}>
        <Text style={styles.headerSubtitle}>
          Chọn ngày trong tuần để xem lịch học chi tiết
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysScroll}>
          {DAYS_OF_WEEK.map(item => {
            const isSelected = item.day === selectedDay;
            const isToday = item.day === today;
            const countForDay = schedules.filter(
              s => s.dayOfWeek === item.day,
            ).length;

            return (
              <TouchableOpacity
                key={item.day}
                style={[
                  styles.dayTab,
                  isSelected && styles.dayTabActive,
                  !isSelected && isToday && styles.dayTabToday,
                ]}
                onPress={() => setSelectedDay(item.day)}
                activeOpacity={0.78}>
                <Text
                  style={[
                    styles.dayShortText,
                    isSelected && styles.dayTextActive,
                  ]}>
                  {item.shortLabel}
                </Text>
                <Text
                  style={[
                    styles.dayCountBadge,
                    isSelected && styles.dayCountBadgeActive,
                  ]}>
                  {countForDay} ca
                </Text>
                {isToday && (
                  <View
                    style={[
                      styles.todayDot,
                      isSelected && styles.todayDotActive,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Bộ lọc phân biệt các buổi học đã kết thúc và sắp diễn ra */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.statusChip,
              statusFilter === 'ALL' && styles.statusChipActive,
            ]}
            onPress={() => setStatusFilter('ALL')}>
            <Text
              style={[
                styles.statusChipText,
                statusFilter === 'ALL' && styles.statusChipTextActive,
              ]}>
              Tất cả ({daySchedules.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusChip,
              statusFilter === 'upcoming' && styles.statusChipUpcomingActive,
            ]}
            onPress={() => setStatusFilter('upcoming')}>
            <View style={[styles.legendDot, {backgroundColor: '#2563EB'}]} />
            <Text
              style={[
                styles.statusChipText,
                statusFilter === 'upcoming' &&
                  styles.statusChipUpcomingTextActive,
              ]}>
              Sắp diễn ra ({upcomingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusChip,
              statusFilter === 'completed' && styles.statusChipCompletedActive,
            ]}
            onPress={() => setStatusFilter('completed')}>
            <View style={[styles.legendDot, {backgroundColor: '#94A3B8'}]} />
            <Text
              style={[
                styles.statusChipText,
                statusFilter === 'completed' &&
                  styles.statusChipCompletedTextActive,
              ]}>
              Đã kết thúc ({completedCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách buổi học trong ngày bằng FlatList */}
      <FlatList
        data={filteredSchedules}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.dayBanner}>
            <Text style={styles.dayBannerTitle}>
              📌 Lịch học {getDayLabel(selectedDay)}
            </Text>
            <Text style={styles.dayBannerDesc}>
              Nhấn vào từng buổi học để xem nội dung bài giảng, phòng học và ghi chú
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <ScheduleCard
            item={item}
            sessionStatus={getScheduleSessionStatus(item)}
            showInstructor
            onPress={() =>
              navigation.navigate('ScheduleDetail', {scheduleId: item.id})
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🗓️"
            title="Không có buổi học nào"
            description={
              statusFilter === 'ALL'
                ? `Bạn không có lịch học vào ${getDayLabel(selectedDay)}.`
                : 'Không có buổi học nào thuộc trạng thái bạn đang lọc.'
            }
            actionLabel={
              statusFilter !== 'ALL' ? 'Xem tất cả buổi học' : undefined
            }
            onActionPress={
              statusFilter !== 'ALL' ? () => setStatusFilter('ALL') : undefined
            }
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  topHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 10,
    fontWeight: '500',
  },
  daysScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  dayTab: {
    width: 62,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  dayTabToday: {
    borderColor: '#60A5FA',
    backgroundColor: '#EFF6FF',
  },
  dayShortText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 3,
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  dayCountBadge: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  dayCountBadgeActive: {
    color: '#DBEAFE',
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#2563EB',
    marginTop: 4,
  },
  todayDotActive: {
    backgroundColor: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusChipActive: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  statusChipUpcomingActive: {
    backgroundColor: '#DBEAFE',
    borderColor: '#60A5FA',
  },
  statusChipCompletedActive: {
    backgroundColor: '#E2E8F0',
    borderColor: '#94A3B8',
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },
  statusChipText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  statusChipTextActive: {
    color: '#FFFFFF',
  },
  statusChipUpcomingTextActive: {
    color: '#1D4ED8',
    fontWeight: '700',
  },
  statusChipCompletedTextActive: {
    color: '#334155',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  dayBanner: {
    marginBottom: 12,
  },
  dayBannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  dayBannerDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
