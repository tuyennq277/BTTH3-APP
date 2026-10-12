import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Course} from '../types';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  compact?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPress,
  compact = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.78}>
      <View style={styles.topRow}>
        <View style={styles.codeBadge}>
          <Text style={styles.codeText}>{course.code}</Text>
        </View>
        <View style={styles.rightBadges}>
          <View style={styles.creditBadge}>
            <Text style={styles.creditText}>{course.credits} tín chỉ</Text>
          </View>
          {!compact && (
            <View
              style={[
                styles.semesterBadge,
                course.isCurrentSemester
                  ? styles.semesterActive
                  : styles.semesterPast,
              ]}>
              <Text
                style={[
                  styles.semesterText,
                  course.isCurrentSemester
                    ? styles.semesterActiveText
                    : styles.semesterPastText,
                ]}>
                {course.semester}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text style={styles.courseName} numberOfLines={2}>
        {course.name}
      </Text>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>👨‍🏫 Giảng viên:</Text>
        <Text style={styles.infoValue}>{course.instructor}</Text>
      </View>

      {!compact && (
        <View style={styles.footerRow}>
          <Text style={styles.roomText} numberOfLines={1}>
            📍 {course.room} • {course.scheduleSummary}
          </Text>
          <Text style={styles.detailLink}>Chi tiết ›</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardCompact: {
    padding: 13,
    marginBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.3,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  creditBadge: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  creditText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  semesterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  semesterActive: {
    backgroundColor: '#DCFCE7',
  },
  semesterPast: {
    backgroundColor: '#F1F5F9',
  },
  semesterText: {
    fontSize: 11,
    fontWeight: '600',
  },
  semesterActiveText: {
    color: '#15803D',
  },
  semesterPastText: {
    color: '#64748B',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    marginRight: 6,
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  roomText: {
    fontSize: 12.5,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  detailLink: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
});
