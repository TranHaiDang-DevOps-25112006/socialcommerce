# Nhật ký lỗi

### [12/10/2026] `cd` báo "No such file or directory" trong Git Bash

- Triệu chứng: `cd C:\dev\socialcommerce` báo `C:devsocialcommerce: No such file or directory`.
- Nguyên nhân gốc: Git Bash coi `\` là ký tự thoát nên nuốt mất dấu `\`. Đường dẫn kiểu Windows chỉ đúng trong PowerShell/CMD.
- Cách xử lý: dùng đường dẫn kiểu Linux: `cd /c/dev/socialcommerce`.
- Bài học: luôn nhìn mình đang ở terminal nào trước khi gõ đường dẫn.

### [12/10/2026] `Cannot GET /ready`

- Triệu chứng: mở `localhost:3001/ready` chỉ thấy `Cannot GET /ready`.
- Nguyên nhân gốc: route `/ready` chưa có trong bản code đang chạy (chưa thêm vào `index.ts`, hoặc đã thêm nhưng chưa `npm run build` lại, vì `npm start` chạy file cũ trong `dist/`).
- Cách xử lý: thêm route, chạy `npm run build`, rồi `npm start` lại.
- Bài học: `npm start` chạy code đã biên dịch trong `dist/`, sửa `src/` xong phải build lại. `npm run dev` thì tự khởi động lại.

### [12/10/2026] `git status` không hiện `.env.example`

- Triệu chứng: sau `git init`, `git status` chỉ liệt kê `auth-service/` và `product-service/`.
- Nguyên nhân gốc: thư mục chưa được theo dõi bị Git gộp gọn, chỉ in tên thư mục thay vì từng file bên trong.
- Cách xử lý: dùng `git status -uall` để xem đầy đủ từng file.
- Bài học: trước khi commit phải soát danh sách file, đảm bảo có `.env.example` và không có `.env`.

### [16/10/2026] Số liệu so sánh multi-stage (auth-service)

- Cách đo: `docker build -t auth-service:dev .` (bản cuối) và `docker build --target build -t auth-service:build .` (chỉ stage 1, có đủ TypeScript và thư viện dev), rồi `docker images auth-service`.
- Kết quả:

| Image                          | Disk usage | Content size |
| ------------------------------ | ---------- | ------------ |
| `auth-service:build` (stage 1) | 464 MB     | 108 MB       |
| `auth-service:dev` (bản cuối)  | 372 MB     | 86,2 MB      |

- Nhận xét: multi-stage giảm khoảng 92 MB disk usage và 21,8 MB content size, tức khoảng 20% cả hai. Mức giảm vừa phải vì image nền `node:22-slim` chiếm phần lớn dung lượng, còn code của app nhỏ.
- Bài học: lợi ích của multi-stage không chỉ là dung lượng. Bản cuối không có trình biên dịch TypeScript, thư viện dev hay mã nguồn `.ts`, nên ít thứ có thể bị khai thác hơn và tải nhanh hơn. Muốn giảm thêm thì thử base image `alpine`.
