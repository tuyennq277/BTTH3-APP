import {
  Assignment,
  AssignmentStatus,
  CourseGrade,
  DayOfWeek,
  ScheduleItem,
  SessionStatus,
} from '../types';

export const REFERENCE_DATE_STR = '2026-10-12'; // Ngày tham chiếu mặc định nếu thiết bị lệch ngày

export function getTodayDayOfWeek(): DayOfWeek {
  const jsDay = new Date().getDay(); // 0 = CN, 1 = T2, ..., 6 = T7
  if (jsDay === 0) {
    return 8;
  }
  return (jsDay + 1) as DayOfWeek;
}

export function getDayLabel(day: DayOfWeek): string {
  const map: Record<DayOfWeek, string> = {
    2: 'Thứ Hai',
    3: 'Thứ Ba',
    4: 'Thứ Tư',
    5: 'Thứ Năm',
    6: 'Thứ Sáu',
    7: 'Thứ Bảy',
    8: 'Chủ Nhật',
  };
  return map[day];
}

export function formatVietnameseDate(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length !== 3) {
    return isoDate;
  }
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

/**
 * Tính số ngày còn lại tới hạn nộp (so với ngày 2026-10-12 để dữ liệu mẫu luôn nhất quán)
 */
export function getDaysRemaining(dueDate: string): number {
  const ref = new Date(`${REFERENCE_DATE_STR}T00:00:00`);
  const due = new Date(`${dueDate}T00:00:00`);
  const diffMs = due.getTime() - ref.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

export function isAssignmentDueSoon(assignment: Assignment): boolean {
  if (assignment.status === 'completed' || assignment.status === 'overdue') {
    return false;
  }
  const days = getDaysRemaining(assignment.dueDate);
  return days >= 0 && days <= 3;
}

export function isAssignmentOverdue(assignment: Assignment): boolean {
  if (assignment.status === 'completed') {
    return false;
  }
  if (assignment.status === 'overdue') {
    return true;
  }
  return getDaysRemaining(assignment.dueDate) < 0;
}

export function getAssignmentStatusMeta(status: AssignmentStatus): {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
} {
  switch (status) {
    case 'todo':
      return {
        label: 'Chưa thực hiện',
        color: '#475569',
        bgColor: '#F1F5F9',
        borderColor: '#CBD5E1',
      };
    case 'in_progress':
      return {
        label: 'Đang thực hiện',
        color: '#1D4ED8',
        bgColor: '#DBEAFE',
        borderColor: '#93C5FD',
      };
    case 'completed':
      return {
        label: 'Đã hoàn thành',
        color: '#15803D',
        bgColor: '#DCFCE7',
        borderColor: '#86EFAC',
      };
    case 'overdue':
      return {
        label: 'Quá hạn',
        color: '#B91C1C',
        bgColor: '#FEE2E2',
        borderColor: '#FCA5A5',
      };
  }
}

function timeToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Xác định trạng thái buổi học (Đã kết thúc / Đang diễn ra / Sắp diễn ra).
 * Cho phép truyền vào mốc giờ hiện tại (mặc định so sánh theo mốc giờ trong ngày hoặc defaultStatus)
 */
export function getScheduleSessionStatus(
  item: ScheduleItem,
  referenceTimeHHMM?: string,
): SessionStatus {
  if (!referenceTimeHHMM && item.defaultStatus) {
    return item.defaultStatus;
  }
  const nowMinutes = referenceTimeHHMM
    ? timeToMinutes(referenceTimeHHMM)
    : new Date().getHours() * 60 + new Date().getMinutes();

  const startMinutes = timeToMinutes(item.startTime);
  const endMinutes = timeToMinutes(item.endTime);

  if (nowMinutes > endMinutes) {
    return 'completed';
  }
  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
    return 'ongoing';
  }
  return 'upcoming';
}

export function getSessionStatusMeta(status: SessionStatus): {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
} {
  switch (status) {
    case 'completed':
      return {
        label: 'Đã kết thúc',
        color: '#64748B',
        bgColor: '#F1F5F9',
        dotColor: '#94A3B8',
      };
    case 'ongoing':
      return {
        label: 'Đang diễn ra',
        color: '#047857',
        bgColor: '#D1FAE5',
        dotColor: '#10B981',
      };
    case 'upcoming':
      return {
        label: 'Sắp diễn ra',
        color: '#1D4ED8',
        bgColor: '#DBEAFE',
        dotColor: '#2563EB',
      };
  }
}

export function calculateGPA(grades: CourseGrade[]): {
  gpa10: number;
  gpa4: number;
  totalCredits: number;
} {
  if (grades.length === 0) {
    return {gpa10: 0, gpa4: 0, totalCredits: 0};
  }
  let weightedSum10 = 0;
  let weightedSum4 = 0;
  let totalCredits = 0;

  for (const g of grades) {
    weightedSum10 += g.totalScore10 * g.credits;
    weightedSum4 += g.totalScore4 * g.credits;
    totalCredits += g.credits;
  }

  if (totalCredits === 0) {
    return {gpa10: 0, gpa4: 0, totalCredits: 0};
  }

  return {
    gpa10: Number((weightedSum10 / totalCredits).toFixed(2)),
    gpa4: Number((weightedSum4 / totalCredits).toFixed(2)),
    totalCredits,
  };
}
