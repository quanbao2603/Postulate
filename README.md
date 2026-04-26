# 🚀 Postulate - Social Media OS

**Postulate** is a comprehensive Social Media Operating System and automated post scheduling platform. The project is architected as a **Modular Monolith** within a **Monorepo** setup. This approach optimizes source code management, facilitates future scalability, and logically separates domain services (such as API, Frontend, Workers, and AI integrations) while maintaining the simplicity and developer experience of a single unified repository.

---

## 🛠 Tech Stack

- **Package Manager:** [pnpm](https://pnpm.io/) (utilizing pnpm workspaces).
- **Backend API:** Node.js (Express / NestJS).
- **Frontend:** Next.js / React.
- **Database & ORM:** PostgreSQL managed via Prisma ORM.
- **Architecture:** Monorepo (pnpm workspaces) + Modular Monolith.
- **Infrastructure:** Docker & Docker Compose for the local development environment.

---

## 📂 Project Structure

The repository is organized into two primary directories: `apps` (independently deployable applications) and `packages` (shared modules, libraries, and utilities).

```text
Postulate/
├── apps/
│   ├── api/            # Main Backend API handling client requests.
│   ├── frontend/       # User interface application (Next.js/React).
│   └── worker/         # Background job processing and queues.
│
├── packages/
│   ├── ai-service/     # AI integration modules (e.g., text & image generation).
│   ├── auth/           # Authentication and authorization module.
│   ├── config/         # Shared system configurations (ESLint, Prettier, TSConfig).
│   ├── core/           # Core shared business logic and utilities.
│   ├── database/       # Prisma Schema, Migrations, and Database Client.
│   ├── media/          # Uploaded media (images/videos) management.
│   └── social-api/     # Third-party social network integrations (Facebook, X, LinkedIn...).
```

---

## 🏁 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- Node.js (Latest LTS version)
- pnpm (`npm install -g pnpm`)
- Docker & Docker Compose (Required for local database setup)

### 2. Installation & Setup

**Step 1: Clone the repository**
```bash
git clone https://github.com/quanbao2603/Postulate.git
cd Postulate
```

**Step 2: Install dependencies**
Since this is a pnpm monorepo, you only need to run the install command at the root directory:
```bash
pnpm install
```

**Step 3: Environment Variables (.env)**
- Duplicate the `.env.example` file and rename it to `.env` at the root directory.
- Fill in the required Database credentials and API Keys in your new `.env` file. (Note: `.env` is ignored by Git for security purposes).

**Step 4: Start the Local Database**
Spin up the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

**Step 5: Run the Development Server**
```bash
pnpm dev
```
*(This command will concurrently start the frontend, api, and worker applications based on the root package.json configuration)*

---

## 📝 Code & Commit Guidelines

- **Commits:** We strictly follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat:`, `chore:`, `fix:`).
- **Database Access:** All database interactions and logic must be routed through the `@postulate/database` package.
- **Branching:** All new feature branches should be created off the `main` branch.

---
*This project is under active development.*
