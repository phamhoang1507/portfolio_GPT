# Ghi chú kiểm chứng dự án

Ngày kiểm tra: **2026-11-05**. Đã xem danh sách 20 repository công khai trên GitHub và đọc các bản clone mã nguồn liên quan. Việc kiểm tra là đọc mã nguồn: không chạy các ứng dụng, triển khai AWS hoặc xác nhận demo đang hoạt động. Nội dung dưới đây ghi lại phạm vi có bằng chứng để tránh mô tả quá mức trên portfolio.

## Sáu repository được chọn

| Dự án | Bằng chứng trong mã nguồn | Phạm vi cần giữ rõ |
| --- | --- | --- |
| [ShopApp](https://github.com/phamhoang1507/shopapp) | Nhánh `master`: FastAPI, SQLAlchemy/PostgreSQL; Next.js 15, React 19, TypeScript. Có catalog/filter/pagination, access/refresh token, admin guard, giỏ hàng, đơn hàng và dịch vụ ảnh. Nguồn: `shopapp-backend/app/api/v1/endpoints`, `app/services`, `app/models/models.py`, `shopapp-web/src/app`, `shopapp-web/package.json`. | Dự án commerce cá nhân có mã nguồn đáng kể. Chưa xác nhận triển khai thực tế hoặc mức độ sẵn sàng production. |
| [Minna AI N5 — develop](https://github.com/phamhoang1507/minna_ai_n5/tree/develop) | Nhánh `develop`: Flutter, Riverpod, Firebase Auth/Google Sign-In, Firestore, audio, go_router; flashcard bảng chữ cái, bài từ vựng, lưu/đồng bộ tiến độ và streak. Nguồn: `lib/core/service`, `lib/screens/alphabet`, `lib/screens/vocabulary`, `pubspec.yaml`. | `main` chỉ là Flutter starter. Nhánh `feature/ai` có màn hình chat nhưng `AiService.sendMessage` trả lời mô phỏng; không mô tả là đã tích hợp mô hình AI thật. |
| [Finance App](https://github.com/phamhoang1507/project_finance) | Backend FastAPI/PostgreSQL có auth và transactions; mobile Flutter có BLoC, Dio, flutter_secure_storage và luồng auth. Nguồn: `mobile/lib/features/auth`, `mobile/lib/data/api_service.dart`, `backend/app/routers/auth.py`, `transactions.py`. | Mobile hiện tập trung vào xác thực, chưa chứng minh dashboard tài chính hoàn chỉnh. |
| [terraformCICD](https://github.com/phamhoang1507/terraformCICD) | Terraform AWS lab có VPC module, bốn subnet public/private, biến hai availability zone và thư mục staging/production. Nguồn: `deployment/stack/vpc/main.tf`, `deployment/staging/maint.tf`, `deployment/production/maint.tf`, `.github/workflows/main.yml`. | Workflow chọn môi trường và in thông báo, chưa chạy `plan/apply`. Không khẳng định đã có remote state, approval hay triển khai production. |
| [Product Stack / shop_tech](https://github.com/phamhoang1507/shop_tech) | FastAPI + React/Vite + MongoDB 7 trong Docker Compose; bridge network, persistent Mongo volume, hot-reload mounts. Nguồn: `docker-compose.yml`, `backend/main.py`, hai Dockerfile. | Lab phát triển nhiều container. `GET /api/items` tạo lại dữ liệu demo cố định; chưa có cơ sở nói full CRUD/auth. Hai Dockerfile đều single-stage. |
| [Độ tương đồng văn bản tiếng Việt](https://github.com/phamhoang1507/SoSanhDoTuongDongVaMucDoTuongQuan) | Python, Tkinter, Matplotlib; PhoBERT, SimCSE, Word2Vec, BKAI embeddings; cosine similarity và Pearson/Spearman so với điểm chuyên gia. Nguồn: các thư mục `Giao diện`, `Độ tương đồng`, `Độ tương quan`, `Đồ thị`. | Mô tả là thử nghiệm nghiên cứu. Không gắn repo này với đo thể tích từ ảnh; không công bố chỉ số benchmark hoặc quyền sở hữu thuật toán chưa được xác nhận. |

Các dự án trên được chọn để thể hiện chiều rộng backend, mobile, container/IaC và tư duy phân tích bằng mã nguồn kiểm tra được. Kinh nghiệm doanh nghiệp được trình bày riêng theo hồ sơ nghề nghiệp, không đánh đồng với repository cá nhân.

## Bằng chứng bổ trợ và nội dung không đưa vào nhóm nổi bật

- [devops-learning](https://github.com/phamhoang1507/devops-learning): `bvn/be/Dockerfile` có multi-stage Python/Poetry thực tế và các bài Compose; đây là bằng chứng học multi-stage, tách biệt với shop_tech.
- [TinhTheTichVatTheQuaAnh](https://github.com/phamhoang1507/TinhTheTichVatTheQuaAnh): lab đo kích thước/thể tích từ ảnh bằng OpenCV, SciPy/imutils; README ghi nhận nguồn hướng dẫn MiAI. Có thể giới thiệu là học tập/phát triển từ nền tảng đó.
- [quanlynhanvien](https://github.com/phamhoang1507/quanlynhanvien): bài thực hành Java Swing/JDBC/MySQL với các màn hình nhân viên, lương, ca làm và công việc.
- [payment-QR](https://github.com/phamhoang1507/payment-QR): nhánh `main` còn là Spatie package skeleton với class/config rỗng và nội dung mẫu; các nhánh khác được thấy là Dependabot. Chưa đủ bằng chứng để giới thiệu như thư viện thanh toán hoàn chỉnh.
- [app_education](https://github.com/phamhoang1507/app_education): có UI welcome/login và dependency Firebase, nhưng chưa thấy khởi tạo service Firebase hay xử lý xác thực cho nút đăng nhập. Không khẳng định ứng dụng Firebase đã hoạt động.
- **BikeTracker:** không thấy trong 20 repository công khai được kiểm tra. Không tạo URL mã nguồn hoặc demo giả. Chỉ có thể bổ sung như kinh nghiệm do chủ hồ sơ cung cấp, kèm phạm vi/nguồn phù hợp.

Ghi chú này chỉ tóm tắt bằng chứng mã nguồn công khai, không chép nội dung riêng tư từ CV và không nằm trong artifact GitHub Pages.
