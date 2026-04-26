# 🚀 Postulate - Social Media OS

**Postulate** là một hệ điều hành mạng xã hội (Social Media OS) và nền tảng lên lịch, quản lý bài đăng tự động. Dự án được thiết kế theo kiến trúc **Modular Monolith** kết hợp **Monorepo**, giúp tối ưu hóa việc quản lý mã nguồn, dễ dàng mở rộng và phân tách các service (như API, Frontend, Worker, AI) trong khi vẫn duy trì sự đơn giản của một repository duy nhất.

---

## 🛠 Tech Stack (Công nghệ sử dụng)

- **Package Manager:** [pnpm](https://pnpm.io/) (với tính năng Workspace).
- **Backend API:** Node.js (Express / NestJS - *Tùy cấu hình*).
- **Frontend:** Next.js / React.
- **Database & ORM:** PostgreSQL kết hợp Prisma ORM.
- **Architecture:** Monorepo (pnpm workspaces) + Modular Monolith.
- **Infrastructure:** Docker & Docker Compose cho môi trường local.

---

## 📂 Project Structure (Cấu trúc thư mục)

Dự án được chia làm 2 phần chính: `apps` (các ứng dụng độc lập có thể chạy/deploy) và `packages` (các module, thư viện dùng chung).

```text
Postulate/
├── apps/
│   ├── api/            # Backend API chính xử lý requests.
│   ├── frontend/       # Ứng dụng giao diện người dùng (Next.js/React).
│   └── worker/         # Xử lý các tác vụ nền (background jobs/queues).
│
├── packages/
│   ├── ai-service/     # Tích hợp AI (ví dụ: gen text, image).
│   ├── auth/           # Module xác thực và phân quyền (Authentication/Authorization).
│   ├── config/         # Cấu hình chung cho toàn hệ thống (ESLint, Prettier, TSConfig).
│   ├── core/           # Chứa các logic dùng chung cốt lõi.
│   ├── database/       # Chứa Prisma Schema, Migrations và Database Client.
│   ├── media/          # Quản lý hình ảnh, video tải lên.
│   └── social-api/     # Tương tác với API của bên thứ 3 (Facebook, X, LinkedIn...).
```

---

## 🏁 Getting Started (Hướng dẫn cài đặt)

### 1. Yêu cầu hệ thống
- Node.js (phiên bản LTS mới nhất)
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose (Dành cho database local)

### 2. Cài đặt

**Bước 1: Clone dự án**
```bash
git clone https://github.com/quanbao2603/Postulate.git
cd Postulate
```

**Bước 2: Cài đặt dependencies**
Do đây là Monorepo dùng pnpm, bạn chỉ cần chạy lệnh cài đặt ở thư mục gốc:
```bash
pnpm install
```

**Bước 3: Thiết lập môi trường (.env)**
- Copy file mẫu `.env.example` thành `.env` ở thư mục gốc.
- Điền các thông tin kết nối Database, API Keys vào file `.env` vừa tạo. (Lưu ý file `.env` đã được chặn khỏi Git để bảo mật).

**Bước 4: Khởi động Database (Local)**
```bash
docker-compose up -d
```

**Bước 5: Khởi chạy dự án**
```bash
pnpm dev
```
*(Lệnh này sẽ khởi động đồng thời cả frontend, api và worker tuỳ thuộc vào cấu hình trong package.json)*

---

## 📝 Quy chuẩn Code & Commit

- **Commit:** Tuân thủ chuẩn [Conventional Commits](https://www.conventionalcommits.org/) (ví dụ: `feat:`, `chore:`, `fix:`).
- Mọi logic liên quan đến Database phải được thao tác thông qua package `@postulate/database`.
- Các nhánh mới nên được rẽ nhánh từ `main`.

---
*Dự án đang trong quá trình phát triển tích cực.*
