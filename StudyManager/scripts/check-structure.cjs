const fs = require('fs');
const path = require('path');
const required = `App.js db.json README.md src/config.js
src/api/client.js src/api/studentService.js src/api/courseService.js src/api/sessionService.js src/api/assignmentService.js src/api/gradeService.js
src/storage/keys.js src/storage/cache.js src/storage/outbox.js
src/context/AppDataContext.js src/context/SyncContext.js
src/hooks/useNetworkStatus.js src/hooks/useCachedQuery.js src/hooks/useOutboxSync.js
src/navigation/routes.js src/navigation/AppNavigator.js src/navigation/HomeStack.js src/navigation/CourseStack.js src/navigation/ScheduleStack.js src/navigation/AssignmentStack.js src/navigation/ProfileStack.js
src/screens/home/HomeScreen.js src/screens/courses/CourseListScreen.js src/screens/courses/CourseDetailScreen.js
src/screens/schedule/ScheduleScreen.js src/screens/schedule/SessionDetailScreen.js
src/screens/assignments/AssignmentListScreen.js src/screens/assignments/AssignmentDetailScreen.js src/screens/assignments/AssignmentFormScreen.js
src/screens/profile/ProfileScreen.js src/screens/profile/EditProfileScreen.js src/screens/profile/GradeListScreen.js src/screens/profile/GradeDetailScreen.js
src/components/common/ScreenContainer.js src/components/common/OfflineBanner.js src/components/common/LoadingView.js src/components/common/ErrorView.js src/components/common/EmptyState.js src/components/common/SearchBar.js src/components/common/FilterChips.js src/components/common/SyncBadge.js src/components/common/LastUpdatedText.js src/components/common/AppButton.js src/components/common/FormInput.js
src/components/course/CourseCard.js src/components/schedule/DaySelector.js src/components/schedule/SessionCard.js
src/components/assignment/AssignmentItem.js src/components/assignment/StatusToggle.js src/components/grade/GpaSummary.js src/components/grade/GradeRow.js src/components/profile/InfoRow.js
src/theme/colors.js src/theme/spacing.js src/theme/typography.js src/utils/date.js src/utils/gpa.js src/utils/validators.js`.split(/\s+/).filter(Boolean);
const missing = required.filter(file => !fs.existsSync(path.join(__dirname, '..', file)));
if (missing.length) {console.error('Thiếu file:', missing.join(', ')); process.exitCode = 1;}
else {console.log(`Đủ ${required.length} file bắt buộc.`);}
const db = require('../db.json');
for (const name of ['students', 'courses', 'sessions', 'assignments', 'grades']) {
  if (!Array.isArray(db[name]) || db[name].length < 5) {console.error(`${name}: cần ít nhất 5 bản ghi`); process.exitCode = 1;}
}
