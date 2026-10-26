import {request} from './client';

const getAll = () => request('GET', '/assignments?_expand=course&_sort=dueDate');
const getById = id => request('GET', `/assignments/${encodeURIComponent(id)}?_expand=course`);
const update = (id, data) => request('PATCH', `/assignments/${encodeURIComponent(id)}`, data);
const create = data => request('POST', '/assignments', data);
export {getAll, getById, update, create};
export default {getAll, getById, update, create};
