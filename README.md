# BankWise - Online Banking Management System

## Overview

BankWise is an online banking management system that provides administrators with tools to manage users, roles, and bank accounts. The application features a clean, responsive interface built with Next.js and a comprehensive set of banking operations.

## Features

### User Management
- View, create, edit, and delete users
- Paginated user listing
- User status management (active/blocked)
- Role assignment
- Detailed user profiles

### Role Management
- Create and manage user roles
- View role assignments
- Edit and delete roles

### Account Management
- Create bank accounts in multiple currencies (USD, EUR, BYN, RUB)
- Perform transactions (deposit, withdrawal, transfer)
- View account balances and status
- Open/close accounts

### Authentication
- Secure login/logout
- Registration system
- Password change functionality
- Protected routes

## Technologies Used

### Frontend
- **Next.js** (React framework)
- **TypeScript**
- **Tailwind CSS** (styling)
- **TanStack Query** (data fetching)
- **React Hook Form** (form management)

### Backend API
The frontend connects to a custom backend API from the [OnlineBanking repository](https://github.com/Ondrecho/OnlineBanking).

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Running backend API (see [OnlineBanking repository](https://github.com/Ondrecho/OnlineBanking))

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create `.env.local`):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## License

This project is licensed under the MIT License.