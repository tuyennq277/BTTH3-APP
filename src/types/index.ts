export type Semester = 'HK1 2026-2027' | 'HK2 2025-2026' | 'HK1 2025-2026';

export type DayOfWeek = 2 | 3 | 4 | 5 | 6 | 7 | 8; // 2 = Thứ 2 ... 7 = Thứ 7, 8 = Chủ nhật

export type AssignmentStatus =
  | 'todo' // Chưa thực hiện
  | 'in_progress' // Đang thực hiện
  | 'completed' // Đã hoàn thành
  | 'overdue'; // Quá hạn

export type SessionStatus = 'completed' | 'ongoing' | 'upcoming';

export interface StudentProfile {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  className: string;
  major: string;
  cohort: string;
  currentSemester: Semester;
  email: string;
  phone: string;
  advisor: string;
  faculty: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor: string;
  instructorEmail: string;
  semester: Semester;
  room: string;
  scheduleSummary: string;
  description: string;
  isCurrentSemester: boolean;
}

export interface ScheduleItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // Định dạng "HH:mm", ví dụ "07:30"
  endTime: string; // Định dạng "HH:mm", ví dụ "09:30"
  periods: string; // Ví dụ "Tiết 1 - 3"
  room: string;
  campus: string;
  instructor: string;
  topic: string;
  notes: string;
  /**
   * Trạng thái mặc định để minh họa trực quan các buổi học đã kết thúc & sắp diễn ra
   * khi xem ở chế độ mô phỏng trong ngày, hoặc kết hợp so sánh giờ thực tế.
   */
  defaultStatus?: SessionStatus;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  title: string;
  dueDate: string; // Định dạng ISO YYYY-MM-DD
  dueTime: string; // Định dạng HH:mm
  status: AssignmentStatus;
  description: string;
  requirements: string[];
  submissionFormat: string;
  weightPercent: number;
}

export interface CourseGrade {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  credits: number;
  semester: Semester;
  attendanceScore: number; // Chuyên cần (10%)
  assignmentScore: number; // Bài tập / Thực hành (20%)
  midtermScore: number; // Giữa kỳ (20%)
  finalScore: number | null; // Cuối kỳ (50%) - null nếu đang học chưa thi cuối kỳ
  totalScore10: number; // Điểm tổng kết hệ 10
  totalScore4: number; // Điểm quy đổi hệ 4
  letterGrade: string; // A, B+, B, C+, C, D+, D, F
  isPassed: boolean;
  teacherComment: string;
}

export type MainTabParamList = {
  DashboardTab: undefined;
  CoursesTab: undefined;
  ScheduleTab: undefined;
  AssignmentsTab: undefined;
  ProfileTab: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CourseDetail: {courseId: string};
  ScheduleDetail: {scheduleId: string};
  AssignmentDetail: {assignmentId: string};
  GradeDetail: {gradeId?: string; courseId?: string};
};
