# Phạm Đình Hoàng — Backend, Mobile & Cloud Portfolio

Portfolio dành cho nhà tuyển dụng, xây bằng HTML, CSS và JavaScript thuần. Trang giới thiệu điểm mạnh gắn với kinh nghiệm, dự án doanh nghiệp, sáu repository công khai được kiểm tra mã nguồn, kỹ năng, học vấn và liên hệ.

Light/dark mode, menu mobile, lọc dự án, sao chép email và terminal mô phỏng được triển khai không cần thư viện bên ngoài. Terminal chỉ trình diễn lệnh lab; không thực thi lệnh hoặc kết nối AWS.

```text
portfolio_GPT/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── hoang-portrait.png
│   ├── Pham-Dinh-Hoang-Backend-Mobile-CV.pdf
│   └── Pham-Dinh-Hoang-AWS-DevOps-CV.pdf
├── README.md
├── PROJECT_NOTES.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Chạy trên máy

Không cần cài dependency hay chạy build. Tại thư mục dự án:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở địa chỉ máy cục bộ tại cổng 8000 trong trình duyệt. Dừng server bằng `Ctrl+C`. Node.js không phải điều kiện để chạy trang.

## Cấu trúc nội dung

- **Tổng quan và điểm mạnh:** cách Hoàng đóng góp vào API, dữ liệu, mobile và hệ thống.
- **Kinh nghiệm:** các dự án doanh nghiệp được mô tả theo hồ sơ nghề nghiệp; không công bố mã nguồn doanh nghiệp.
- **Dự án cá nhân:** ShopApp, Minna AI N5, Finance App, terraformCICD, Product Stack / shop_tech và nghiên cứu độ tương đồng văn bản tiếng Việt.
- **Kỹ năng:** phân biệt kinh nghiệm công việc, dự án cá nhân và AWS/DevOps đang học qua lab.
- **Học vấn và liên hệ:** thông tin ứng tuyển, liên kết GitHub và tải xuống hai bản CV gốc.

Các mô tả dự án được giới hạn theo bằng chứng trong mã nguồn. Minna AI N5 dẫn thẳng tới nhánh `develop` vì `main` là Flutter starter; phần AI ở nhánh riêng vẫn dùng phản hồi mô phỏng. Workflow của terraformCICD chưa chạy `terraform plan/apply`. Dockerfile của shop_tech là single-stage; ví dụ multi-stage nằm trong devops-learning. Chi tiết kiểm chứng nằm ở [PROJECT_NOTES.md](PROJECT_NOTES.md).

## Cá nhân hóa và tài nguyên

- Sửa nội dung, trạng thái sẵn sàng, email và liên kết trong `index.html` theo thông tin hiện tại.
- Ảnh chân dung ở `assets/hoang-portrait.png`. Khi thêm ảnh hoặc tài nguyên công khai khác, đặt trong `assets/` và dùng đường dẫn tương đối.
- Hai PDF gốc được cung cấp để tải xuống công khai theo lựa chọn của chủ hồ sơ. Thay nội dung `assets/Pham-Dinh-Hoang-Backend-Mobile-CV.pdf` và `assets/Pham-Dinh-Hoang-AWS-DevOps-CV.pdf` để cập nhật CV; giữ tên tệp để các liên kết hiện tại tiếp tục hoạt động.
- Biến màu ở đầu `style.css`; hiệu ứng và chuỗi lệnh mô phỏng nằm trong `script.js`.

CSS, JavaScript và tài nguyên dùng đường dẫn tương đối để hoạt động dưới GitHub Pages project site.

## GitHub Pages — thao tác khoảng 2 phút

1. Đưa mã nguồn, thư mục `assets/` và `.github/workflows/pages.yml` lên nhánh `main` của repository `phamhoang1507/portfolio_GPT`.
2. Mở **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**. Việc bật Pages cần được thực hiện trong GitHub Settings; workflow không tự bật Pages.
3. Mở **Actions → Deploy portfolio to GitHub Pages → Run workflow**, chọn `main`. Những lần push lên `main` tiếp theo sẽ tự triển khai.
4. Khi job `deploy` hoàn tất, mở URL trong deployment. Với tên repository hiện tại, địa chỉ dự kiến là **https://phamhoang1507.github.io/portfolio_GPT/**.

Khoảng hai phút là thời gian thao tác; thời gian chờ GitHub Actions và phát hành Pages có thể lâu hơn. Repository riêng tư cần gói GitHub hỗ trợ Pages. Nếu environment `github-pages` có quy tắc bảo vệ, deployment có thể cần duyệt trong GitHub.

Workflow chỉ xuất bản `index.html`, `style.css`, `script.js` và thư mục `assets/`, gồm ảnh chân dung và hai CV. `.git`, workflow, README và ghi chú kiểm chứng không nằm trong artifact Pages. Job chuẩn bị chỉ có quyền đọc; `pages: write` và `id-token: write` chỉ cấp cho job triển khai. Không cần personal access token hay secret bổ sung.
