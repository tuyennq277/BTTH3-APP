import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Assignment,
  AssignmentStatus,
  Course,
  CourseGrade,
  ScheduleItem,
  StudentProfile,
} from '../types';
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_COURSES,
  INITIAL_GRADES,
  INITIAL_SCHEDULES,
  INITIAL_STUDENT_PROFILE,
} from '../data/mockData';
import {calculateGPA} from '../utils/studyHelpers';

const STORAGE_KEYS = {
  STUDENT_PROFILE: '@study_app_student_profile_v2',
  ASSIGNMENTS: '@study_app_assignments_v2',
};

interface StudyContextValue {
  student: StudentProfile;
  courses: Course[];
  schedules: ScheduleItem[];
  assignments: Assignment[];
  grades: CourseGrade[];
  isLoading: boolean;
  currentSemesterCourses: Course[];
  incompleteAssignmentsCount: number;
  currentSemesterGPA: {gpa10: number; gpa4: number; totalCredits: number};
  cumulativeGPA: {gpa10: number; gpa4: number; totalCredits: number};
  updateAssignmentStatus: (
    assignmentId: string,
    newStatus: AssignmentStatus,
  ) => Promise<void>;
  updateContactInfo: (email: string, phone: string) => Promise<void>;
  resetAllData: () => Promise<void>;
}

const StudyContext = createContext<StudyContextValue | undefined>(undefined);

export const StudyProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [student, setStudent] = useState<StudentProfile>(
    INITIAL_STUDENT_PROFILE,
  );
  const [courses] = useState<Course[]>(INITIAL_COURSES);
  const [schedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [assignments, setAssignments] =
    useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [grades] = useState<CourseGrade[]>(INITIAL_GRADES);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadPersistedData = async () => {
      try {
        const [savedStudentJson, savedAssignmentsJson] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.ASSIGNMENTS),
        ]);

        if (isMounted) {
          if (savedStudentJson) {
            const parsedStudent = JSON.parse(
              savedStudentJson,
            ) as Partial<StudentProfile>;
            setStudent({
              ...INITIAL_STUDENT_PROFILE,
              ...parsedStudent,
            });
          }
          if (savedAssignmentsJson) {
            const parsedAssignments = JSON.parse(
              savedAssignmentsJson,
            ) as Assignment[];
            if (
              Array.isArray(parsedAssignments) &&
              parsedAssignments.length > 0
            ) {
              setAssignments(parsedAssignments);
            }
          }
        }
      } catch (_error) {
        // Nếu AsyncStorage lỗi thì dùng dữ liệu mẫu mặc định
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPersistedData();
    return () => {
      isMounted = false;
    };
  }, []);

  const updateAssignmentStatus = useCallback(
    async (assignmentId: string, newStatus: AssignmentStatus) => {
      setAssignments(prev => {
        const updated = prev.map(item =>
          item.id === assignmentId ? {...item, status: newStatus} : item,
        );
        AsyncStorage.setItem(
          STORAGE_KEYS.ASSIGNMENTS,
          JSON.stringify(updated),
        ).catch(() => {});
        return updated;
      });
    },
    [],
  );

  const updateContactInfo = useCallback(
    async (email: string, phone: string) => {
      setStudent(prev => {
        const updated: StudentProfile = {
          ...prev,
          email: email.trim(),
          phone: phone.trim(),
        };
        AsyncStorage.setItem(
          STORAGE_KEYS.STUDENT_PROFILE,
          JSON.stringify(updated),
        ).catch(() => {});
        return updated;
      });
    },
    [],
  );

  const resetAllData = useCallback(async () => {
    setStudent(INITIAL_STUDENT_PROFILE);
    setAssignments(INITIAL_ASSIGNMENTS);
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.STUDENT_PROFILE),
        AsyncStorage.removeItem(STORAGE_KEYS.ASSIGNMENTS),
      ]);
    } catch (_error) {}
  }, []);

  const currentSemesterCourses = useMemo(
    () => courses.filter(c => c.isCurrentSemester),
    [courses],
  );

  const incompleteAssignmentsCount = useMemo(
    () => assignments.filter(a => a.status !== 'completed').length,
    [assignments],
  );

  const currentSemesterGPA = useMemo(() => {
    const semGrades = grades.filter(
      g => g.semester === student.currentSemester,
    );
    return calculateGPA(semGrades);
  }, [grades, student.currentSemester]);

  const cumulativeGPA = useMemo(() => calculateGPA(grades), [grades]);

  const value = useMemo<StudyContextValue>(
    () => ({
      student,
      courses,
      schedules,
      assignments,
      grades,
      isLoading,
      currentSemesterCourses,
      incompleteAssignmentsCount,
      currentSemesterGPA,
      cumulativeGPA,
      updateAssignmentStatus,
      updateContactInfo,
      resetAllData,
    }),
    [
      student,
      courses,
      schedules,
      assignments,
      grades,
      isLoading,
      currentSemesterCourses,
      incompleteAssignmentsCount,
      currentSemesterGPA,
      cumulativeGPA,
      updateAssignmentStatus,
      updateContactInfo,
      resetAllData,
    ],
  );

  return (
    <StudyContext.Provider value={value}>{children}</StudyContext.Provider>
  );
};

export function useStudy(): StudyContextValue {
  const ctx = useContext(StudyContext);
  if (!ctx) {
    throw new Error('useStudy phải được sử dụng bên trong StudyProvider');
  }
  return ctx;
}
