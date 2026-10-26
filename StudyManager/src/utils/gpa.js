export function toScale4(score10) {
  if (score10 >= 8.5) {return 4;}
  if (score10 >= 8) {return 3.5;}
  if (score10 >= 7) {return 3;}
  if (score10 >= 6.5) {return 2.5;}
  if (score10 >= 5.5) {return 2;}
  if (score10 >= 5) {return 1.5;}
  if (score10 >= 4) {return 1;}
  return 0;
}
export function toLetter(score) {
  return ({4: 'A', 3.5: 'B+', 3: 'B', 2.5: 'C+', 2: 'C', 1.5: 'D+', 1: 'D', 0: 'F'})[toScale4(score)];
}
export function calcGpa(grades = [], courses = []) {
  let points = 0, credits = 0, totalCredits = 0;
  grades.forEach(grade => {
    const course = courses.find(item => String(item.id) === String(grade.courseId)) || grade.course;
    const count = Number(course?.credits) || 0;
    if (!Number.isFinite(Number(grade.total))) {return;}
    points += toScale4(Number(grade.total)) * count;
    credits += count;
    if (Number(grade.total) >= 4) {totalCredits += count;}
  });
  return {gpa: credits ? points / credits : 0, totalCredits};
}
