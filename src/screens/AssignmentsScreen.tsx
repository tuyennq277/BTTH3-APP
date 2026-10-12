import React, {useMemo, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {CompositeNavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  AssignmentStatus,
  MainTabParamList,
  RootStackParamList,
} from '../types';
import {useStudy} from '../context/StudyContext';
import {
  getDaysRemaining,
  isAssignmentDueSoon,
  isAssignmentOverdue,
} from '../utils/studyHelpers';
import {AssignmentCard} from '../components/AssignmentCard';
import {EmptyState} from '../components/EmptyState';

type AssignmentsNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'AssignmentsTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

const FILTER_TABS: {key: 'ALL' | AssignmentStatus; label: string}[] = [
  {key: 'ALL', label: 'Tất cả'},
  {key: 'todo', label: 'Chưa thực hiện'},
  {key: 'in_progress', label: 'Đang thực hiện'},
  {key: 'completed', label: 'Đã hoàn thành'},
  {key: 'overdue', label: 'Quá hạn'},
];

export const AssignmentsScreen: React.FC = () => {
  const navigation = useNavigation<AssignmentsNavProp>();
  const {assignments, updateAssignmentStatus} = useStudy();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<
    'ALL' | AssignmentStatus
  >('ALL');

  const filteredAssignments = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return assignments
      .filter(item => {
        const matchStatus =
          selectedStatus === 'ALL' || item.status === selectedStatus;
        const matchSearch =
          keyword.length === 0 ||
          item.title.toLowerCase().includes(keyword) ||
          item.courseName.toLowerCase().includes(keyword) ||
          item.courseCode.toLowerCase().includes(keyword);
        return matchStatus && matchSearch;
      })
      .sort((a, b) => getDaysRemaining(a.dueDate) - getDaysRemaining(b.dueDate));
  }, [assignments, searchQuery, selectedStatus]);

  const urgentStats = useMemo(() => {
    const dueSoonCount = assignments.filter(isAssignmentDueSoon).length;
    const overdueCount = assignments.filter(isAssignmentOverdue).length;
    return {dueSoonCount, overdueCount};
  }, [assignments]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('ALL');
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterHeader}>
        {/* Ô tìm kiếm bài tập theo tên */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm bài tập theo tên hoặc môn học..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bộ lọc theo trạng thái: Chưa thực hiện, Đang thực hiện, Đã hoàn thành, Quá hạn */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusTabsRow}>
          {FILTER_TABS.map(tab => {
            const isSelected = selectedStatus === tab.key;
            const count =
              tab.key === 'ALL'
                ? assignments.length
                : assignments.filter(a => a.status === tab.key).length;

            return (
              <TouchableOpacity
                key={tab.key}
                style={[
                  styles.statusTab,
                  isSelected && styles.statusTabActive,
                ]}
                onPress={() => setSelectedStatus(tab.key)}
                activeOpacity={0.75}>
                <Text
                  style={[
                    styles.statusTabText,
                    isSelected && styles.statusTabTextActive,
                  ]}>
                  {tab.label} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Thanh tóm tắt bài tập sắp đến hạn / quá hạn */}
        <View style={styles.alertSummaryRow}>
          <View style={styles.alertBadgeAmber}>
            <Text style={styles.alertBadgeAmberText}>
              🔥 Sắp đến hạn: {urgentStats.dueSoonCount}
            </Text>
          </View>
          <View style={styles.alertBadgeRed}>
            <Text style={styles.alertBadgeRedText}>
              ⚠️ Đã quá hạn: {urgentStats.overdueCount}
            </Text>
          </View>
        </View>
      </View>

      {/* Danh sách bài tập bằng FlatList */}
      <FlatList
        data={filteredAssignments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <AssignmentCard
            assignment={item}
            onStatusChange={newStatus =>
              updateAssignmentStatus(item.id, newStatus)
            }
            onPress={() =>
              navigation.navigate('AssignmentDetail', {assignmentId: item.id})
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="Không tìm thấy bài tập nào"
            description="Không có bài tập nào khớp với tên tìm kiếm hoặc trạng thái đã chọn."
            actionLabel="Đặt lại bộ lọc"
            onActionPress={handleResetFilters}
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
  filterHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '700',
  },
  statusTabsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10,
  },
  statusTab: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusTabActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  statusTabText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  statusTabTextActive: {
    color: '#FFFFFF',
  },
  alertSummaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  alertBadgeAmber: {
    flex: 1,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  alertBadgeAmberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  alertBadgeRed: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  alertBadgeRedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
});
