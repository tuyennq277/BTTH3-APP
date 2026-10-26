import {parseLocalDateTime} from './date';
export function validateAssignment(values, now = Date.now()) {
  const errors = {};
  if (!values.title.trim()) {errors.title = 'Vui lòng nhập tiêu đề.';}
  if (!values.courseId) {errors.courseId = 'Vui lòng chọn môn học.';}
  const dueDate = parseLocalDateTime(values.dueDate);
  if (!dueDate) {errors.dueDate = 'Nhập đúng dd/MM/yyyy HH:mm, ví dụ 09/11/2026 23:59.';}
  else if (new Date(dueDate).getTime() <= now) {errors.dueDate = 'Hạn nộp phải ở tương lai.';}
  return errors;
}
export function validateProfile(values) {
  const errors = {};
  if (!values.fullName.trim()) {errors.fullName = 'Họ tên không được để trống.';}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {errors.email = 'Email chưa hợp lệ.';}
  if (!/^\+?[\d\s]{9,15}$/.test(values.phone)) {errors.phone = 'Số điện thoại chưa hợp lệ.';}
  return errors;
}
