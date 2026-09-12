# 🥗 SmartRecipe

A full-stack culinary platform allowing users to discover recipes, manage nutritional goals via visual meal plans, and interact with a community of recipe authors.

---

## Overview

SmartRecipe is designed to bridge the gap between recipe discovery and nutritional planning. Users can explore a curated library of culinary creations across diverse taste profiles and dietary requirements, view comprehensive macronutrient breakdowns (calories, protein, carbs, fats), plan weekly meals with visual macro dashboards, and share their own kitchen creations.

---

## Features

- **Recipe Discovery & Search:** Smart multi-field search across titles, author names, taste profiles, and dietary requirements.
- **Dynamic Tag Filtering:** Interactive filter system supporting 8 taste profiles (*Spicy, Sweet, Sour, Salty, Bitter, Umami, Savory, Tangy*) and 8 dietary categories (*Vegetarian, Vegan, Gluten-Free, Keto, Paleo, Dairy-Free, Low-Carb, High-Protein*).
- **Macro & Nutritional Breakdown:** Real-time tracking of calories, protein, carbohydrates, and fats per serving.
- **Visual Macro Meal Planner:** Weekly calendar grid with circular progress visualization to dynamically track daily calorie and macronutrient targets.
- **Ratings & Reviews:** Dual-score community ratings (Taste Score and Health Score).
- **Author Profiles & Community:** Dedicated author pages showcasing user bio, published recipes, and contributions.
- **Secure Authentication:** Standard JWT-based authentication with bcrypt-hashed passwords.
- **Responsive Modern UI:** Fast, mobile-first design built with Tailwind CSS, Lucide icons, and modern typography.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide-React, Axios, React Router 7 |
| **Backend** | Node.js, Express 5, CORS, JSONWebToken, bcryptjs |
| **Database** | PostgreSQL hosted on Neon (Serverless) |
| **ORM** | Prisma 6.9 |
| **Hosting** | Render (Static Site for Frontend, Web Service for Backend) |
| **Media Storage** | Cloudinary (Optional, for image uploads) |

---

## Architecture

```
React / Vite Frontend (Render Static Site)
             │
             │ HTTPS / REST API
             ▼
Node.js / Express Backend (Render Web Service)
             │
             │ Prisma ORM Client
             ▼
      Neon PostgreSQL (Serverless Cloud Database)
```

- **Frontend Client:** Decoupled single-page application (SPA) communicating with the backend via REST endpoints with JWT bearer token authentication.
- **Backend API:** Stateless Express application providing structured routes for authentication, recipe query/search, meal planning, ratings, and image uploads.
- **Database Layer:** Prisma schema defining relational models (`User`, `Recipe`, `Ingredient`, `DietaryTag`, `TasteTag`, `Rating`, `MealPlan`, `MealPlanItem`) deployed with SQL migrations.

---

## Demo

- **Live Website:** [https://smart-recipe-frontend.onrender.com](https://smart-recipe-frontend.onrender.com) *(or your deployed Render URL)*
- **Demo Account Email:** `demo@smartrecipe.app`
- **Demo Account Password:** `SmartRecipeDemo@2026`

---

## Running Locally

### Prerequisites

- **Node.js** v18+ (Node.js v22 LTS recommended)
- **PostgreSQL** running locally or a free cloud instance on [Neon](https://neon.tech)
- **Docker** *(optional, for running local PostgreSQL in one command)*

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/akashmanju194/Smart-Recipe-and-Meal-planner.git
cd Smart-Recipe-and-Meal-planner

# Install Frontend dependencies
cd frontend
npm install

# Install Backend dependencies
cd ../backend
npm install
```

### 2. Configure Environment Variables

Create `.env` in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Fill in your local configuration:

```env
PORT=5001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_local_development_jwt_secret
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smartrecipe?schema=public"
```

Create `.env` in the `frontend/` directory:

```bash
cd ../frontend
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5001/api
```

---

## Database Setup

If using Docker to run PostgreSQL locally:

```bash
docker run -d --name smartrecipe-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=smartrecipe -p 5432:5432 postgres:16-alpine
```

### Run Migrations & Idempotent Seed

```bash
cd backend

# Apply migrations
npx prisma migrate dev --name init

# Seed realistic demo data and the demo account
npx prisma db seed
```

*Note: The seed script is completely idempotent. Running `npx prisma db seed` multiple times safely updates or preserves existing records without creating duplicates.*

---

## Environment Variables

### Frontend Variables

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Public base URL of the backend API (e.g., `https://smart-recipe-backend.onrender.com/api` or `http://localhost:5001/api`). |

### Backend Variables

| Variable | Purpose |
|---|---|
| `PORT` | Port on which the Express server listens (automatically assigned by Render, default `5001` locally). |
| `DATABASE_URL` | PostgreSQL connection string (supports Neon SSL pooled connection: `postgresql://user:pass@ep-xyz.region.neon.tech/neondb?sslmode=require`). |
| `JWT_SECRET` | Secret key used for signing and verifying JSON Web Tokens. |
| `FRONTEND_URL` | Allowed origin(s) for CORS (supports comma-separated origins, localhost, and `.onrender.com`). |

### Optional Third-Party Variables

| Variable | Purpose |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name for user recipe image uploads. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |

---

## Deployment

This project is configured for automated zero-cost deployment on **Render** using a Blueprint (`render.yaml`) and **Neon** for serverless PostgreSQL.

### Step 1: Create Free Neon PostgreSQL Database

1. Sign up or log in to [Neon](https://neon.tech) (100% free tier, no credit card required).
2. Create a new project (e.g., `smartrecipe-db`).
3. Copy the pooled connection string (`DATABASE_URL`), ensuring it ends with `?sslmode=require`.

### Step 2: Push Repository to GitHub

Ensure all changes, including `render.yaml` and `backend/prisma/migrations/`, are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "feat: complete demo-ready SmartRecipe application with Render blueprint"
git push origin main
```

### Step 3: Deploy to Render via Blueprint

1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **Blueprint**.
3. Connect your GitHub repository (`akashmanju194/Smart-Recipe-and-Meal-planner`).
4. Render will parse `render.yaml` and create two services:
   - **smart-recipe-backend** (Web Service)
   - **smart-recipe-frontend** (Static Site)
5. Under environment variables for `smart-recipe-backend`, provide:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `FRONTEND_URL`: The URL generated for your frontend static site (or leave empty during initial creation and update after).
6. Under environment variables for `smart-recipe-frontend`, provide:
   - `VITE_API_URL`: `https://smart-recipe-backend-xxxx.onrender.com/api` (replace with your backend service name).
7. Click **Apply**.

### Step 4: Seed the Production Database

Once the backend is deployed, populate the production database using Render's Web Shell or locally from your machine:

```bash
DATABASE_URL="your-neon-database-url?sslmode=require" npx prisma db seed
```

---

## Project Structure

```
Smart-Recipe-and-Meal-planner/
├── .gitignore
├── README.md
├── render.yaml                    # Infrastructure-as-Code Blueprint for Render
├── frontend/                      # React + Vite Client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.example
│   ├── public/
│   └── src/
│       ├── App.jsx                # Application routes and navigation
│       ├── main.jsx               # Entry point
│       ├── index.css              # Design system & Tailwind styling
│       ├── components/            # Reusable UI, Auth, Recipe, and MealPlan components
│       ├── context/               # AuthContext for session management
│       ├── hooks/                 # Custom React hooks (useAuth, useRecipes, useMealPlan)
│       ├── pages/                 # Full pages (HomePage, RecipeDetailPage, MealPlannerPage, etc.)
│       └── services/              # Axios API client (api.js, authService, recipeService, etc.)
└── backend/                       # Node.js + Express + Prisma API
    ├── package.json
    ├── .env.example
    ├── prisma/
    │   ├── schema.prisma          # PostgreSQL relational data schema
    │   ├── seed.js                # Idempotent seed script (18 recipes + demo user)
    │   └── migrations/            # Generated SQL migration history
    └── src/
        ├── server.js              # Express server entry point & health check
        ├── config/                # DB, CORS, and Cloudinary configuration
        ├── controllers/           # Business logic (Auth, Recipes, MealPlans, Ratings)
        ├── middlewares/           # JWT verification, validation, error handler
        └── routes/                # Express API route declarations
```

---

## Sample Data

The platform includes an idempotent seed script (`backend/prisma/seed.js`) that provisions:
- **1 dedicated demo user** (`demo@smartrecipe.app`)
- **2 community chef profiles**
- **8 taste tags & 8 dietary tags**
- **72 common culinary ingredients**
- **18 realistic sample recipes** with high-resolution imagery, detailed step-by-step instructions, and exact macro counts
- **Initial ratings** and a **pre-populated meal plan** for the demo user

---

## Limitations

- **Free-Tier Cold Starts:** On Render's free tier, the backend web service spins down after 15 minutes of inactivity. When accessed after inactivity, the first API request may take 30–50 seconds to wake up the service. Subsequent requests will be fast.
- **Cloudinary Image Uploads:** User image uploads require free Cloudinary credentials configured in the backend environment variables. If omitted, sample recipes will display their existing high-resolution Unsplash images.
