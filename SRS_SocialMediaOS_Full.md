# Tài liệu Đặc tả Yêu cầu Phần mềm (SRS) — Phiên bản Chi tiết
# Hệ thống Quản lý & Tự động hóa Mạng Xã Hội (Social Media OS)

---

| Thông tin | Nội dung |
|---|---|
| **Phiên bản** | 2.0.0 — Enterprise Edition |
| **Ngày tạo** | 26/04/2026 |
| **Trạng thái** | Bản thảo (Draft) |
| **Loại dự án** | Ứng dụng Web SaaS / B2B — Modular Monolith |

---

## Mục lục

1. [Giới thiệu & Tổng quan](#1-giới-thiệu--tổng-quan)
2. [Kiến trúc Hệ thống](#2-kiến-trúc-hệ-thống)
3. [Mô hình Dữ liệu Đầy đủ](#3-mô-hình-dữ-liệu-đầy-đủ)
4. [Module: Xác thực & Tài khoản](#4-module-xác-thực--tài-khoản)
5. [Module: Quản lý Tổ chức & Phân quyền](#5-module-quản-lý-tổ-chức--phân-quyền)
6. [Module: Quản lý Bài đăng & Lên lịch](#6-module-quản-lý-bài-đăng--lên-lịch)
7. [Module: Tích hợp Mạng Xã hội](#7-module-tích-hợp-mạng-xã-hội)
8. [Module: Trí tuệ Nhân tạo (AI)](#8-module-trí-tuệ-nhân-tạo-ai)
9. [Module: Thư viện Media](#9-module-thư-viện-media)
10. [Module: Thanh toán & Gói cước](#10-module-thanh-toán--gói-cước)
11. [Module: API & Webhooks](#11-module-api--webhooks)
12. [Đặc tả UI/UX Từng Màn hình](#12-đặc-tả-uiux-từng-màn-hình)
13. [Yêu cầu Phi Chức năng](#13-yêu-cầu-phi-chức-năng)
14. [Xử lý Lỗi & Mã Lỗi Chuẩn](#14-xử-lý-lỗi--mã-lỗi-chuẩn)
15. [Lộ trình Triển khai & Phát triển](#15-lộ-trình-triển-khai--phát-triển)

---

## 1. Giới thiệu & Tổng quan

### 1.1 Mục đích

Tài liệu này là đặc tả kỹ thuật và nghiệp vụ đầy đủ cho hệ thống **Social Media OS** — nền tảng SaaS B2B cho phép cá nhân và tổ chức lên lịch, quản lý và tự động hóa nội dung trên nhiều mạng xã hội thông qua một giao diện thống nhất, có tích hợp AI.

### 1.2 Đối tượng Người dùng & Vai trò

| Vai trò | Mô tả | Quyền cốt lõi |
|---|---|---|
| **Super Admin** | Quản trị viên hệ thống (nội bộ) | Toàn quyền hệ thống, xem mọi tổ chức |
| **Owner** | Người tạo Tổ chức | Toàn quyền trong Tổ chức, quản lý billing |
| **Admin** | Quản trị viên Tổ chức | Quản lý thành viên, kênh, cài đặt |
| **Editor** | Biên tập viên | Tạo, sửa, xoá bài đăng; không quản lý thành viên |
| **Viewer** | Người xem | Chỉ xem bài đăng và analytics |

### 1.3 Bảng Thuật ngữ

| Thuật ngữ | Giải thích |
|---|---|
| **Workspace / Organization** | Không gian làm việc độc lập của một tổ chức |
| **Channel** | Tài khoản mạng xã hội đã kết nối vào hệ thống |
| **Post** | Một bài đăng đơn lẻ hoặc nhóm bài đăng Thread |
| **Thread** | Chuỗi bài đăng liên tiếp (như Twitter Thread) |
| **Slot** | Khung giờ lên lịch đăng bài được gợi ý |
| **Credits** | Đơn vị nội bộ dùng cho tính năng AI tốn kém |
| **Plug** | Bình luận tự động đính kèm bên dưới bài vừa đăng |
| **Recurring** | Bài đăng lặp lại định kỳ |
| **Worker** | Tiến trình chạy ngầm, phụ trách đăng bài đúng giờ |
| **Token** | Access Token OAuth để thay mặt người dùng đăng bài |
| **Temporal** | Engine workflow đảm bảo bài chỉ được đăng đúng một lần |

---

## 2. Kiến trúc Hệ thống

### 2.1 Sơ đồ Tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│   Browser (Next.js SSR/CSR)  │  Mobile Browser  │  SDK      │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS / REST API
┌──────────────────────▼──────────────────────────────────────┐
│                      API GATEWAY LAYER                       │
│    Rate Limiting (Redis)  │  Auth Guard  │  CORS Handler     │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼──────────────┐
         │             │              │
┌────────▼───┐  ┌──────▼──────┐  ┌───▼──────────┐
│  Auth      │  │  Core API   │  │  AI Service  │
│  Module    │  │  (NestJS)   │  │  (NestJS)    │
└────────────┘  └──────┬──────┘  └───┬──────────┘
                       │             │
         ┌─────────────▼─────────────▼──────────┐
         │            DATA LAYER                  │
         │  PostgreSQL (Primary)  │  Redis (Cache)│
         └──────────────┬────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    WORKER LAYER                              │
│   Temporal Orchestrator  ──►  Worker Service (NestJS)        │
│   BullMQ Queue (Redis)   ──►  Social Media Clients           │
│                                  │                           │
│   Facebook API  │  X API  │  LinkedIn API  │  TikTok...      │
└─────────────────────────────────────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                  STORAGE LAYER                               │
│   Cloudflare R2 / AWS S3  (Media Files)                     │
│   PostgreSQL (Relational Data)                              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Luồng Đăng bài Chi tiết (Sequence)

```
User         Frontend       API Server      PostgreSQL      Redis Queue    Worker        Social API
 │                │               │               │               │           │               │
 │ Soạn bài       │               │               │               │           │               │
 ├──────────────► │               │               │               │           │               │
 │                │ POST /posts   │               │               │           │               │
 │                ├──────────────►│               │               │           │               │
 │                │               │ Validate JWT  │               │           │               │
 │                │               │ Check quota   │               │           │               │
 │                │               ├──────────────►│               │           │               │
 │                │               │ INSERT post   │               │           │               │
 │                │               │ status=PENDING│               │           │               │
 │                │               │◄──────────────┤               │           │               │
 │                │               │ Enqueue Job   │               │           │               │
 │                │               ├───────────────────────────────►           │               │
 │                │               │               │               │           │               │
 │                │  201 Created  │               │               │           │               │
 │                │◄──────────────┤               │               │           │               │
 │ "Lên lịch OK!" │               │               │               │           │               │
 │◄───────────────┤               │               │               │           │               │
 │                │               │               │               │           │               │
 │            [Đến giờ đăng]      │               │               │           │               │
 │                │               │               │               │ Dequeue   │               │
 │                │               │               │               ├──────────►│               │
 │                │               │               │               │           │ GET post data │
 │                │               │               │◄──────────────────────────┤               │
 │                │               │               ├───────────────────────────►               │
 │                │               │               │               │           │ POST content  │
 │                │               │               │               │           ├──────────────►│
 │                │               │               │               │           │◄──────────────┤
 │                │               │               │               │           │ UPDATE status │
 │                │               │               │◄──────────────────────────┤               │
 │                │               │               │ PUBLISHED / FAILED        │               │
```

---

## 3. Mô hình Dữ liệu Đầy đủ

### 3.1 Entity: `users`

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255),                    -- NULL nếu đăng nhập OAuth
  name            VARCHAR(255),
  avatar_url      TEXT,
  timezone        VARCHAR(100) DEFAULT 'UTC',
  locale          VARCHAR(10)  DEFAULT 'en',
  email_verified  BOOLEAN      DEFAULT FALSE,
  is_active       BOOLEAN      DEFAULT TRUE,
  last_login_at   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
```

**Ràng buộc:**
- `email` phải là địa chỉ email hợp lệ, unique toàn hệ thống.
- `password_hash` có thể NULL nếu user chỉ đăng nhập qua OAuth.
- `timezone` phải là timezone hợp lệ theo chuẩn IANA (ví dụ: `Asia/Ho_Chi_Minh`).

---

### 3.2 Entity: `oauth_accounts`

```sql
CREATE TABLE oauth_accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider        VARCHAR(50) NOT NULL,   -- 'google' | 'github' | 'authentik'
  provider_id     VARCHAR(255) NOT NULL,  -- ID từ nhà cung cấp OAuth
  access_token    TEXT,
  refresh_token   TEXT,
  expires_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, provider_id)
);

CREATE INDEX idx_oauth_user_id ON oauth_accounts(user_id);
```

---

### 3.3 Entity: `organizations`

```sql
CREATE TABLE organizations (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(100) UNIQUE NOT NULL,    -- URL-friendly identifier
  logo_url          TEXT,
  timezone          VARCHAR(100) DEFAULT 'UTC',
  api_key           VARCHAR(64)  UNIQUE,             -- Public API key
  credits           INTEGER      DEFAULT 0,
  subscription_plan VARCHAR(50)  DEFAULT 'trial',    -- 'trial'|'starter'|'pro'|'enterprise'
  subscription_status VARCHAR(50) DEFAULT 'active',  -- 'active'|'past_due'|'canceled'
  trial_ends_at     TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_org_slug   ON organizations(slug);
CREATE INDEX idx_org_api_key ON organizations(api_key);
```

**Ràng buộc:**
- `slug` chỉ chứa ký tự `[a-z0-9-]`, tối thiểu 3, tối đa 50 ký tự.
- `credits` không được âm (`CHECK (credits >= 0)`).

---

### 3.4 Entity: `organization_members`

```sql
CREATE TABLE organization_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role            VARCHAR(20) NOT NULL DEFAULT 'editor',
                  -- 'owner' | 'admin' | 'editor' | 'viewer'
  invited_by      UUID REFERENCES users(id),
  joined_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, user_id)
);

CREATE INDEX idx_members_org  ON organization_members(organization_id);
CREATE INDEX idx_members_user ON organization_members(user_id);
```

---

### 3.5 Entity: `channels` (Tài khoản MXH đã kết nối)

```sql
CREATE TABLE channels (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  platform        VARCHAR(50) NOT NULL,
                  -- 'facebook'|'instagram'|'x'|'linkedin'|'tiktok'|'youtube'
                  -- |'pinterest'|'reddit'|'slack'|'discord'|'mastodon'|'bluesky'
  name            VARCHAR(255) NOT NULL,          -- Tên hiển thị tài khoản
  profile_url     TEXT,
  avatar_url      TEXT,
  platform_id     VARCHAR(255) NOT NULL,          -- ID trên nền tảng đó
  access_token    TEXT,                           -- Đã mã hóa (AES-256)
  refresh_token   TEXT,                           -- Đã mã hóa
  token_expires_at TIMESTAMPTZ,
  refresh_needed  BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  extra_data      JSONB,                          -- Metadata đặc thù từng platform
  connected_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organization_id, platform, platform_id)
);

CREATE INDEX idx_channels_org      ON channels(organization_id);
CREATE INDEX idx_channels_platform ON channels(platform);
CREATE INDEX idx_channels_refresh  ON channels(refresh_needed) WHERE refresh_needed = TRUE;
```

**Ràng buộc:**
- `access_token` và `refresh_token` phải được mã hóa AES-256-GCM trước khi lưu, không bao giờ lưu dạng plain text.
- `extra_data` dùng cho metadata đặc thù: Facebook Page ID, LinkedIn Company URN...

---

### 3.6 Entity: `posts`

```sql
CREATE TABLE posts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by      UUID NOT NULL REFERENCES users(id),
  parent_post_id  UUID REFERENCES posts(id) ON DELETE CASCADE, -- NULL = bài đầu Thread
  
  -- Nội dung
  content         TEXT NOT NULL,
  
  -- Trạng thái
  status          VARCHAR(20) NOT NULL DEFAULT 'draft',
                  -- 'draft'|'pending'|'processing'|'published'|'failed'|'cancelled'
  
  -- Lên lịch
  publish_date    TIMESTAMPTZ,                    -- NULL = đăng ngay
  published_at    TIMESTAMPTZ,                    -- Thời điểm thực sự đã đăng
  
  -- Lặp lại
  interval_in_days INTEGER,                       -- NULL = không lặp
  
  -- Metadata
  fail_reason     TEXT,                           -- Lý do lỗi nếu status = 'failed'
  platform_post_id VARCHAR(255),                  -- ID bài đăng trên nền tảng sau khi published
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_org       ON posts(organization_id);
CREATE INDEX idx_posts_status    ON posts(status);
CREATE INDEX idx_posts_schedule  ON posts(publish_date) WHERE status = 'pending';
CREATE INDEX idx_posts_parent    ON posts(parent_post_id);
```

---

### 3.7 Entity: `post_channels` (Bảng nối Post ↔ Channel)

```sql
CREATE TABLE post_channels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  channel_id  UUID NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',
  platform_post_id  VARCHAR(255),    -- ID riêng trên từng nền tảng
  published_at      TIMESTAMPTZ,
  fail_reason       TEXT,
  UNIQUE (post_id, channel_id)
);

CREATE INDEX idx_post_channels_post    ON post_channels(post_id);
CREATE INDEX idx_post_channels_channel ON post_channels(channel_id);
```

> **Lý do có bảng này:** Một bài đăng có thể được gửi đến nhiều kênh. Mỗi kênh có trạng thái đăng riêng biệt — kênh Facebook có thể thành công trong khi kênh X bị lỗi token.

---

### 3.8 Entity: `post_media` (Đính kèm Media)

```sql
CREATE TABLE post_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  media_id    UUID NOT NULL REFERENCES media_items(id),
  sort_order  INTEGER DEFAULT 0,
  UNIQUE (post_id, media_id)
);
```

---

### 3.9 Entity: `tags`

```sql
CREATE TABLE tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  color           CHAR(7) NOT NULL DEFAULT '#6B7280', -- Hex color
  UNIQUE (organization_id, name)
);

CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

---

### 3.10 Entity: `media_items`

```sql
CREATE TABLE media_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  uploaded_by     UUID NOT NULL REFERENCES users(id),
  file_name       VARCHAR(255) NOT NULL,
  file_size       BIGINT NOT NULL,                    -- bytes
  mime_type       VARCHAR(100) NOT NULL,
  storage_url     TEXT NOT NULL,                      -- URL đầy đủ trên R2/S3
  storage_key     VARCHAR(500) NOT NULL,              -- Object key trong bucket
  provider        VARCHAR(20) DEFAULT 'r2',           -- 'r2'|'s3'|'local'
  width           INTEGER,                            -- px (chỉ có với ảnh)
  height          INTEGER,
  duration_sec    FLOAT,                              -- giây (chỉ có với video)
  thumbnail_url   TEXT,                               -- Thumbnail cho video
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_org       ON media_items(organization_id);
CREATE INDEX idx_media_uploader  ON media_items(uploaded_by);
CREATE INDEX idx_media_type      ON media_items(mime_type);
```

---

### 3.11 Entity: `subscriptions`

```sql
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id       UUID UNIQUE NOT NULL REFERENCES organizations(id),
  stripe_customer_id    VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  plan                  VARCHAR(50) NOT NULL,
                        -- 'trial'|'starter'|'pro'|'enterprise'|'lifetime'
  billing_cycle         VARCHAR(20),     -- 'monthly'|'yearly'|NULL (lifetime)
  status                VARCHAR(50) NOT NULL DEFAULT 'trialing',
                        -- 'trialing'|'active'|'past_due'|'canceled'|'unpaid'
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  trial_end             TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.12 Entity: `webhooks`

```sql
CREATE TABLE webhooks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  url             TEXT NOT NULL,
  secret          VARCHAR(64) NOT NULL,    -- HMAC signing secret
  events          TEXT[] NOT NULL,
                  -- ['post.published','post.failed','channel.disconnected']
  is_active       BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  failure_count   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3.13 Entity: `ai_generations`

```sql
CREATE TABLE ai_generations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  type            VARCHAR(50) NOT NULL,   -- 'text'|'image'|'rewrite'|'idea'
  prompt          TEXT NOT NULL,
  result          TEXT,
  credits_used    INTEGER DEFAULT 0,
  model           VARCHAR(100),           -- 'gpt-4o'|'dall-e-3'...
  status          VARCHAR(20) DEFAULT 'success', -- 'success'|'failed'
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_gen_org ON ai_generations(organization_id);
```

---

### 3.14 Entity: `auto_plugs` & `signatures`

```sql
CREATE TABLE auto_plugs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  channel_id      UUID REFERENCES channels(id),  -- NULL = áp dụng cho tất cả kênh
  content         TEXT NOT NULL,
  delay_minutes   INTEGER DEFAULT 5,             -- Đăng comment sau N phút
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE signatures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  content         TEXT NOT NULL,
  is_default      BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Module: Xác thực & Tài khoản

### 4.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-AUTH-01 | **Là** người dùng mới, **tôi muốn** đăng ký bằng email và mật khẩu **để** tạo tài khoản nhanh chóng | - Form gồm: Email, Tên, Mật khẩu, Xác nhận MK <br>- Mật khẩu tối thiểu 8 ký tự, có chữ hoa và số <br>- Email gửi xác thực sau khi đăng ký <br>- Không cho đăng ký nếu email đã tồn tại |
| US-AUTH-02 | **Là** người dùng, **tôi muốn** đăng nhập bằng Google **để** không phải nhớ mật khẩu | - Nút "Đăng nhập với Google" ở trang Login <br>- Tự tạo tài khoản mới nếu email chưa tồn tại <br>- Liên kết vào tài khoản cũ nếu email đã tồn tại |
| US-AUTH-03 | **Là** người dùng, **tôi muốn** đặt lại mật khẩu **để** lấy lại quyền truy cập khi quên | - Nhập email → Nhận link đặt lại (hết hạn sau 1 giờ) <br>- Link chỉ dùng được 1 lần <br>- Sau khi đặt lại xong, tất cả session cũ bị vô hiệu hóa |
| US-AUTH-04 | **Là** người dùng, **tôi muốn** xem và chỉnh sửa thông tin cá nhân **để** cập nhật hồ sơ | - Cập nhật được: Tên, Avatar, Timezone, Ngôn ngữ <br>- Avatar resize về 256x256 px trước khi lưu |

### 4.2 Business Rules

- **BR-AUTH-01:** JWT Access Token có thời hạn **15 phút**. Refresh Token có thời hạn **30 ngày**.
- **BR-AUTH-02:** Sau **5 lần** đăng nhập sai liên tiếp, tài khoản bị khóa **15 phút** (rate limiting qua Redis).
- **BR-AUTH-03:** Người dùng OAuth không thể đặt mật khẩu trừ khi tự yêu cầu qua flow "Add Password".
- **BR-AUTH-04:** Email xác thực có hiệu lực **24 giờ**. Sau đó cần yêu cầu gửi lại.
- **BR-AUTH-05:** Mỗi user chỉ có thể liên kết **1 tài khoản** từ mỗi provider OAuth (1 Google, 1 GitHub...).

### 4.3 API Endpoints

#### `POST /auth/register`

**Mô tả:** Đăng ký tài khoản mới bằng email/mật khẩu.

```
Request Body:
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "timezone": "Asia/Ho_Chi_Minh"    // optional, default: UTC
}

Response 201 Created:
{
  "message": "Đăng ký thành công. Vui lòng kiểm tra email để xác thực.",
  "userId": "uuid-here"
}

Errors:
  409 Conflict    → EMAIL_ALREADY_EXISTS
  422 Unprocessable → VALIDATION_ERROR (mô tả field lỗi)
```

---

#### `POST /auth/login`

```
Request Body:
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}

Response 200 OK:
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": {
    "id": "uuid",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "avatarUrl": null,
    "timezone": "Asia/Ho_Chi_Minh"
  }
}

Errors:
  401 Unauthorized → INVALID_CREDENTIALS
  403 Forbidden   → ACCOUNT_LOCKED (kèm lockUntil timestamp)
  403 Forbidden   → EMAIL_NOT_VERIFIED
```

---

#### `POST /auth/refresh`

```
Request Body:
{
  "refreshToken": "eyJ..."
}

Response 200 OK:
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."   // Refresh token mới (rotation)
}

Errors:
  401 Unauthorized → INVALID_REFRESH_TOKEN
  401 Unauthorized → REFRESH_TOKEN_EXPIRED
```

---

#### `POST /auth/logout`

```
Headers: Authorization: Bearer <accessToken>
Request Body: { "refreshToken": "eyJ..." }

Response 200 OK:
{
  "message": "Đăng xuất thành công."
}
```

---

#### `POST /auth/oauth/:provider`

```
Providers: google | github | authentik

Request Body:
{
  "code": "oauth-authorization-code",
  "redirectUri": "https://app.example.com/auth/callback"
}

Response 200 OK:  (giống /auth/login)
```

---

#### `POST /auth/forgot-password`

```
Request Body: { "email": "user@example.com" }

Response 200 OK:
{
  "message": "Nếu email tồn tại, link đặt lại đã được gửi."
}
// Luôn trả 200 dù email không tồn tại (chống enumeration attack)
```

---

#### `POST /auth/reset-password`

```
Request Body:
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecureP@ss123"
}

Response 200 OK: { "message": "Mật khẩu đã được đặt lại thành công." }

Errors:
  400 Bad Request → INVALID_RESET_TOKEN
  410 Gone        → RESET_TOKEN_EXPIRED
```

---

## 5. Module: Quản lý Tổ chức & Phân quyền

### 5.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-ORG-01 | **Là** người dùng mới, **tôi muốn** tạo một Tổ chức **để** bắt đầu làm việc | - Nhập Tên và Slug (auto-generate từ tên, có thể chỉnh) <br>- Được tự động gán vai trò Owner <br>- Bắt đầu với gói Trial 14 ngày |
| US-ORG-02 | **Là** Owner, **tôi muốn** mời thành viên vào Tổ chức **để** cộng tác | - Nhập email + chọn vai trò khi mời <br>- Người được mời nhận email với link chấp nhận (hết hạn 7 ngày) <br>- Hiển thị danh sách pending invitations |
| US-ORG-03 | **Là** Admin, **tôi muốn** thay đổi vai trò thành viên **để** điều chỉnh quyền hạn | - Không thể thay đổi vai trò của Owner <br>- Chỉ Owner mới thay đổi được vai trò Admin |
| US-ORG-04 | **Là** người dùng, **tôi muốn** chuyển đổi giữa các Tổ chức **để** làm việc đa dự án | - Dropdown chọn Tổ chức ở header <br>- Mỗi Tổ chức có context dữ liệu hoàn toàn độc lập |

### 5.2 Ma trận Phân quyền (RBAC)

| Hành động | Owner | Admin | Editor | Viewer |
|---|:---:|:---:|:---:|:---:|
| Xem bài đăng | ✅ | ✅ | ✅ | ✅ |
| Tạo / Sửa bài đăng | ✅ | ✅ | ✅ | ❌ |
| Xoá bài đăng | ✅ | ✅ | Chỉ của mình | ❌ |
| Kết nối kênh MXH | ✅ | ✅ | ❌ | ❌ |
| Mời thành viên | ✅ | ✅ | ❌ | ❌ |
| Thay đổi vai trò | ✅ | Admin trở xuống | ❌ | ❌ |
| Xoá thành viên | ✅ | Admin trở xuống | ❌ | ❌ |
| Xem Analytics | ✅ | ✅ | ✅ | ✅ |
| Cài đặt Tổ chức | ✅ | ✅ | ❌ | ❌ |
| Quản lý Billing | ✅ | ❌ | ❌ | ❌ |
| Xoá Tổ chức | ✅ | ❌ | ❌ | ❌ |
| Tạo / Xoá Webhook | ✅ | ✅ | ❌ | ❌ |

### 5.3 Business Rules

- **BR-ORG-01:** Mỗi Tổ chức phải có **ít nhất 1 Owner**. Owner không thể rời Tổ chức nếu chưa chuyển giao quyền Owner cho người khác.
- **BR-ORG-02:** Slug của Tổ chức là **bất biến** sau khi tạo (ảnh hưởng đến URL công khai).
- **BR-ORG-03:** Số lượng thành viên tối đa phụ thuộc gói cước: Trial=3, Starter=5, Pro=15, Enterprise=Unlimited.
- **BR-ORG-04:** Số lượng kênh MXH tối đa: Trial=3, Starter=5, Pro=20, Enterprise=Unlimited.

### 5.4 API Endpoints

#### `POST /organizations`

```
Request Body:
{
  "name": "Agency ABC",
  "slug": "agency-abc",         // optional, auto-gen nếu không có
  "timezone": "Asia/Ho_Chi_Minh"
}

Response 201 Created:
{
  "id": "uuid",
  "name": "Agency ABC",
  "slug": "agency-abc",
  "timezone": "Asia/Ho_Chi_Minh",
  "subscriptionPlan": "trial",
  "trialEndsAt": "2026-05-10T00:00:00Z"
}

Errors:
  409 → SLUG_ALREADY_EXISTS
```

---

#### `POST /organizations/:orgId/members/invite`

```
Request Body:
{
  "email": "colleague@example.com",
  "role": "editor"    // 'admin'|'editor'|'viewer'
}

Response 201 Created:
{
  "invitationId": "uuid",
  "email": "colleague@example.com",
  "role": "editor",
  "expiresAt": "2026-05-03T00:00:00Z"
}

Errors:
  403 → INSUFFICIENT_PERMISSION
  409 → MEMBER_ALREADY_EXISTS
  422 → MEMBER_LIMIT_EXCEEDED (kèm currentPlan, limit)
```

---

#### `PATCH /organizations/:orgId/members/:userId`

```
Request Body: { "role": "admin" }

Response 200 OK:
{
  "userId": "uuid",
  "role": "admin",
  "updatedAt": "2026-04-26T10:00:00Z"
}

Errors:
  403 → CANNOT_CHANGE_OWNER_ROLE
  403 → INSUFFICIENT_PERMISSION
```

---

## 6. Module: Quản lý Bài đăng & Lên lịch

### 6.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-POST-01 | **Là** Editor, **tôi muốn** soạn thảo bài đăng **để** chuẩn bị nội dung | - Rich text editor hỗ trợ: **Bold**, *Italic*, Link, @mention <br>- Đếm ký tự realtime, cảnh báo vượt giới hạn từng nền tảng <br>- Auto-save nháp mỗi 30 giây |
| US-POST-02 | **Là** Editor, **tôi muốn** chọn nhiều kênh để đăng đồng thời **để** tiết kiệm thời gian | - Checkbox chọn từng kênh hoặc "Chọn tất cả" <br>- Hiển thị avatar và tên kênh <br>- Cảnh báo nếu token kênh hết hạn |
| US-POST-03 | **Là** Editor, **tôi muốn** lên lịch đăng bài **để** đăng đúng giờ vàng | - Date-time picker hiển thị theo timezone của Tổ chức <br>- Cảnh báo nếu chọn thời gian trong quá khứ <br>- Hiển thị "Sẽ đăng lúc X giờ (giờ địa phương của bạn)" |
| US-POST-04 | **Là** Editor, **tôi muốn** tạo Thread **để** đăng nội dung dài | - Nút "+ Thêm phần" bên dưới mỗi phần <br>- Hiển thị số thứ tự (1/3, 2/3...) <br>- Mỗi phần có giới hạn ký tự riêng theo nền tảng |
| US-POST-05 | **Là** Editor, **tôi muốn** xem lịch đăng bài dạng Calendar **để** có cái nhìn tổng quan | - Hiển thị Calendar tháng/tuần <br>- Bài đăng được tô màu theo nền tảng hoặc tag <br>- Click vào bài đăng trên lịch để xem/sửa nhanh |
| US-POST-06 | **Là** Editor, **tôi muốn** thiết lập lặp bài định kỳ **để** tái sử dụng nội dung tốt | - Chọn số ngày lặp lại (7, 14, 30...) hoặc tùy chỉnh <br>- Hiển thị ngày đăng tiếp theo dự kiến <br>- Có thể dừng lặp bất kỳ lúc nào |

### 6.2 Business Rules

- **BR-POST-01:** Giới hạn ký tự theo nền tảng: X=280, Facebook=63,206, LinkedIn=3,000, Instagram=2,200, TikTok=2,200. Hệ thống **cảnh báo** nhưng không chặn soạn thảo.
- **BR-POST-02:** Một bài đăng phải có ít nhất **1 kênh** được chọn trước khi lên lịch.
- **BR-POST-03:** Thời gian lên lịch phải **sau thời điểm hiện tại ít nhất 2 phút**.
- **BR-POST-04:** Bài đăng `PUBLISHED` hoặc `PROCESSING` không thể chỉnh sửa nội dung hay thời gian.
- **BR-POST-05:** Khi Worker xử lý đăng bài, trạng thái chuyển thành `PROCESSING` ngay lập tức — ngăn Worker khác đọc trùng.
- **BR-POST-06:** Nếu đăng thất bại, hệ thống tự động **retry tối đa 3 lần** với khoảng cách 5 phút. Sau 3 lần vẫn lỗi thì chuyển `FAILED`.
- **BR-POST-07:** Số bài đăng lên lịch tối đa: Trial=10/tháng, Starter=100/tháng, Pro=Unlimited.

### 6.3 API Endpoints

#### `POST /organizations/:orgId/posts`

```
Request Body:
{
  "content": "Nội dung bài đăng #hashtag",
  "channelIds": ["uuid-channel-1", "uuid-channel-2"],
  "publishDate": "2026-04-28T08:00:00Z",   // optional, null = đăng ngay
  "mediaIds": ["uuid-media-1"],             // optional
  "tagIds": ["uuid-tag-1"],                 // optional
  "intervalInDays": 7,                      // optional, null = không lặp
  "thread": [                               // optional, null = không phải Thread
    { "content": "Phần 1 của thread" },
    { "content": "Phần 2 của thread" }
  ]
}

Response 201 Created:
{
  "id": "uuid",
  "content": "Nội dung bài đăng #hashtag",
  "status": "pending",
  "publishDate": "2026-04-28T08:00:00Z",
  "channels": [
    { "id": "uuid", "platform": "facebook", "name": "Page ABC", "status": "pending" }
  ],
  "createdAt": "2026-04-26T10:00:00Z"
}

Errors:
  400 → NO_CHANNEL_SELECTED
  400 → PUBLISH_DATE_IN_PAST
  402 → POST_QUOTA_EXCEEDED
  422 → CHANNEL_TOKEN_EXPIRED (kèm channelId)
```

---

#### `GET /organizations/:orgId/posts`

```
Query Params:
  status    = draft | pending | published | failed    (optional)
  channelId = uuid                                    (optional)
  tagId     = uuid                                    (optional)
  from      = ISO date                                (optional)
  to        = ISO date                                (optional)
  page      = integer (default: 1)
  limit     = integer (default: 20, max: 100)

Response 200 OK:
{
  "data": [ ...posts ],
  "meta": {
    "total": 142,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

#### `PATCH /organizations/:orgId/posts/:postId`

```
Request Body: (chỉ gửi các field muốn thay đổi)
{
  "content": "Nội dung mới",
  "publishDate": "2026-04-29T09:00:00Z",
  "channelIds": ["uuid-channel-2"]
}

Errors:
  409 → POST_ALREADY_PUBLISHED
  409 → POST_IS_PROCESSING
```

---

#### `DELETE /organizations/:orgId/posts/:postId`

```
Response 200 OK: { "message": "Đã hủy và xóa bài đăng." }

Errors:
  409 → CANNOT_DELETE_PUBLISHED_POST
```

---

#### `POST /organizations/:orgId/posts/:postId/publish-now`

```
(Đăng ngay lập tức, bỏ qua lịch hẹn)

Response 200 OK:
{
  "message": "Đang xử lý đăng bài...",
  "estimatedTime": "< 30 giây"
}
```

---

## 7. Module: Tích hợp Mạng Xã hội

### 7.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-SOCIAL-01 | **Là** Admin, **tôi muốn** kết nối Facebook Page **để** đăng bài lên Page đó | - Click "Kết nối Facebook" → Pop-up OAuth Meta <br>- Chọn Page muốn kết nối (hiển thị danh sách Pages) <br>- Hiển thị icon ✅ và tên Page sau khi kết nối thành công |
| US-SOCIAL-02 | **Là** Admin, **tôi muốn** nhận thông báo khi token hết hạn **để** kết nối lại kịp thời | - Banner cảnh báo đỏ xuất hiện ở header <br>- Email tự động gửi 3 ngày trước khi token hết hạn <br>- Nút "Kết nối lại" một click |
| US-SOCIAL-03 | **Là** Admin, **tôi muốn** xem trạng thái của tất cả kênh đã kết nối **để** giám sát | - Danh sách kênh với: Logo nền tảng, Tên, Trạng thái, Ngày kết nối <br>- Trạng thái: Hoạt động 🟢 / Sắp hết hạn 🟡 / Cần kết nối lại 🔴 |

### 7.2 Business Rules

- **BR-SOCIAL-01:** Access Token phải được mã hóa bằng AES-256-GCM với key riêng của môi trường trước khi lưu vào DB.
- **BR-SOCIAL-02:** Hệ thống tự động kiểm tra và làm mới (refresh) token **trước khi hết hạn 7 ngày** nếu platform hỗ trợ refresh flow.
- **BR-SOCIAL-03:** Nếu refresh token thất bại, set `refresh_needed = TRUE` và gửi email + in-app notification ngay lập tức.
- **BR-SOCIAL-04:** Một tài khoản mạng xã hội chỉ được kết nối vào **1 Tổ chức** tại một thời điểm (ngăn chia sẻ token giữa các khách hàng).

### 7.3 API Endpoints

#### `GET /organizations/:orgId/channels/connect/:platform`

```
Redirect người dùng đến URL OAuth của nền tảng tương ứng.

Platforms: facebook | instagram | x | linkedin | tiktok | youtube | reddit | slack | discord | mastodon | bluesky

Query Params: redirectUri (URL callback sau OAuth)
```

---

#### `GET /organizations/:orgId/channels/callback/:platform`

```
(Được gọi bởi nền tảng MXH sau khi user xác nhận OAuth)

Query Params: code, state

Response: Redirect về /channels với flash message "Kết nối thành công!"

Errors:
  400 → OAUTH_STATE_MISMATCH
  409 → CHANNEL_ALREADY_CONNECTED_BY_OTHER_ORG
```

---

#### `GET /organizations/:orgId/channels`

```
Response 200 OK:
{
  "data": [
    {
      "id": "uuid",
      "platform": "facebook",
      "name": "Page ABC",
      "avatarUrl": "https://...",
      "isActive": true,
      "refreshNeeded": false,
      "tokenExpiresAt": "2026-07-01T00:00:00Z",
      "connectedAt": "2026-01-15T08:00:00Z"
    }
  ]
}
```

---

#### `DELETE /organizations/:orgId/channels/:channelId`

```
Response 200 OK: { "message": "Đã ngắt kết nối kênh." }

Business rule: Các bài đăng PENDING trên kênh này sẽ bị chuyển thành CANCELLED.
```

---

## 8. Module: Trí tuệ Nhân tạo (AI)

### 8.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-AI-01 | **Là** Editor, **tôi muốn** AI viết bài cho tôi từ một ý tưởng ngắn **để** tiết kiệm thời gian | - Nhập ý tưởng (tối thiểu 10 ký tự) <br>- Chọn tone: Chuyên nghiệp / Vui vẻ / Bán hàng / Giáo dục <br>- Chọn nền tảng mục tiêu (ảnh hưởng độ dài output) <br>- Kết quả xuất hiện trong 10 giây <br>- Nút "Sử dụng", "Viết lại", "Thay đổi tone" |
| US-AI-02 | **Là** Editor, **tôi muốn** AI viết lại bài của tôi **để** cải thiện chất lượng | - Chọn đoạn text trong editor → Nút "Viết lại với AI" <br>- Chọn lý do: Ngắn hơn / Dài hơn / Chuyên nghiệp hơn / Đơn giản hơn <br>- Hiển thị bản gốc và bản mới cạnh nhau để so sánh |
| US-AI-03 | **Là** Editor, **tôi muốn** AI tạo hình ảnh minh họa **để** làm phong phú bài đăng | - Nhập mô tả hình ảnh bằng tiếng Việt hoặc Anh <br>- Chọn tỉ lệ: Vuông (1:1) / Ngang (16:9) / Dọc (9:16) <br>- Tiêu tốn Credits (hiển thị trước khi tạo) <br>- Hình ảnh được tự động lưu vào Media Library |

### 8.2 Business Rules

- **BR-AI-01:** Chi phí Credits: Sinh text = 1 credit/lần, Viết lại = 1 credit/lần, Sinh ảnh = 5 credits/ảnh.
- **BR-AI-02:** Nếu Credits về 0, toàn bộ tính năng AI bị tạm khóa. Hiển thị prompt mua thêm Credits.
- **BR-AI-03:** Kết quả AI không được tự động đăng — luôn phải có xác nhận của người dùng.
- **BR-AI-04:** Lưu lịch sử tất cả AI generation vào bảng `ai_generations` để audit và tính toán chi phí.

### 8.3 API Endpoints

#### `POST /organizations/:orgId/ai/generate-text`

```
Request Body:
{
  "prompt": "Viết bài về lợi ích của cà phê buổi sáng",
  "platform": "linkedin",   // Ảnh hưởng độ dài và format output
  "tone": "professional",   // professional | casual | sales | educational
  "language": "vi"          // vi | en
}

Response 200 OK:
{
  "generationId": "uuid",
  "content": "Mỗi buổi sáng, một tách cà phê không chỉ là...",
  "creditsUsed": 1,
  "creditsRemaining": 49
}

Errors:
  402 → INSUFFICIENT_CREDITS (kèm creditsRequired, creditsAvailable)
  503 → AI_SERVICE_UNAVAILABLE
```

---

#### `POST /organizations/:orgId/ai/rewrite`

```
Request Body:
{
  "originalContent": "Bài viết gốc...",
  "instruction": "shorter"   // shorter | longer | professional | simpler
}

Response 200 OK:
{
  "generationId": "uuid",
  "originalContent": "...",
  "rewrittenContent": "...",
  "creditsUsed": 1
}
```

---

#### `POST /organizations/:orgId/ai/generate-image`

```
Request Body:
{
  "prompt": "Tách cà phê trên bàn gỗ, ánh sáng buổi sáng, phong cách minimalist",
  "aspectRatio": "square",  // square | landscape | portrait
  "style": "photorealistic" // photorealistic | illustration | cartoon
}

Response 200 OK:
{
  "generationId": "uuid",
  "imageUrl": "https://cdn.example.com/ai/generated/uuid.png",
  "mediaId": "uuid",        // Đã lưu vào Media Library
  "creditsUsed": 5
}
```

---

## 9. Module: Thư viện Media

### 9.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-MEDIA-01 | **Là** Editor, **tôi muốn** upload ảnh/video **để** đính kèm vào bài đăng | - Hỗ trợ drag & drop và click chọn file <br>- Cho phép upload nhiều file cùng lúc (tối đa 10 file/lần) <br>- Hiển thị progress bar cho từng file <br>- File được kiểm tra loại và kích thước trước khi upload |
| US-MEDIA-02 | **Là** Editor, **tôi muốn** chỉnh sửa ảnh trước khi đăng **để** tạo nội dung đẹp hơn | - Nút "Mở trong Editor" → Polotno Studio mở ngay trong app <br>- Lưu bản chỉnh sửa thành file mới (không ghi đè bản gốc) |

### 9.2 Business Rules

- **BR-MEDIA-01:** Giới hạn kích thước file: Ảnh tối đa **20MB**, Video tối đa **500MB**.
- **BR-MEDIA-02:** Định dạng ảnh hỗ trợ: JPEG, PNG, GIF, WebP. Video: MP4, MOV, AVI.
- **BR-MEDIA-03:** Dung lượng lưu trữ theo gói: Trial=1GB, Starter=10GB, Pro=100GB, Enterprise=Unlimited.
- **BR-MEDIA-04:** Upload file sử dụng **presigned URL** từ R2/S3 — file được upload trực tiếp từ browser lên storage, không qua API server (giảm tải server).
- **BR-MEDIA-05:** Ảnh có thể được reuse trong nhiều bài đăng (không tạo bản sao vật lý).

### 9.3 API Endpoints

#### `POST /organizations/:orgId/media/presign`

```
(Bước 1: Lấy presigned URL để upload trực tiếp lên storage)

Request Body:
{
  "fileName": "photo.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 2048576
}

Response 200 OK:
{
  "uploadUrl": "https://r2.cloudflarestorage.com/bucket/...?X-Amz-Signature=...",
  "mediaId": "uuid",          // Đã tạo record trong DB, status = uploading
  "expiresIn": 900            // seconds
}

Errors:
  400 → UNSUPPORTED_FILE_TYPE
  400 → FILE_TOO_LARGE (kèm maxSize)
  402 → STORAGE_QUOTA_EXCEEDED
```

---

#### `POST /organizations/:orgId/media/:mediaId/confirm`

```
(Bước 2: Xác nhận upload thành công, kích hoạt xử lý metadata)

Response 200 OK:
{
  "id": "uuid",
  "fileName": "photo.jpg",
  "storageUrl": "https://cdn.example.com/org-id/photo.jpg",
  "width": 1920,
  "height": 1080,
  "fileSize": 2048576,
  "mimeType": "image/jpeg"
}
```

---

#### `GET /organizations/:orgId/media`

```
Query Params:
  type    = image | video
  search  = keyword
  page    = 1
  limit   = 30

Response 200 OK:
{
  "data": [ ...mediaItems ],
  "meta": { "total": 85, "storageUsed": 524288000, "storageLimit": 10737418240 }
}
```

---

## 10. Module: Thanh toán & Gói cước

### 10.1 Bảng So sánh Gói cước

| Tính năng | Trial | Starter | Pro | Enterprise |
|---|:---:|:---:|:---:|:---:|
| **Thời hạn** | 14 ngày | — | — | — |
| **Thành viên** | 3 | 5 | 15 | Không giới hạn |
| **Kênh MXH** | 3 | 5 | 20 | Không giới hạn |
| **Bài đăng/tháng** | 10 | 100 | Không giới hạn | Không giới hạn |
| **Dung lượng lưu trữ** | 1 GB | 10 GB | 100 GB | Tuỳ chỉnh |
| **AI Credits/tháng** | 10 | 50 | 200 | Tuỳ chỉnh |
| **Tính năng AI** | ❌ | ✅ Cơ bản | ✅ Đầy đủ | ✅ Đầy đủ |
| **Public API** | ❌ | ❌ | ✅ | ✅ |
| **Webhooks** | ❌ | ❌ | ✅ | ✅ |
| **Analytics nâng cao** | ❌ | ✅ | ✅ | ✅ |

### 10.2 Business Rules

- **BR-BILL-01:** Khi Trial hết hạn, Tổ chức chuyển sang trạng thái **Locked** — đọc được dữ liệu cũ nhưng không tạo được bài mới, không kết nối thêm kênh.
- **BR-BILL-02:** Khi hạ cấp gói, các dữ liệu vượt giới hạn mới (kênh, thành viên) được **giữ nguyên nhưng bị vô hiệu hóa**. Khi nâng cấp lại, tự động kích hoạt lại.
- **BR-BILL-03:** Stripe Webhook phải xử lý các events: `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`.
- **BR-BILL-04:** Hoàn tiền (Refund) được thực hiện qua Stripe Dashboard nội bộ, không tự động.

### 10.3 API Endpoints

#### `POST /organizations/:orgId/billing/checkout`

```
Request Body:
{
  "plan": "pro",
  "billingCycle": "yearly",
  "successUrl": "https://app.example.com/billing/success",
  "cancelUrl": "https://app.example.com/billing/cancel"
}

Response 200 OK:
{
  "checkoutUrl": "https://checkout.stripe.com/c/pay/..."
}
```

---

#### `POST /billing/webhooks/stripe`

```
(Endpoint nhận Stripe Webhook Events)
Headers: Stripe-Signature: ...

Xử lý events:
- invoice.paid              → Kích hoạt/gia hạn subscription
- invoice.payment_failed    → Gửi email cảnh báo, chuyển status = past_due
- customer.subscription.deleted → Khóa tính năng, gửi email thông báo
- checkout.session.completed → Kích hoạt subscription mới
```

---

#### `GET /organizations/:orgId/billing`

```
Response 200 OK:
{
  "plan": "pro",
  "status": "active",
  "billingCycle": "yearly",
  "currentPeriodEnd": "2027-04-26T00:00:00Z",
  "cancelAtPeriodEnd": false,
  "credits": 145,
  "usage": {
    "posts": { "used": 234, "limit": null },
    "members": { "used": 7, "limit": 15 },
    "channels": { "used": 12, "limit": 20 },
    "storage": { "usedBytes": 5368709120, "limitBytes": 107374182400 }
  }
}
```

---

## 11. Module: API & Webhooks

### 11.1 User Stories

| ID | User Story | Acceptance Criteria |
|---|---|---|
| US-API-01 | **Là** Developer, **tôi muốn** tạo API Key **để** tích hợp hệ thống với Zapier/Make | - Tạo API Key trong Settings → Integrations <br>- Key chỉ hiển thị **một lần** ngay sau khi tạo <br>- Có thể đặt tên cho Key (ví dụ: "Zapier integration") <br>- Có thể thu hồi (revoke) Key bất kỳ lúc nào |
| US-API-02 | **Là** Developer, **tôi muốn** cấu hình Webhook **để** nhận thông báo khi bài đăng thành công | - Nhập URL endpoint nhận Webhook <br>- Chọn events muốn lắng nghe <br>- Nút "Test Webhook" gửi một request mẫu <br>- Xem lịch sử 50 webhook calls gần nhất |

### 11.2 Business Rules

- **BR-API-01:** API Key được hash (SHA-256) trước khi lưu vào DB. Không thể khôi phục key gốc — chỉ có thể tạo key mới.
- **BR-API-02:** Rate limit Public API: **1,000 requests/giờ** per API Key.
- **BR-API-03:** Webhook request timeout là **10 giây**. Retry tối đa **3 lần** với exponential backoff (5s, 25s, 125s).
- **BR-API-04:** Webhook request được ký bằng HMAC-SHA256 với secret của webhook. Header: `X-Webhook-Signature: sha256=...`
- **BR-API-05:** Nếu Webhook thất bại liên tiếp **10 lần**, tự động vô hiệu hóa webhook và gửi email thông báo.

### 11.3 Webhook Event Payload Examples

#### Event: `post.published`

```json
{
  "event": "post.published",
  "timestamp": "2026-04-28T08:00:05Z",
  "organizationId": "uuid",
  "data": {
    "postId": "uuid",
    "content": "Nội dung bài đăng...",
    "publishedAt": "2026-04-28T08:00:05Z",
    "channels": [
      {
        "channelId": "uuid",
        "platform": "facebook",
        "status": "published",
        "platformPostId": "123456789_987654321",
        "platformPostUrl": "https://facebook.com/..."
      }
    ]
  }
}
```

#### Event: `channel.token_expired`

```json
{
  "event": "channel.token_expired",
  "timestamp": "2026-04-28T08:00:00Z",
  "organizationId": "uuid",
  "data": {
    "channelId": "uuid",
    "platform": "x",
    "channelName": "@myaccount",
    "reconnectUrl": "https://app.example.com/channels"
  }
}
```

---

## 12. Đặc tả UI/UX Từng Màn hình

### 12.1 Trang Đăng nhập / Đăng ký (`/login`, `/register`)

**Layout:** Chia đôi — Trái: Minh họa/slogan, Phải: Form xác thực.

**Thành phần:**
- Logo ứng dụng (góc trên trái).
- Tiêu đề: "Quản lý mạng xã hội thông minh hơn."
- Form đăng nhập/đăng ký với validation inline (lỗi hiện ngay bên dưới field).
- Nút OAuth: "Tiếp tục với Google" (biểu tượng Google), "Tiếp tục với GitHub".
- Divider "Hoặc" giữa OAuth và form.
- Link chuyển đổi: "Chưa có tài khoản? Đăng ký" / "Đã có tài khoản? Đăng nhập".

**Trạng thái tương tác:**
- Submit button: Loading spinner khi đang gọi API.
- Field email: Kiểm tra định dạng email on-blur.
- Field password: Hiển thị/ẩn mật khẩu (icon mắt).

---

### 12.2 Dashboard Chính (`/dashboard`)

**Layout:** Sidebar trái cố định + Content area chính.

**Sidebar (200px):**
- Avatar + Tên + Dropdown chọn Workspace ở đầu.
- Menu điều hướng: Dashboard, Tạo bài, Lịch đăng, Media, Analytics, Cài đặt.
- Badge thông báo đỏ nếu có kênh cần kết nối lại.
- Usage bar dung lượng ở cuối sidebar.

**Content: Dashboard Overview:**
- Thẻ thống kê (Stats Cards): Tổng bài đã đăng (30 ngày), Bài đang chờ, Lỗi đăng bài.
- Biểu đồ đường: Hoạt động đăng bài theo ngày (14 ngày gần nhất).
- Bảng: 5 bài đăng sắp tới gần nhất.
- Quick Action: Nút nổi "Tạo bài mới" (FAB) góc dưới phải.

---

### 12.3 Màn hình Soạn thảo Bài đăng (`/posts/new`)

**Layout:** 2 cột — Trái (65%): Editor, Phải (35%): Cài đặt & Preview.

**Cột Trái — Editor:**
- Rich Text Editor (TipTap): Toolbar trên cùng (Bold, Italic, Link, Emoji, @mention).
- Đếm ký tự theo platform được chọn, màu vàng khi > 80%, đỏ khi vượt giới hạn.
- Nút "AI Viết cho tôi" (sparkle icon) mở panel AI.
- Khu vực drag & drop upload ảnh/video hoặc "Chọn từ thư viện".
- Preview thumbnail ảnh đính kèm với nút xóa.

**Panel AI (Slide-in từ phải):**
- Textarea nhập ý tưởng.
- Dropdown: Tone, Nền tảng, Ngôn ngữ.
- Nút "Tạo nội dung" — hiển thị số credits sẽ dùng.
- Kết quả hiển thị với nút "Sử dụng" / "Viết lại".

**Cột Phải — Cài đặt:**
- **Chọn Kênh:** Danh sách checkboxes kênh với avatar + tên. Badge 🔴 nếu token hết hạn.
- **Thời gian đăng:** Toggle "Đăng ngay" / "Lên lịch". Date-time picker nếu chọn lên lịch.
- **Lặp lại:** Toggle bật/tắt + Input số ngày.
- **Tags:** Multi-select với color dots.
- **Preview tab:** Chuyển đổi xem bài đăng sẽ trông như thế nào trên từng nền tảng.

**Footer:**
- Nút "Lưu nháp" (outline) + Nút "Lên lịch / Đăng ngay" (primary).

---

### 12.4 Màn hình Lịch Đăng bài (`/calendar`)

**Layout:** Full-width Calendar view.

**Thanh công cụ trên cùng:**
- Nút prev/next tháng + tiêu đề tháng.
- Toggle: Xem tháng / Xem tuần.
- Bộ lọc: Kênh (multi-select), Tags (multi-select).

**Calendar Grid:**
- Mỗi ô ngày hiển thị tối đa 3 bài đăng dạng pill (tô màu theo platform hoặc tag).
- Nếu quá 3 bài: hiển thị "+2 more" → click mở popover.
- Click vào bài đăng: Mở Quick Preview Card (Tên kênh, snippet nội dung, giờ đăng, status).
- Click "Sửa" trên Quick Preview Card → Mở modal soạn thảo.
- Kéo thả bài đăng giữa các ngày để đổi lịch.

---

### 12.5 Màn hình Quản lý Kênh (`/channels`)

**Layout:** Grid cards.

**Thanh công cụ:**
- Nút "Kết nối kênh mới" → Mở modal chọn nền tảng.

**Modal Chọn nền tảng:**
- Grid icon các nền tảng hỗ trợ: Facebook, Instagram, X, LinkedIn, TikTok, YouTube...
- Click vào nền tảng → Redirect OAuth.

**Danh sách Kênh đã kết nối (Cards):**
- Avatar tài khoản + Logo nền tảng (badge góc).
- Tên tài khoản + URL hồ sơ.
- Badge trạng thái: `Đang hoạt động` (xanh) / `Sắp hết hạn` (vàng) / `Cần kết nối lại` (đỏ).
- Menu ··· (3 chấm): Kết nối lại / Ngắt kết nối.

---

### 12.6 Màn hình Cài đặt Tổ chức (`/settings`)

**Layout:** Sidebar phụ + Content.

**Sidebar phụ:** General, Thành viên, Billing, Webhooks, API Keys, Nguy hiểm.

**Tab General:**
- Upload logo Tổ chức.
- Tên Tổ chức (có thể sửa).
- Slug (chỉ đọc sau khi tạo — tooltip giải thích lý do).
- Dropdown múi giờ.

**Tab Thành viên:**
- Bảng danh sách: Avatar, Tên, Email, Vai trò (dropdown), Ngày tham gia, Hành động (Xóa).
- Section "Lời mời đang chờ": Email, Vai trò, Ngày hết hạn, Nút Hủy mời.
- Nút "Mời thành viên" mở modal.

**Tab Billing:**
- Card gói hiện tại: Tên gói, Chu kỳ, Ngày gia hạn tiếp theo, Nút "Nâng cấp" / "Hủy gói".
- Thanh tiêu thụ (Progress bars): Bài đăng, Thành viên, Kênh, Dung lượng.
- Bảng lịch sử thanh toán (Ngày, Số tiền, Trạng thái, Link hóa đơn PDF).

**Tab Webhooks:**
- Nút "Tạo Webhook" mở modal (URL, chọn events).
- Bảng webhooks: URL, Events, Trạng thái, Lần gọi gần nhất, Menu ···.
- Click vào Webhook → Xem 50 lần gọi gần nhất (timestamp, status code, thời gian phản hồi).

---

## 13. Yêu cầu Phi Chức năng

### 13.1 Hiệu năng

| ID | Yêu cầu | Phương pháp Đo |
|---|---|---|
| PERF-01 | API p95 latency < 500ms (không tính AI endpoints) | Datadog APM |
| PERF-02 | API p99 latency < 2,000ms | Datadog APM |
| PERF-03 | First Contentful Paint (FCP) < 1.5s | Lighthouse CI |
| PERF-04 | Largest Contentful Paint (LCP) < 2.5s | Lighthouse CI |
| PERF-05 | Worker xử lý 1,000 bài/phút tại thời điểm peak | Load test (k6) |
| PERF-06 | Truy vấn DB thường xuyên nhất (post list) < 50ms | Prisma Query Log |

### 13.2 Bảo mật

| ID | Yêu cầu |
|---|---|
| SEC-01 | Toàn bộ HTTP traffic sử dụng TLS 1.2+ |
| SEC-02 | OAuth Token lưu trong DB phải được mã hóa AES-256-GCM |
| SEC-03 | API Key lưu dưới dạng SHA-256 hash, không lưu giá trị gốc |
| SEC-04 | Áp dụng OWASP Top 10 — kiểm tra định kỳ bằng OWASP ZAP |
| SEC-05 | Rate limiting: Auth endpoints = 10 req/min/IP; API = 1,000 req/h/key |
| SEC-06 | Content Security Policy (CSP) headers được cấu hình chặt chẽ |
| SEC-07 | SQL Injection: Toàn bộ query đi qua Prisma ORM (parameterized queries) |
| SEC-08 | XSS: Nội dung user-generated được sanitize trước khi render |
| SEC-09 | Webhook payload được ký HMAC-SHA256, receiver phải verify chữ ký |
| SEC-10 | Sensitive data (token, key) không được log vào bất kỳ hệ thống log nào |

### 13.3 Khả năng Mở rộng

| ID | Yêu cầu |
|---|---|
| SCALE-01 | API Server stateless — có thể chạy nhiều instance sau Load Balancer |
| SCALE-02 | Worker Service dùng Redis Distributed Lock để tránh xử lý trùng bài |
| SCALE-03 | Database connection pooling tối thiểu 20 connections per API instance |
| SCALE-04 | Tất cả file media đi qua CDN (Cloudflare) — không serve từ API server |

### 13.4 Giám sát & Logging

| ID | Yêu cầu |
|---|---|
| OPS-01 | Mọi API request phải log: method, path, status code, latency, userId |
| OPS-02 | Mọi Worker job phải log: jobId, postId, platform, status, duration |
| OPS-03 | Alert tự động khi: Error rate > 5%, Worker queue backlog > 1,000, DB CPU > 80% |
| OPS-04 | Giữ log tối thiểu **90 ngày** |
| OPS-05 | Health check endpoint `GET /health` trả về trạng thái DB, Redis, Queue |

---

## 14. Xử lý Lỗi & Mã Lỗi Chuẩn

### 14.1 Cấu trúc Response Lỗi

Mọi API error đều trả về cấu trúc JSON nhất quán:

```json
{
  "statusCode": 409,
  "error": "SLUG_ALREADY_EXISTS",
  "message": "Tên định danh 'agency-abc' đã được sử dụng. Vui lòng chọn tên khác.",
  "timestamp": "2026-04-26T10:00:00Z",
  "path": "/api/organizations",
  "details": {
    "field": "slug",
    "value": "agency-abc"
  }
}
```

### 14.2 Bảng Mã Lỗi

| HTTP Code | Error Code | Mô tả |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Dữ liệu đầu vào không hợp lệ |
| 400 | `PUBLISH_DATE_IN_PAST` | Thời gian lên lịch đã qua |
| 400 | `NO_CHANNEL_SELECTED` | Chưa chọn kênh đăng bài |
| 400 | `FILE_TOO_LARGE` | File vượt giới hạn cho phép |
| 400 | `UNSUPPORTED_FILE_TYPE` | Định dạng file không hỗ trợ |
| 401 | `UNAUTHORIZED` | Chưa đăng nhập hoặc token hết hạn |
| 401 | `INVALID_CREDENTIALS` | Sai email/mật khẩu |
| 401 | `INVALID_REFRESH_TOKEN` | Refresh token không hợp lệ |
| 401 | `REFRESH_TOKEN_EXPIRED` | Refresh token đã hết hạn |
| 403 | `INSUFFICIENT_PERMISSION` | Không đủ quyền thực hiện hành động |
| 403 | `ACCOUNT_LOCKED` | Tài khoản tạm khóa do đăng nhập sai nhiều lần |
| 403 | `ORGANIZATION_LOCKED` | Tổ chức bị khóa do hết trial/quá hạn thanh toán |
| 404 | `RESOURCE_NOT_FOUND` | Tài nguyên yêu cầu không tồn tại |
| 409 | `EMAIL_ALREADY_EXISTS` | Email đã được đăng ký |
| 409 | `SLUG_ALREADY_EXISTS` | Slug đã tồn tại |
| 409 | `MEMBER_ALREADY_EXISTS` | Thành viên đã trong Tổ chức |
| 409 | `POST_ALREADY_PUBLISHED` | Không thể sửa bài đã đăng |
| 409 | `CHANNEL_ALREADY_CONNECTED` | Kênh đã được kết nối bởi tổ chức khác |
| 410 | `RESET_TOKEN_EXPIRED` | Link đặt lại mật khẩu đã hết hạn |
| 422 | `MEMBER_LIMIT_EXCEEDED` | Vượt giới hạn thành viên của gói cước |
| 422 | `POST_QUOTA_EXCEEDED` | Vượt giới hạn bài đăng tháng này |
| 422 | `STORAGE_QUOTA_EXCEEDED` | Vượt giới hạn dung lượng lưu trữ |
| 402 | `INSUFFICIENT_CREDITS` | Không đủ Credits cho tính năng AI |
| 503 | `AI_SERVICE_UNAVAILABLE` | Dịch vụ AI đang gián đoạn |
| 503 | `SOCIAL_API_UNAVAILABLE` | API mạng xã hội đang gián đoạn |

---

## 15. Lộ trình Triển khai & Phát triển

### 15.1 Giai đoạn 1: MVP (Sprint 1–4, ~8 tuần)

**Mục tiêu:** Có sản phẩm hoạt động được, thu phản hồi sớm.

| Sprint | Mục tiêu | Deliverables |
|---|---|---|
| Sprint 1 | Hạ tầng & Auth | Monorepo setup, Docker, DB schema, API Auth (register/login/OAuth Google), Trang Login/Register |
| Sprint 2 | Tổ chức & Kênh | CRUD Org, Invite member, Kết nối Facebook + X + LinkedIn OAuth |
| Sprint 3 | Core Post | Soạn thảo, đăng ngay, lên lịch, Worker Service cơ bản |
| Sprint 4 | Media & Billing | Upload ảnh lên R2, gắn ảnh vào bài, Stripe Checkout, gói Trial/Starter |

**Definition of Done (DoD):**
- Unit test coverage >= 70% cho business logic.
- API documented trong Swagger.
- Tất cả tính năng đã test trên staging environment.
- Performance baseline đã được ghi nhận.

### 15.2 Giai đoạn 2: Growth (Sprint 5–8, ~8 tuần)

| Sprint | Mục tiêu | Deliverables |
|---|---|---|
| Sprint 5 | AI Integration | Sinh text, viết lại, Calendar View |
| Sprint 6 | Thread + Recurring | Thread editor, lặp bài, Auto-plug |
| Sprint 7 | Analytics + API | Dashboard analytics, Public API, API Key management |
| Sprint 8 | Webhooks + Polish | Webhooks, thêm nền tảng (TikTok, YouTube), cải thiện UX |

### 15.3 Giai đoạn 3: Scale (Sprint 9+)

- AI Image Generation (DALL-E 3 integration).
- Agency Marketplace.
- Polotno Studio integration (in-app image editor).
- Bluesky + Mastodon support.
- Worker Scale-out với Distributed Lock.
- Enterprise SSO (Authentik / SAML).
- SonarQube CI integration.

### 15.4 Cấu hình Môi trường

| Biến Môi trường | Mô tả | Bắt buộc |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `REDIS_URL` | Redis connection string | ✅ |
| `JWT_SECRET` | Secret key cho JWT signing | ✅ |
| `ENCRYPTION_KEY` | AES-256 key mã hóa OAuth tokens | ✅ |
| `GOOGLE_CLIENT_ID` / `SECRET` | OAuth Google credentials | ✅ |
| `STRIPE_SECRET_KEY` | Stripe API key | ✅ |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key cho AI features | ✅ (nếu bật AI) |
| `R2_ACCESS_KEY` / `SECRET` | Cloudflare R2 credentials | ✅ |
| `R2_BUCKET_NAME` | Tên R2 bucket | ✅ |
| `RESEND_API_KEY` | API key gửi email | ✅ |
| `SENTRY_DSN` | Sentry error tracking DSN | 🟡 |
| `TEMPORAL_ADDRESS` | Địa chỉ Temporal server | ✅ |

---

*Tài liệu này là tài liệu sống (living document). Mọi thay đổi về phạm vi, yêu cầu hoặc thiết kế cần được phản ánh vào đây và xác nhận bởi tất cả các bên liên quan trước khi triển khai.*

---

**Phiên bản:** 2.0.0 | **Cập nhật lần cuối:** 26/04/2026
