// Chỉ dùng một lần để chuyển dữ liệu bài 3 sang REST API của bài 4.
const fs = require('fs');
const path = require('path');
const ts = require('../../node_modules/typescript');
const vm = require('vm');
const source = fs.readFileSync(path.join(__dirname, '../../src/data/mockData.ts'), 'utf8');
const result = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}});
const sandbox = {exports: {}};
vm.runInNewContext(result.outputText, sandbox);
const old = sandbox.exports;
const updatedAt = '2026-10-20T08:00:00.000Z';
const students = [{id: 1, studentCode: old.INITIAL_STUDENT_PROFILE.studentId,
  fullName: old.INITIAL_STUDENT_PROFILE.fullName, className: old.INITIAL_STUDENT_PROFILE.className,
  major: old.INITIAL_STUDENT_PROFILE.major, email: old.INITIAL_STUDENT_PROFILE.email,
  phone: old.INITIAL_STUDENT_PROFILE.phone, updatedAt},
  ...['Trần Minh Anh', 'Lê Hoàng Nam', 'Phạm Thu Hà', 'Đỗ Đức Huy'].map((fullName, index) => ({
    id: index + 2, studentCode: `B23DCCC${179 + index}`, fullName,
    className: 'D23CQCC02-B', major: 'Cử nhân CNTT',
    email: `sv${index + 2}@stu.ptit.edu.vn`, phone: `091234567${index}`, updatedAt,
  }))];
const courses = old.INITIAL_COURSES.map(c => ({id: c.id, code: c.code, name: c.name,
  credits: c.credits, lecturer: c.instructor, description: c.description, semester: c.semester}));
const sessions = old.INITIAL_SCHEDULES.map(s => ({id: s.id, courseId: s.courseId,
  dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, room: s.room,
  note: s.notes || s.topic || ''}));
const assignments = old.INITIAL_ASSIGNMENTS.map((a, index) => ({id: a.id,
  courseId: a.courseId, title: index === 0 ? 'Thực hành 4: API và chế độ offline' : a.title,
  description: index === 0 ? 'Kết nối REST API, lưu cache, đồng bộ hàng đợi và xử lý xung đột.' : a.description,
  dueDate: index < 3 ? ['2026-10-29T16:59:00.000Z', '2026-10-31T13:00:00.000Z', '2026-10-25T11:00:00.000Z'][index]
    : new Date(`${a.dueDate}T${a.dueTime || '23:59'}:00+07:00`).toISOString(),
  status: a.status === 'done' || a.status === 'completed' ? 'done' : 'todo', updatedAt}));
function letter(n) {return n >= 8.5 ? 'A' : n >= 8 ? 'B+' : n >= 7 ? 'B' : n >= 6.5 ? 'C+' : n >= 5.5 ? 'C' : n >= 5 ? 'D+' : n >= 4 ? 'D' : 'F';}
const grades = old.INITIAL_GRADES.map(g => {
  const total = Number((g.attendanceScore * 0.1 + g.midtermScore * 0.3 + g.finalScore * 0.6).toFixed(2));
  return {id: g.id, courseId: g.courseId, semester: g.semester,
    attendance: g.attendanceScore, midterm: g.midtermScore, final: g.finalScore,
    total, letter: letter(total)};
});
fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify({students, courses, sessions, assignments, grades}, null, 2) + '\n');
console.log('Đã tạo db.json từ dữ liệu Thực hành 3.');
