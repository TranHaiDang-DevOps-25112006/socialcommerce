# SocialCommerce

Hệ thống microservices thương mại xã hội, gồm hai service độc lập:

| Service | Cổng | Nhiệm vụ |
|---|---|---|
| `auth-service` | 3001 | Đăng ký, đăng nhập, cấp token JWT |
| `product-service` | 3002 | Quản lý sản phẩm (có phân quyền theo vai trò) |

## Công nghệ
Node.js, Express 5, TypeScript, MySQL, Sequelize, JWT, bcrypt

## Kiến trúc
Mỗi service theo kiến trúc Hexagonal (Ports and Adapters):

```
src/
├── domain/          Luật nghiệp vụ thuần túy (entity, interface repository). Không biết gì về HTTP hay DB
├── application/     Các use case (đăng nhập, tạo sản phẩm...), chỉ phụ thuộc vào domain
├── infrastructure/  Phần kỹ thuật: Express (routes, middleware), Sequelize (models, repository), kết nối DB
└── shared/          Thành phần dùng chung (lớp lỗi AppError...)
```

Luồng đăng nhập: client gọi `auth-service` để lấy token JWT, rồi gửi token đó
trong header `Authorization: Bearer <token>` khi gọi `product-service`.
Hai service dùng chung `JWT_SECRET` để ký và kiểm tra token.

## Chạy local

Yêu cầu: Node.js 20 trở lên, MySQL 8.

1. Tạo hai database trong MySQL:
   ```sql
   CREATE DATABASE socialcommerce_auth;
   CREATE DATABASE socialcommerce_product;
   ```
2. Với từng service (`auth-service`, `product-service`):
   ```bash
   cd auth-service
   cp .env.example .env      # rồi mở .env, điền mật khẩu MySQL và JWT_SECRET
   npm ci
   npm run build
   npm start
   ```
   Lưu ý: `JWT_SECRET` của hai service phải giống nhau.
3. Kiểm tra:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   ```
   Kết quả mong đợi: `{"status":"ok"}`

Khi phát triển có thể dùng `npm run dev` (tự khởi động lại khi sửa code).

## Endpoint

### Auth Service (`/api/auth`)
| Method | Đường dẫn | Mô tả | Cần token |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký (email, password, displayName) | Không |
| POST | `/api/auth/login` | Đăng nhập, nhận token | Không |
| GET | `/api/auth/me` | Xem userId và role từ token | Có |

### Product Service (`/api/products`)
| Method | Đường dẫn | Mô tả | Quyền |
|---|---|---|---|
| GET | `/api/products` | Danh sách (phân trang: `page`, `pageSize`, lọc `sellerId`) | Công khai |
| GET | `/api/products/:id` | Chi tiết sản phẩm | Công khai |
| POST | `/api/products` | Tạo sản phẩm | seller, admin |
| PUT | `/api/products/:id` | Sửa sản phẩm | Người đã đăng nhập |
| DELETE | `/api/products/:id` | Xóa sản phẩm | Người đã đăng nhập |

Cả hai service có `GET /health` (kiểm tra service còn sống) và `GET /ready` (kiểm tra thêm kết nối database).
