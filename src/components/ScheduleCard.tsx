import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScheduleItem, SessionStatus} from '../types';
import {
  getScheduleSessionStatus,
  getSessionStatusMeta,
} from '../utils/studyHelpers';

interface ScheduleCardProps {
  item: ScheduleItem;
  onPress: () => void;
  sessionStatus?: SessionStatus;
  showInstructor?: boolean;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  item,
  onPress,
  sessionStatus,
  showInstructor = true,
}) => {
  const status = sessionStatus ?? getScheduleSessionStatus(item);
  const statusMeta = getSessionStatusMeta(status);
  const isCompleted = status === 'completed';

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isCompleted ? styles.cardCompleted : styles.cardUpcoming,
      ]}
      onPress={onPress}
      activeOpacity={0.78}>
      <View
        style={[
          styles.leftTimeColumn,
          isCompleted ? styles.timeColCompleted : styles.timeColUpcoming,
        ]}>
        <Text
          style={[
            styles.startTimeText,
            isCompleted && styles.textMutedCompleted,
          ]}>
          {item.startTime}
        </Text>
        <View style={styles.timeDivider} />
        <Text
          style={[
            styles.endTimeText,
            isCompleted && styles.textMutedCompleted,
          ]}>
          {item.endTime}
        </Text>
        <Text style={styles.periodsText}>{item.periods}</Text>
      </View>

      <View style={styles.rightContent}>
        <View style={styles.headerRow}>
          <Text style={styles.courseCode}>{item.courseCode}</Text>
          <View
            style={[
              styles.statusBadge,
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

        <Text
          style={[
            styles.courseName,
            isCompleted && styles.courseNameCompleted,
          ]}
          numberOfLines={2}>
          {item.courseName}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>📍 Phòng: {item.room}</Text>
        </View>

        {showInstructor && (
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>👨‍🏫 GV: {item.instructor}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 13,
    marginBottom: 11,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  cardUpcoming: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  cardCompleted: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#94A3B8',
  },
  leftTimeColumn: {
    width: 78,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timeColUpcoming: {
    backgroundColor: '#EFF6FF',
  },
  timeColCompleted: {
    backgroundColor: '#F1F5F9',
  },
  startTimeText: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  timeDivider: {
    width: 16,
    height: 1.5,
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  endTimeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  textMutedCompleted: {
    color: '#64748B',
  },
  periodsText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  rightContent: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  courseCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    lineHeight: 20,
  },
  courseNameCompleted: {
    color: '#475569',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  metaText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
});
