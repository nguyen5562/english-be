# 🚀 WebTiengAnh Backend API

> **API Backend mạnh mẽ cho Nền tảng Học Tiếng Anh Trực tuyến.**

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

---

## 📖 Giới thiệu

**WebTiengAnh Backend** là một dịch vụ API RESTful toàn diện được xây dựng bằng framework **NestJS** tiên tiến. Dự án này cung cấp nền tảng backend vững chắc để quản lý toàn bộ hệ sinh thái học tiếng Anh, bao gồm quản lý người dùng, khóa học, bài tập, thống kê và nhiều tính năng khác.

Được thiết kế với kiến trúc **Module** scalable, dễ bảo trì và mở rộng trong tương lai.

---

## ✨ Tính năng Nổi bật

Hệ thống được chia thành các module chuyên biệt, mỗi module đảm nhận một chức năng cụ thể:

### 🔐 **Xác thực & Bảo mật (Authentication)**

- Đăng ký, Đăng nhập an toàn.
- Sử dụng **JWT (JSON Web Token)** để xác thực người dùng.
- Bảo vệ các endpoint nhạy cảm bằng **Passport Guards**.
- Phân quyền người dùng (User/Admin).

### 📚 **Quản lý Khóa học (Course Management)**

- Tạo, cập nhật, xóa khóa học.
- Quản lý bài học (Lessons) trong từng khóa học.
- Hỗ trợ upload video, tài liệu đính kèm.

### 📝 **Đào tạo & Kiểm tra (Quizzes & Exercises)**

- Hệ thống bài tập đa dạng (Trắc nghiệm, Điền từ, Video Recording).
- Quản lý **Quiz** với tính năng giới hạn thời gian, chấm điểm tự động.
- Lưu trữ lịch sử làm bài (**Attempts**) chi tiết của học viên.

### 👤 **Quản lý Người dùng (User Management)**

- Quản lý hồ sơ cá nhân.
- Theo dõi tiến độ học tập.
- Admin có quyền quản lý danh sách người dùng.

### 📊 **Thống kê & Báo cáo (Statistics)**

- Dashboard thống kê trực quan cho Admin.
- Báo cáo số lượng người dùng mới, khóa học phổ biến, tỉ lệ hoàn thành bài tập.

### 📁 **Quản lý Tài nguyên (File Manager)**

- Upload và quản lý file tập trung.
- Hỗ trợ nhiều định dạng file (Ảnh, Video, Audio, PDF).
- Tự động tối ưu hóa và phục vụ file tĩnh.

---

## 🛠️ Công nghệ Sử dụng

Dự án sử dụng các công nghệ hiện đại nhất để đảm bảo hiệu năng và độ ổn định:

- **Core Framework**: [NestJS](https://nestjs.com/) (v11+) - Framework Node.js hiệu quả và scalable.
- **Language**: [TypeScript](https://www.typescriptlang.org/) (v5+) - Đảm bảo code an toàn và dễ bảo trì.
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) - Cơ sở dữ liệu NoSQL linh hoạt.
- **Authentication**: `passport-jwt`, `bcrypt` - Bảo mật tài khoản người dùng.
- **Validation**: `class-validator`, `class-transformer` - Kiểm tra dữ liệu đầu vào chặt chẽ.
- **File Upload**: `multer` - Xử lý upload file hiệu quả.
- **Utilities**: `rxjs`, `diskusage`, `mime-types`.

---

## 🚀 Hướng dẫn Cài đặt & Chạy

Để chạy dự án này trên máy local của bạn, hãy làm theo các bước sau:

### 1. Yêu cầu hệ thống

- **Node.js** (v18 trở lên)
- **MongoDB** (Local hoặc Cloud Atlas)
- **npm** hoặc **yarn**

### 2. Cài đặt Dependencies

```bash
# Clone repository
git clone <repository-url>
cd be

# Cài đặt các gói thư viện
npm install
```

### 3. Cấu hình Môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án và điền các thông tin sau:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/english
JWT_SECRET=your_super_secret_jwt_key
FILE_ROOT=./resources
```

### 4. Chạy Ứng dụng

```bash
# Chạy chế độ phát triển (Development)
npm run start:dev

# Chạy chế độ Production
npm run start:prod
```

Server sẽ khởi động tại: `http://localhost:3000`

---

## 📂 Cấu trúc Thư mục

Cấu trúc mã nguồn được tổ chức theo kiến trúc **Modular** của NestJS:

```
src/
├── configs/          # Cấu hình hệ thống (Env, Database...)
├── consts/           # Các hằng số dùng chung
├── decorators/       # Custom Decorators (User, Roles...)
├── enums/            # Định nghĩa Enum (UserRole, QuestionType...)
├── guards/           # Các Guard bảo vệ Route (JwtAuthGuard...)
├── interfaces/       # Các Interface TypeScript
├── modules/          # 📦 CÁC MODULE CHÍNH
│   ├── auth/         # Module Xác thực
│   ├── course/       # Module Khóa học
│   ├── exercise/     # Module Bài tập
│   ├── file-manager/ # Module Quản lý File
│   ├── lesson/       # Module Bài học
│   ├── quiz/         # Module Bài kiểm tra
│   ├── statistic/    # Module Thống kê
│   └── user/         # Module Người dùng
├── strategies/       # Các chiến lược xác thực (JWT Strategy)
├── utils/            # Các hàm tiện ích bổ trợ
├── app.module.ts     # Main Module
└── main.ts           # Entry point của ứng dụng
```

---

## 🧪 Testing

Dự án tích hợp sẵn **Jest** để chạy Unit Test và E2E Test.

```bash
# Chạy Unit Tests
npm run test

# Chạy E2E Tests
npm run test:e2e

# Kiểm tra độ phủ code (Coverage)
npm run test:cov
```

---

## 📜 License

Dự án này là **Private** và chưa được cấp phép công khai (UNLICENSED).

---

<p align="center">
  <b>Made with ❤️ by the WebTiengAnh Team</b>
</p>
