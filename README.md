# 🍽️ Smart Recipe Sharing & Meal Planning Platform

A full-stack platform allowing users to discover recipes, manage nutritional goals via meal plans, and interact with a community of recipe authors.

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React.js (Vite), Tailwind CSS, Lucide-React |
| Backend    | Node.js, Express.js               |
| Database   | PostgreSQL                         |
| ORM        | Prisma                            |
| Images     | Cloudinary                         |
| Auth       | JWT + bcrypt                       |

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL installed and running
- Cloudinary account (free tier)

### 1. Clone & Install

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` in the `backend/` directory and fill in your credentials.

### 3. Set Up Database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:5000`.

## Project Structure

```
smart-recipe-system/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Node.js + Express + Prisma
├── .gitignore
└── README.md
```
