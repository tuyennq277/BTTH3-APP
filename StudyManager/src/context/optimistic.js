export function applyActions(resource, source, actions) {
  if (source === null || source === undefined) {return source;}
  const single = !Array.isArray(source);
  let rows = single ? [source] : source;
  for (const action of actions) {
    if (action.url.split('/')[1] !== resource) {continue;}
    const id = action.method === 'POST' ? action.body.id : decodeURIComponent(action.url.split('/')[2]);
    const found = rows.some(row => String(row.id) === String(id));
    if (found) {
      rows = rows.map(row => String(row.id) === String(id) ? {...row, ...action.body, _pending: true} : row);
    } else if (!single && action.method === 'POST') {
      rows = [...rows, {...action.body, _pending: true}];
    }
  }
  return single ? rows[0] : rows;
}
