import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
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
  CourseGrade,
  MainTabParamList,
  RootStackParamList,
  Semester,
} from '../types';
import {useStudy} from '../context/StudyContext';
import {SEMESTERS} from '../data/mockData';
import {calculateGPA} from '../utils/studyHelpers';
import {EmptyState} from '../components/EmptyState';

type ProfileNavProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'ProfileTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavProp>();
  const {
    student,
    grades,
    currentSemesterGPA,
    cumulativeGPA,
    updateContactInfo,
    resetAllData,
  } = useStudy();

  const [isEditingContact, setIsEditingContact] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(student.email);
  const [phoneInput, setPhoneInput] = useState<string>(student.phone);
  const [contactError, setContactError] = useState<string>('');
  const [saveMessage, setSaveMessage] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<'ALL' | Semester>(
    'ALL',
  );

  useEffect(() => {
    setEmailInput(student.email);
    setPhoneInput(student.phone);
  }, [student.email, student.phone]);

  const filteredGrades = useMemo(() => {
    if (selectedSemester === 'ALL') {
      return grades;
    }
    return grades.filter(g => g.semester === selectedSemester);
  }, [grades, selectedSemester]);

  const selectedSemesterStats = useMemo(
    () => calculateGPA(filteredGrades),
    [filteredGrades],
  );

  const handleSaveContact = async () => {
    const trimmedEmail = emailInput.trim();
    const trimmedPhone = phoneInput.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,11}$/;

    if (!emailRegex.test(trimmedEmail)) {
      setContactError('Email không hợp lệ. Vui lòng nhập đúng định dạng email.');
      return;
    }
    if (!phoneRegex.test(trimmedPhone)) {
      setContactError('Số điện thoại phải gồm từ 9 đến 11 chữ số.');
      return;
    }

    setContactError('');
    await updateContactInfo(trimmedEmail, trimmedPhone);
    setIsEditingContact(false);
    setSaveMessage('✅ Đã lưu thông tin liên hệ thành công!');
    setTimeout(() => setSaveMessage(''), 3500);
  };

  const handleCancelEdit = () => {
    setEmailInput(student.email);
    setPhoneInput(student.phone);
    setContactError('');
    setIsEditingContact(false);
  };

  const handleResetDemo = () => {
    Alert.alert(
      'Khôi phục dữ liệu mẫu',
      'Bạn có muốn đặt lại thông tin liên hệ và trạng thái bài tập về mặc định ban đầu?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Khôi phục',
          style: 'destructive',
          onPress: () => {
            resetAllData();
          },
        },
      ],
    );
  };

  const renderGradeItem = ({item}: {item: CourseGrade}) => (
    <TouchableOpacity
      style={styles.gradeCard}
      onPress={() =>
        navigation.navigate('GradeDetail', {
          gradeId: item.id,
          courseId: item.courseId,
        })
      }
      activeOpacity={0.78}>
      <View style={styles.gradeLeft}>
        <View style={styles.gradeBadgeRow}>
          <Text style={styles.gradeCode}>{item.courseCode}</Text>
          <Text style={styles.gradeSemester}>• {item.semester}</Text>
          <View style={styles.creditPill}>
            <Text style={styles.creditPillText}>{item.credits} tín chỉ</Text>
          </View>
        </View>
        <Text style={styles.gradeCourseName} numberOfLines={2}>
          {item.courseName}
        </Text>
        <Text style={styles.gradeDetailHint}>
          CC: {item.attendanceScore} | BT: {item.assignmentScore} | GK:{' '}
          {item.midtermScore} | CK: {item.finalScore ?? '-'} › Xem chi tiết
        </Text>
      </View>

      <View style={styles.gradeRight}>
        <View style={styles.scoreCircle}>
          <Text style={styles.score10Text}>{item.totalScore10.toFixed(1)}</Text>
          <Text style={styles.letterGradeText}>{item.letterGrade}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={filteredGrades}
      keyExtractor={item => item.id}
      showsVerticalScrollIndicator={false}
      renderItem={renderGradeItem}
      ListHeaderComponent={
        <View>
          {/* Thẻ thông tin cá nhân sinh viên */}
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>
                  {student.fullName
                    .split(' ')
                    .slice(-2)
                    .map(w => w[0])
                    .join('')}
                </Text>
              </View>
              <View style={styles.profileTitleBox}>
                <Text style={styles.studentName}>{student.fullName}</Text>
                <Text style={styles.studentIdBadge}>
                  Mã SV: {student.studentId}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🎂 Ngày sinh:</Text>
                <Text style={styles.infoValue}>{student.dateOfBirth}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>👤 Giới tính:</Text>
                <Text style={styles.infoValue}>{student.gender}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🏫 Lớp hành chính:</Text>
                <Text style={styles.infoValue}>{student.className}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>💻 Ngành học:</Text>
                <Text style={styles.infoValue}>{student.major}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🎓 Khóa học:</Text>
                <Text style={styles.infoValue}>{student.cohort}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>🏛️ Khoa đào tạo:</Text>
                <Text style={styles.infoValue}>{student.faculty}</Text>
              </View>
            </View>
          </View>

          {/* Phần cập nhật thông tin liên hệ (Email & Số điện thoại) */}
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.sectionTitle}>📞 Thông tin liên hệ</Text>
              {!isEditingContact && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => setIsEditingContact(true)}
                  activeOpacity={0.75}>
                  <Text style={styles.editBtnText}>✏️ Cập nhật</Text>
                </TouchableOpacity>
              )}
            </View>

            {saveMessage.length > 0 && (
              <View style={styles.successBanner}>
                <Text style={styles.successBannerText}>{saveMessage}</Text>
              </View>
            )}

            {!isEditingContact ? (
              <View style={styles.contactDisplayBox}>
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>✉️ Email sinh viên:</Text>
                  <Text style={styles.contactValue}>{student.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Text style={styles.contactLabel}>📱 Số điện thoại:</Text>
                  <Text style={styles.contactValue}>{student.phone}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.editForm}>
                <Text style={styles.inputLabel}>Email liên hệ</Text>
                <TextInput
                  style={styles.input}
                  value={emailInput}
                  onChangeText={setEmailInput}
                  placeholder="Nhập địa chỉ email..."
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <Text style={styles.inputLabel}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={phoneInput}
                  onChangeText={setPhoneInput}
                  placeholder="Nhập số điện thoại (9-11 chữ số)..."
                  keyboardType="phone-pad"
                />

                {contactError.length > 0 && (
                  <Text style={styles.errorText}>⚠️ {contactError}</Text>
                )}

                <View style={styles.formActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancelEdit}
                    activeOpacity={0.75}>
                    <Text style={styles.cancelBtnText}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveContact}
                    activeOpacity={0.8}>
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Thống kê Điểm trung bình học kỳ & Tổng số tín chỉ tích lũy */}
          <View style={styles.gpaSection}>
            <View style={styles.gpaCardPrimary}>
              <Text style={styles.gpaCardLabel}>
                Điểm TB Học kỳ ({student.currentSemester})
              </Text>
              <Text style={styles.gpaCardBigValue}>
                {currentSemesterGPA.gpa10.toFixed(2)}{' '}
                <Text style={styles.gpaCardScale}>/ 10</Text>
              </Text>
              <Text style={styles.gpaCardSub}>
                Hệ 4: {currentSemesterGPA.gpa4.toFixed(2)} / 4.0
              </Text>
            </View>

            <View style={styles.gpaCardSecondary}>
              <Text style={styles.gpaCardLabelDark}>Tổng tín chỉ tích lũy</Text>
              <Text style={styles.gpaCardBigValueDark}>
                {cumulativeGPA.totalCredits}{' '}
                <Text style={styles.gpaCardScaleDark}>TC</Text>
              </Text>
              <Text style={styles.gpaCardSubDark}>
                GPA tích lũy: {cumulativeGPA.gpa10.toFixed(2)} (Hệ 4:{' '}
                {cumulativeGPA.gpa4.toFixed(2)})
              </Text>
            </View>
          </View>

          {/* Header bảng điểm & lọc học kỳ */}
          <View style={styles.gradesHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>
                🏆 Kết quả học tập ({filteredGrades.length} môn)
              </Text>
              <Text style={styles.gradesSubtitle}>
                Nhấn vào môn học để xem bảng điểm thành phần chi tiết
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.semesterFilterRow}>
            <TouchableOpacity
              style={[
                styles.semChip,
                selectedSemester === 'ALL' && styles.semChipActive,
              ]}
              onPress={() => setSelectedSemester('ALL')}>
              <Text
                style={[
                  styles.semChipText,
                  selectedSemester === 'ALL' && styles.semChipTextActive,
                ]}>
                Tất cả ({grades.length})
              </Text>
            </TouchableOpacity>

            {SEMESTERS.map(sem => {
              const active = selectedSemester === sem;
              return (
                <TouchableOpacity
                  key={sem}
                  style={[styles.semChip, active && styles.semChipActive]}
                  onPress={() => setSelectedSemester(sem)}>
                  <Text
                    style={[
                      styles.semChipText,
                      active && styles.semChipTextActive,
                    ]}>
                    {sem}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {selectedSemester !== 'ALL' && (
            <View style={styles.filteredGpaBanner}>
              <Text style={styles.filteredGpaText}>
                📌 Kết quả {selectedSemester}: GPA{' '}
                <Text style={styles.filteredGpaBold}>
                  {selectedSemesterStats.gpa10.toFixed(2)}
                </Text>{' '}
                (Hệ 4: {selectedSemesterStats.gpa4.toFixed(2)}) •{' '}
                {selectedSemesterStats.totalCredits} tín chỉ
              </Text>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          icon="📊"
          title="Chưa có dữ liệu điểm"
          description="Không tìm thấy kết quả học tập trong học kỳ được chọn."
        />
      }
      ListFooterComponent={
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetDemo}
          activeOpacity={0.75}>
          <Text style={styles.resetButtonText}>
            🔄 Khôi phục dữ liệu mẫu ban đầu
          </Text>
        </TouchableOpacity>
      }
    />
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarLargeText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileTitleBox: {
    flex: 1,
  },
  studentName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  studentIdBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    fontWeight: '700',
    fontSize: 12.5,
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  infoGrid: {
    gap: 9,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    width: 138,
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    textAlign: 'right',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  editBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  editBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  successBanner: {
    backgroundColor: '#DCFCE7',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  successBannerText: {
    color: '#15803D',
    fontSize: 12.5,
    fontWeight: '700',
  },
  contactDisplayBox: {
    gap: 8,
  },
  contactItem: {
    backgroundColor: '#F8FAFC',
    padding: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  contactLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  editForm: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 5,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 14,
    color: '#0F172A',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12.5,
    fontWeight: '600',
    marginTop: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 14,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  saveBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gpaSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  gpaCardPrimary: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 14,
  },
  gpaCardLabel: {
    fontSize: 11.5,
    color: '#BFDBFE',
    fontWeight: '600',
    marginBottom: 6,
  },
  gpaCardBigValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  gpaCardScale: {
    fontSize: 13,
    fontWeight: '600',
    color: '#93C5FD',
  },
  gpaCardSub: {
    fontSize: 12,
    color: '#DBEAFE',
    marginTop: 4,
    fontWeight: '500',
  },
  gpaCardSecondary: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  gpaCardLabelDark: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 6,
  },
  gpaCardBigValueDark: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  gpaCardScaleDark: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  gpaCardSubDark: {
    fontSize: 11.5,
    color: '#475569',
    marginTop: 4,
    fontWeight: '600',
  },
  gradesHeaderRow: {
    marginBottom: 10,
  },
  gradesSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  semesterFilterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 12,
  },
  semChip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  semChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  semChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
  },
  semChipTextActive: {
    color: '#FFFFFF',
  },
  filteredGpaBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filteredGpaText: {
    fontSize: 12.5,
    color: '#1E3A8A',
  },
  filteredGpaBold: {
    fontWeight: '800',
  },
  gradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  gradeLeft: {
    flex: 1,
    marginRight: 12,
  },
  gradeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
    gap: 6,
  },
  gradeCode: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  gradeSemester: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  creditPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  creditPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  gradeCourseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 5,
  },
  gradeDetailHint: {
    fontSize: 11.5,
    color: '#64748B',
  },
  gradeRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircle: {
    width: 58,
    height: 58,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score10Text: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  letterGradeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#047857',
    marginTop: 1,
  },
  resetButton: {
    marginTop: 12,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
});
