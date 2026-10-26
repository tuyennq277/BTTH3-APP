import {request} from './client';

const getAll = () => request('GET', '/sessions?_expand=course');
const getById = id => request('GET', `/sessions/${encodeURIComponent(id)}?_expand=course`);
const update = (id, data) => request('PATCH', `/sessions/${encodeURIComponent(id)}`, data);
const create = data => request('POST', '/sessions', data);
export {getAll, getById, update, create};
export default {getAll, getById, update, create};
