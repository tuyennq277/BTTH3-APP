# BTTH3-APP

Ứng dụng Quản lý Học tập Sinh viên xây dựng bằng **React Native CLI** (TypeScript).

## Thông tin sinh viên thực hiện
- **Họ và tên**: Nguyễn Quang Tuyến
- **Mã sinh viên**: B23DCCC178
- **Lớp hành chính**: D23CQCC02-B
- **Môn học**: Lập trình Thiết bị Di động (`RIPT1412-20261-01-01-TH`)
- **Giảng viên hướng dẫn**: Thầy Trần Quang Đại

## Các chức năng chính
1. **Tổng quan (Dashboard)**: Thông tin sinh viên, GPA học kỳ, số bài tập chưa hoàn thành, lịch học trong ngày, bài tập sắp đến hạn và danh sách môn học trong học kỳ.
2. **Môn học**: Danh sách môn học bằng `FlatList`, tìm kiếm theo mã/tên môn học, lọc theo học kỳ, xem chi tiết môn học.
3. **Thời khóa biểu**: Lịch học theo các ngày trong tuần, chuyển đổi ngày, phân biệt các buổi học **Đã kết thúc** và **Sắp diễn ra**, xem chi tiết buổi học.
4. **Bài tập**: Tìm kiếm bài tập theo tên, lọc theo 4 trạng thái (*Chưa thực hiện, Đang thực hiện, Đã hoàn thành, Quá hạn*), làm nổi bật bài tập sắp đến hạn / quá hạn, cập nhật trạng thái lưu bền vững với `AsyncStorage`.
5. **Cá nhân & Kết quả học tập**: Hồ sơ sinh viên, cập nhật Email/SĐT lưu vào `AsyncStorage`, thống kê GPA học kỳ & tổng tín chỉ tích lũy, xem bảng điểm thành phần chi tiết từng môn.
