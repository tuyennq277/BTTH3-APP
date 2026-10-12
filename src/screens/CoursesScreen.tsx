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
import {MainTabParamList, RootStackParamList, Semester} from '../types';
import {useStudy} from '../context/StudyContext';
import {SEMESTERS} from '../data/mockData';
import {CourseCard} from '../components/CourseCard';
import {EmptyState} from '../components/EmptyState';

type CoursesNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'CoursesTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const CoursesScreen: React.FC = () => {
  const navigation = useNavigation<CoursesNavProp>();
  const {courses} = useStudy();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<'ALL' | Semester>(
    'ALL',
  );

  const filteredCourses = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return courses.filter(course => {
      const matchSemester =
        selectedSemester === 'ALL' || course.semester === selectedSemester;
      const matchKeyword =
        keyword.length === 0 ||
        course.code.toLowerCase().includes(keyword) ||
        course.name.toLowerCase().includes(keyword) ||
        course.instructor.toLowerCase().includes(keyword);
      return matchSemester && matchKeyword;
    });
  }, [courses, searchQuery, selectedSemester]);

  const totalFilteredCredits = useMemo(
    () => filteredCourses.reduce((sum, c) => sum + c.credits, 0),
    [filteredCourses],
  );

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedSemester('ALL');
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm theo mã hoặc tên môn học */}
      <View style={styles.filterSection}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo mã môn (RIPT1412) hoặc tên môn học..."
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

        {/* Bộ lọc theo học kỳ */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semesterChipsRow}>
          <TouchableOpacity
            style={[
              styles.semesterChip,
              selectedSemester === 'ALL' && styles.semesterChipActive,
            ]}
            onPress={() => setSelectedSemester('ALL')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.semesterChipText,
                selectedSemester === 'ALL' && styles.semesterChipTextActive,
              ]}>
              Tất cả ({courses.length})
            </Text>
          </TouchableOpacity>

          {SEMESTERS.map(sem => {
            const isSelected = selectedSemester === sem;
            const count = courses.filter(c => c.semester === sem).length;
            return (
              <TouchableOpacity
                key={sem}
                style={[
                  styles.semesterChip,
                  isSelected && styles.semesterChipActive,
                ]}
                onPress={() => setSelectedSemester(sem)}
                activeOpacity={0.75}>
                <Text
                  style={[
                    styles.semesterChipText,
                    isSelected && styles.semesterChipTextActive,
                  ]}>
                  {sem} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tóm tắt kết quả lọc */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryText}>
            Hiển thị <Text style={styles.summaryBold}>{filteredCourses.length}</Text>{' '}
            môn học • Tổng{' '}
            <Text style={styles.summaryBold}>{totalFilteredCredits}</Text> tín chỉ
          </Text>
          {(searchQuery.length > 0 || selectedSemester !== 'ALL') && (
            <TouchableOpacity onPress={handleResetFilter}>
              <Text style={styles.resetText}>Xóa bộ lọc</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Danh sách môn học bằng FlatList */}
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <CourseCard
            course={item}
            onPress={() =>
              navigation.navigate('CourseDetail', {courseId: item.id})
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="🔍"
            title="Không tìm thấy môn học phù hợp"
            description="Không có môn học nào khớp với từ khóa hoặc học kỳ bạn đã chọn."
            actionLabel="Hiển thị tất cả môn học"
            onActionPress={handleResetFilter}
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
  filterSection: {
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
  semesterChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  semesterChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  semesterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  semesterChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  semesterChipTextActive: {
    color: '#FFFFFF',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  summaryText: {
    fontSize: 12.5,
    color: '#64748B',
  },
  summaryBold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  resetText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
});
