# Hoàng Phạm — Software, Mobile & DevOps Portfolio

Portfolio tĩnh bằng HTML, CSS và JavaScript thuần. Không cần framework, cài dependency hay bước build. Hỗ trợ light/dark mode, menu mobile, lọc dự án và terminal mô phỏng. Terminal chỉ trình diễn hiệu ứng; không thực thi lệnh hoặc kết nối AWS.

```text
portfolio_GPT/
├── index.html
├── style.css
├── script.js
├── README.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Chạy trên máy

Tại thư mục dự án:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Mở địa chỉ máy cục bộ tại cổng 8000 trong trình duyệt. Dừng server bằng `Ctrl+C`. Không cần Node.js để chạy trang.

## Cá nhân hóa

- Trong `index.html`, sửa tên, nội dung giới thiệu, trạng thái sẵn sàng và liên kết GitHub theo thông tin thực tế của bạn.
- Cập nhật mô tả, kiến trúc và liên kết từng dự án. Chỉ thêm URL repository, email, CV hoặc demo khi bạn có địa chỉ chính xác; không đưa khóa truy cập vào mã nguồn.
- Trong `style.css`, chỉnh các biến màu ở đầu file để thay đổi nhận diện.
- Trong `script.js`, chỉnh chuỗi lệnh và kết quả terminal mô phỏng nếu cần.

Các tệp CSS và JavaScript dùng đường dẫn tương đối để hoạt động cả ở tên miền gốc và GitHub Pages project site.

## GitHub Pages — thao tác khoảng 2 phút

1. Đưa các tệp lên nhánh `main` của repository `phamhoang1507/portfolio_GPT`, bao gồm `.github/workflows/pages.yml`.
2. Mở **Settings → Pages → Build and deployment → Source**, chọn **GitHub Actions**.
3. Mở **Actions → Deploy portfolio to GitHub Pages → Run workflow**, chọn `main`. Những lần push lên `main` tiếp theo sẽ tự triển khai.
4. Khi job `deploy` hoàn tất, mở URL trong deployment. Với tên repository hiện tại, địa chỉ dự kiến là **https://phamhoang1507.github.io/portfolio_GPT/**.

Khoảng hai phút là thời gian thao tác; thời gian chờ GitHub Actions và phát hành Pages có thể lâu hơn. Nếu repository riêng tư, GitHub Pages cần gói GitHub phù hợp. Nếu có quy tắc bảo vệ environment `github-pages`, deployment có thể cần duyệt trong GitHub.

Workflow chỉ tải lên ba tệp công khai, không đưa `.git`, workflow hay tài liệu vào artifact. Quyền `pages: write` và `id-token: write` chỉ cấp cho job triển khai; không cần tạo personal access token hay thêm secret. Mã nguồn hiện tại không thu thập thông tin và không có backend xử lý liên hệ.
