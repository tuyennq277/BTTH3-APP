const fs = require('fs');
const path = require('path');
const queries = {student: '', course: '', session: '?_expand=course', assignment: '?_expand=course&_sort=dueDate', grade: '?_expand=course'};
for (const [name, query] of Object.entries(queries)) {
  const plural = name === 'student' ? 'students' : `${name}s`;
  fs.writeFileSync(path.join(__dirname, `../src/api/${name}Service.js`), `import {request} from './client';

const getAll = () => request('GET', '/${plural}${query}');
const getById = id => request('GET', \`/${plural}/\${encodeURIComponent(id)}${query.includes('_expand') ? '?_expand=course' : ''}\`);
const update = (id, data) => request('PATCH', \`/${plural}/\${encodeURIComponent(id)}\`, data);
const create = data => request('POST', '/${plural}', data);
export {getAll, getById, update, create};
export default {getAll, getById, update, create};
`);
}
