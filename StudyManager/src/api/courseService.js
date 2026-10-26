import {request} from './client';

const getAll = () => request('GET', '/courses');
const getById = id => request('GET', `/courses/${encodeURIComponent(id)}`);
const update = (id, data) => request('PATCH', `/courses/${encodeURIComponent(id)}`, data);
const create = data => request('POST', '/courses', data);
export {getAll, getById, update, create};
export default {getAll, getById, update, create};
