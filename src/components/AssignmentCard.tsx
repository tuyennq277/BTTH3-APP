import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Assignment, AssignmentStatus} from '../types';
import {
  formatVietnameseDate,
  getAssignmentStatusMeta,
  getDaysRemaining,
  isAssignmentDueSoon,
  isAssignmentOverdue,
} from '../utils/studyHelpers';

interface AssignmentCardProps {
  assignment: Assignment;
  onPress: () => void;
  onStatusChange?: (newStatus: AssignmentStatus) => void;
  compact?: boolean;
}

const STATUS_OPTIONS: {status: AssignmentStatus; shortLabel: string}[] = [
  {status: 'todo', shortLabel: 'Chưa làm'},
  {status: 'in_progress', shortLabel: 'Đang làm'},
  {status: 'completed', shortLabel: 'Hoàn thành'},
  {status: 'overdue', shortLabel: 'Quá hạn'},
];

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onPress,
  onStatusChange,
  compact = false,
}) => {
  const statusMeta = getAssignmentStatusMeta(assignment.status);
  const dueSoon = isAssignmentDueSoon(assignment);
  const overdue = isAssignmentOverdue(assignment);
  const daysRemaining = getDaysRemaining(assignment.dueDate);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        dueSoon && styles.cardDueSoon,
        overdue && styles.cardOverdue,
        compact && styles.cardCompact,
      ]}
      onPress={onPress}
      activeOpacity={0.8}>
      {/* Banner cảnh báo nổi bật nếu sắp đến hạn hoặc quá hạn */}
      {overdue && (
        <View style={styles.overdueBanner}>
          <Text style={styles.overdueBannerText}>
            ⚠️ ĐÃ QUÁ HẠN NỘP ({Math.abs(daysRemaining)} ngày trước) — Cần xử lý ngay!
          </Text>
        </View>
      )}
      {!overdue && dueSoon && (
        <View style={styles.dueSoonBanner}>
          <Text style={styles.dueSoonBannerText}>
            🔥 SẮP ĐẾN HẠN NỘP — Còn {daysRemaining === 0 ? 'hôm nay' : `${daysRemaining} ngày`}
          </Text>
        </View>
      )}

      <View style={styles.topRow}>
        <View style={styles.coursePill}>
          <Text style={styles.coursePillText} numberOfLines={1}>
            {assignment.courseCode} • {assignment.courseName}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusMeta.bgColor,
              borderColor: statusMeta.borderColor,
            },
          ]}>
          <Text style={[styles.statusBadgeText, {color: statusMeta.color}]}>
            {statusMeta.label}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {assignment.title}
      </Text>

      <View style={styles.deadlineRow}>
        <Text
          style={[
            styles.deadlineText,
            overdue && styles.deadlineOverdue,
            dueSoon && styles.deadlineDueSoon,
          ]}>
          ⏰ Hạn nộp: {formatVietnameseDate(assignment.dueDate)} lúc{' '}
          {assignment.dueTime}
        </Text>
        <Text style={styles.weightText}>Trọng số: {assignment.weightPercent}%</Text>
      </View>

      {onStatusChange && !compact && (
        <View style={styles.quickActionContainer}>
          <Text style={styles.quickActionTitle}>Cập nhật nhanh trạng thái:</Text>
          <View style={styles.quickButtonsRow}>
            {STATUS_OPTIONS.map(opt => {
              const isSelected = assignment.status === opt.status;
              const optMeta = getAssignmentStatusMeta(opt.status);
              return (
                <TouchableOpacity
                  key={opt.status}
                  style={[
                    styles.quickBtn,
                    isSelected && {
                      backgroundColor: optMeta.bgColor,
                      borderColor: optMeta.color,
                    },
                  ]}
                  onPress={() => onStatusChange(opt.status)}
                  activeOpacity={0.75}>
                  <Text
                    style={[
                      styles.quickBtnText,
                      isSelected && {
                        color: optMeta.color,
                        fontWeight: '700',
                      },
                    ]}>
                    {opt.shortLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardCompact: {
    padding: 12,
    marginBottom: 10,
  },
  cardDueSoon: {
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    backgroundColor: '#FFFBEB',
  },
  cardOverdue: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
    backgroundColor: '#FEF2F2',
  },
  overdueBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 9,
  },
  overdueBannerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B91C1C',
  },
  dueSoonBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 9,
  },
  dueSoonBannerText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  coursePill: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coursePillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#334155',
  },
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 21,
    marginBottom: 8,
  },
  deadlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
  },
  deadlineOverdue: {
    color: '#DC2626',
    fontWeight: '700',
  },
  deadlineDueSoon: {
    color: '#D97706',
    fontWeight: '700',
  },
  weightText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  quickActionContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  quickActionTitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 6,
    fontWeight: '600',
  },
  quickButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  quickBtn: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
});
