import {request} from './client';

const getAll = () => request('GET', '/grades?_expand=course');
const getById = id => request('GET', `/grades/${encodeURIComponent(id)}?_expand=course`);
const update = (id, data) => request('PATCH', `/grades/${encodeURIComponent(id)}`, data);
const create = data => request('POST', '/grades', data);
export {getAll, getById, update, create};
export default {getAll, getById, update, create};
