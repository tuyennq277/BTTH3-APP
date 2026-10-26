import {useEffect} from 'react';
import useCachedQuery from './useCachedQuery';
import {useAppData} from '../context/AppDataContext';
import {seedDetail} from '../context/queryStore';
import {applyActions} from '../context/optimistic';
import courseService from '../api/courseService';
import assignmentService from '../api/assignmentService';
import sessionService from '../api/sessionService';
import gradeService from '../api/gradeService';
import studentService from '../api/studentService';

const services = {courses: courseService, assignments: assignmentService, sessions: sessionService, grades: gradeService, students: studentService};
export default function useDetail(resource, id) {
  const app = useAppData();
  const list = resource === 'students' ? [app.student].filter(Boolean) : app[resource];
  const local = list.find(item => String(item.id) === String(id));
  const created = app.actions.find(action => action.method === 'POST' && action.url === `/${resource}` && String(action.body.id) === String(id));
  const key = `${resource}/${id}`;
  const query = useCachedQuery(key, () => created ? Promise.resolve(created.body) : services[resource].getById(id));
  const timestamp = app.queries[resource === 'students' ? 'student' : resource]?.lastUpdated;
  useEffect(() => {
    if (local) {
      const {_pending, ...record} = local;
      // Never persist an optimistic overlay as server data.
      if (!_pending) {seedDetail(key, record, timestamp).catch(() => {});}
    }
  }, [key, local, timestamp]);
  const base = query.data || local || created?.body;
  let data = applyActions(resource, base, app.actions);
  if (data?.courseId) {data = {...data, course: app.courses.find(course => String(course.id) === String(data.courseId)) || data.course};}
  return {...query, data, loading: query.loading && !data, error: query.error};
}
