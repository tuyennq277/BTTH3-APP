import React, {createContext, useCallback, useContext, useMemo, useState} from 'react';
import useCachedQuery from '../hooks/useCachedQuery';
import studentService from '../api/studentService';
import courseService from '../api/courseService';
import sessionService from '../api/sessionService';
import assignmentService from '../api/assignmentService';
import gradeService from '../api/gradeService';
import {useSync} from './SyncContext';
import {makeAction, mutate, uniqueId} from './mutations';
import {applyActions} from './optimistic';

const AppDataContext = createContext(null);
const getStudent = () => studentService.getById(1);
export default function AppDataProvider({children}) {
  const studentQuery = useCachedQuery('student', getStudent);
  const coursesQuery = useCachedQuery('courses', courseService.getAll);
  const sessionsQuery = useCachedQuery('sessions', sessionService.getAll);
  const assignmentsQuery = useCachedQuery('assignments', assignmentService.getAll);
  const gradesQuery = useCachedQuery('grades', gradeService.getAll);
  const sync = useSync();
  const [optimistic, setOptimistic] = useState([]);
  const actions = useMemo(() => {
    const result = [...sync.actions];
    optimistic.forEach(action => {if (!result.some(item => item.id === action.id)) {result.push(action);}});
    return result;
  }, [sync.actions, optimistic]);
  const perform = useCallback(async action => {
    setOptimistic(before => [...before, action]);
    try {
      const result = await mutate(action);
      await sync.reload();
      return result;
    } finally {setOptimistic(before => before.filter(item => item.id !== action.id));}
  }, [sync.reload]);
  const toggleAssignment = useCallback(assignment => perform(makeAction('PATCH',
    `/assignments/${encodeURIComponent(assignment.id)}`, {status: assignment.status === 'done' ? 'todo' : 'done'})), [perform]);
  const createAssignment = useCallback(values => {
    const id = uniqueId('assignment');
    return perform(makeAction('POST', '/assignments', {...values, id, status: 'todo'}));
  }, [perform]);
  const updateStudent = useCallback(values => perform(makeAction('PATCH', '/students/1', values)), [perform]);
  const courses = coursesQuery.data || [];
  const withCourse = rows => rows.map(row => ({...row, course: courses.find(course => String(course.id) === String(row.courseId)) || row.course}));
  const assignments = withCourse(applyActions('assignments', assignmentsQuery.data || [], actions))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  const value = {
    student: applyActions('students', studentQuery.data, actions), courses,
    assignments, sessions: withCourse(sessionsQuery.data || []), grades: withCourse(gradesQuery.data || []),
    actions, toggleAssignment, createAssignment, updateStudent,
    queries: {student: studentQuery, courses: coursesQuery, sessions: sessionsQuery, assignments: assignmentsQuery, grades: gradesQuery},
  };
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}
export function useAppData() {return useContext(AppDataContext);}
