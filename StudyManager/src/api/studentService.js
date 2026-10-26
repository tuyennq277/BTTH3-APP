import {request} from './client';

const getAll = () => request('GET', '/students');
const getById = id => request('GET', `/students/${encodeURIComponent(id)}`);
const update = (id, data) => request('PATCH', `/students/${encodeURIComponent(id)}`, data);
const create = data => request('POST', '/students', data);
export {getAll, getById, update, create};
export default {getAll, getById, update, create};
