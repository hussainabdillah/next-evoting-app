# 🗳️ Next.js E-Voting Application

A modern, secure, and user-friendly electronic voting application built with Next.js, featuring blockchain integration, role-based authentication, and real-time results.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Docker Deployment](#-docker-deployment)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Authorization
- **NextAuth.js** integration with credentials provider
- **Role-based access control** (Admin/User)
- **JWT token management** with secure sessions
- **Route protection** with middleware
- **Password hashing** with bcrypt

### 🗳️ Voting System
- **Secure voting mechanism** with one-vote-per-user
- **Candidate management** (CRUD operations)
- **Real-time vote counting** and results
- **Blockchain integration** with Ethereum/Web3
- **Wallet connection** support

### 👨‍💼 Admin Dashboard
- **User management** (view, verify, manage users)
- **Candidate administration** (add, edit, delete candidates)
- **Election management** (start/stop elections)
- **Results monitoring** with analytics
- **Dashboard with statistics**

### 👤 User Features
- **User registration** and profile management
- **Vote casting** with confirmation
- **Candidate information** viewing
- **Voting guide** and instructions
- **Results viewing** after election

### 🎨 UI/UX
- **Modern design** with Tailwind CSS
- **Responsive layout** for all devices
- **Dark/Light theme** support
- **Accessible components** with Radix UI
- **Interactive animations** and transitions

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component library
- **[Lucide React](https://lucide.dev/)** - Beautiful icons
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Backend & Database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication solution
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Password hashing

### Blockchain
- **[Ethers.js](https://ethers.org/)** - Ethereum library
- **[Web3Modal](https://web3modal.com/)** - Wallet connection
- **Smart Contracts** - Solidity-based voting contracts

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Docker](https://www.docker.com/)** - Containerization

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hussainabdillah/next-evoting-app.git
   cd next-evoting-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example.txt .env.local
   ```

4. **Configure database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/evoting_db"

# Blockchain Config
NEXT_PUBLIC_CONTRACT_ADDRESS="0x..."
NEXT_PUBLIC_CHAIN_ID="1" # Ethereum Mainnet

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# WhatsApp Admin Number
NEXT_PUBLIC_ADMIN_WHATSAPP=

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Supabase Config
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Database Setup

1. **Create PostgreSQL database**
2. **Run Prisma migrations**
   ```bash
   npx prisma migrate dev
   ```
3. **Seed the database**
   ```bash
   npm run seed
   ```

## 💻 Usage

### For Voters

1. **Register** a new account or **login**
2. **Verify** your account (admin verification required)
3. **Browse candidates** and their information
4. **Cast your vote** securely
5. **View results** after the election ends

### For Administrators

1. **Login** with admin credentials
2. **Manage users** (verify, view, delete)
3. **Add/edit candidates** for the election
4. **Monitor voting progress** and statistics
5. **View and export results**

## 📁 Project Structure

```
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication pages
│   ├── admin/            # Admin dashboard
│   ├── api/              # API routes
│   └── dashboard/        # User dashboard
├── components/           # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   └── modal/            # Modal components
├── lib/                  # Utility libraries
│   ├── prisma.ts         # Database client
│   ├── utils.ts          # Helper functions
│   └── actions/          # Server actions
├── prisma/               # Database schema & migrations
├── sections/             # Page sections/features
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── constants/            # Application constants
├── auth.config.ts        # NextAuth configuration
├── auth.ts               # Auth helpers
└── middleware.ts         # Route protection
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints (signin, signout, session)
- `POST /api/auth/signup` - New user registration

### User Management

- `GET /api/users` - Get all users with role 'user' (admin only)
- `POST /api/users` - Create new user by admin
- `PUT /api/users/[id]` - Update user status (verify/unverify)

### Candidates Management

- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create new candidate with image upload (admin only)
- `PUT /api/candidates/[id]` - Update candidate information and image
- `DELETE /api/candidates/[id]` - Delete candidate (admin only)

### Voting System

- `POST /api/vote` - Update user voting status after blockchain vote
- `GET /api/user/vote-status` - Check if current user has voted

### Dashboard Statistics

- `GET /api/dashboard/voters` - Get total count of registered voters


## 🐳 Docker Deployment

### Using Docker Compose

1. **Build and run**
   ```bash
   docker-compose up --build
   ```

2. **Run in background**
   ```bash
   docker-compose up -d
   ```

### Manual Docker Build

1. **Build image**
   ```bash
   docker build -t next-evoting-app .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 next-evoting-app
   ```

## 🔐 Authentication

The application uses **NextAuth.js** with the following features:

- **Credentials provider** (email/password)
- **JWT sessions** for stateless authentication
- **Role-based authorization** (user/admin)
- **Route protection** via middleware
- **Secure password hashing** with bcrypt

### User Roles

- **User**: Can vote, view candidates, see results
- **Admin**: Full access to management features


## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Create** a Pull Request

### Commit Convention

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

## 👨‍💻 Author

**Ichisnn** - [GitHub Profile](https://github.com/hussainabdillah)

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/hussainabdillah/next-evoting-app/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

---

**⭐ Star this repository if you find it helpful!**
