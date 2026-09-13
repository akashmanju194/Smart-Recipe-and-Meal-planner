# 🥗 SmartRecipe & Meal Planner

A full-stack culinary and nutritional platform allowing users to discover chef-crafted recipes, track macronutrients with visual meal plans, and interact with a community of culinary creators.

---

## 🚀 Live Demo & Deployment

- **Frontend Application:** [https://smart-recipe-frontend-vccs.onrender.com](https://smart-recipe-frontend-vccs.onrender.com)
- **Backend API (Health Check):** [https://smart-recipe-backend-fzw2.onrender.com/api/health](https://smart-recipe-backend-fzw2.onrender.com/api/health)
- **Pre-configured Demo Account:**
  - **Email:** `demo@smartrecipe.app`
  - **Password:** `SmartRecipeDemo@2026`

> **Note on Free Tier Cold Starts:** The backend is hosted on Render's free tier. If the service has been idle, the initial request may take ~30–50 seconds to spin up. Once awake, performance is instant.

---

## ✨ Features

### 🔍 1. Smart Recipe Discovery & Instant Search
- **Instant Search:** Search across recipe titles, author names, descriptions, and ingredients in real-time.
- **Dual Tag Filtering System:**
  - **8 Taste Profiles:** *Spicy, Sweet, Sour, Salty, Bitter, Umami, Savory, Tangy*.
  - **8 Dietary Categories:** *Vegetarian, Vegan, Gluten-Free, Keto, Paleo, Dairy-Free, Low-Carb, High-Protein*.
- **Multi-tag Combination:** Filter by taste and dietary requirements simultaneously to pinpoint the exact dish for any craving or diet.
- **Sorting Options:** Sort recipes by newest, cooking time, calories (low-to-high / high-to-low), or community rating.

### 🍽️ 2. Comprehensive Recipe Details
- **Appetizing Visuals:** Curated high-resolution culinary photography for every recipe.
- **Macronutrient Breakdown:** Exact per-serving nutritional metrics:
  - Calories (kcal)
  - Protein (g)
  - Carbohydrates (g)
  - Healthy Fats (g)
- **Interactive Ingredients List:** Full ingredient quantities, units, and preparation notes.
- **Step-by-Step Cooking Guide:** Clear numbered instructions with preparation and cooking time estimates.

### 📅 3. Visual Macro Meal Planner
- **Weekly Calendar Grid:** Plan meals across Monday through Sunday for Breakfast, Lunch, Dinner, and Snacks.
- **Dynamic Circular Macro Rings:** Animated SVG progress meters that visually track:
  - Total Calories against daily goal
  - Protein (g) progress
  - Carbohydrate (g) progress
  - Fat (g) progress
- **Modal Recipe Picker:** Seamlessly search and add recipes from the database directly into any meal slot.
- **Item Removal & Quick Swap:** One-click removal of meals with automatic recalculation of daily nutritional totals.

### ⭐ 4. Dual-Score Rating & Community Feedback
- **Taste Score (1–5 Stars):** Rate how delicious and flavorful a dish is.
- **Health Score (1–5 Stars):** Rate how nutritious, wholesome, and energizing the meal feels.
- **Aggregate Community Ratings:** Transparent breakdown of average ratings and total reviews submitted by users.

### 👤 5. Author Profiles & Zoomable Lightbox
- **Author Profile Page:** View any chef or user profile (`/profile/:username`), their biography, stats, and published recipe catalog.
- **Avatar Zoom Modal:** Click any author profile picture (on recipe cards, author hover previews, or profile headers) to open a full-screen, high-resolution zoomed lightbox preview.
- **Custom Profile Customization:** Authenticated users can upload avatars and customize their culinary bio.

### ✍️ 6. Recipe Creation & Publishing
- Authenticated users can publish their own recipes with:
  - Title, description, and cooking time
  - Image URL or direct file upload
  - Multiple dietary and taste tag associations
  - Dynamic ingredient builder (name, quantity, and unit)
  - Detailed step-by-step instruction builder

### 🔐 7. Authentication & Security
- Secure registration and login using JSON Web Tokens (JWT) stored safely in client state / local storage.
- Password hashing using `bcryptjs` with salt rounds.
- Protected routes on both frontend (React Router guards) and backend (Express JWT middleware).

---

## 🛠️ Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 | Declarative component-based UI |
| | Vite 8 | Fast build tool and dev server |
| | React Router 7 | Client-side routing and page transitions |
| | Vanilla CSS / Tailwind CSS | Responsive dark-mode glassmorphism styling |
| | Lucide React | Modern icons |
| | Axios & React Hot Toast | HTTP client & toast notifications |
| **Backend** | Node.js (v20+) | Runtime environment |
| | Express 5 | Fast, unopinionated REST API framework |
| | Prisma ORM 6.9 | Type-safe database queries & migrations |
| | JSONWebToken & bcryptjs | Auth token generation and secure password hashing |
| | CORS & Multer | Cross-origin request handling & multipart file upload |
| **Database** | PostgreSQL on Neon | Serverless cloud PostgreSQL with SSL connection pooling |
| **Cloud Hosting** | Render | Automated CI/CD deployment via `render.yaml` Blueprint |

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│              React 19 Client (Vite SPA)                │
│    https://smart-recipe-frontend-vccs.onrender.com     │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTPS / REST API + JWT
                            ▼
┌────────────────────────────────────────────────────────┐
│             Node.js / Express 5 API Server             │
│     https://smart-recipe-backend-fzw2.onrender.com     │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ Prisma ORM Client (SSL)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Neon Serverless PostgreSQL DB              │
│       ep-polished-violet-axonu0vc-pooler...            │
└────────────────────────────────────────────────────────┘
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js** v18+ (Node.js v20 or v22 recommended)
- **Git**
- **PostgreSQL** running locally OR a free [Neon](https://neon.tech) database instance

### 1. Clone the Repository
```bash
git clone https://github.com/akashmanju194/Smart-Recipe-and-Meal-planner.git
cd Smart-Recipe-and-Meal-planner
```

### 2. Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5001
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_jwt_key_here
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smartrecipe?schema=public"
```
*(If using Neon, paste your Neon PostgreSQL pooled connection string into `DATABASE_URL` with `?sslmode=require`)*.

Run database migrations and seed sample recipes:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Start the backend server:
```bash
npm run dev
# Server will start on http://localhost:5001
```

### 3. Configure Frontend
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5001/api
```

Start the Vite development server:
```bash
npm run dev
# Frontend will be live on http://localhost:5173
```

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/me` - Get current authenticated user profile *(Auth required)*

### Recipes
- `GET /api/recipes` - List recipes with search, taste filter, dietary filter, and sorting
- `GET /api/recipes/:id` - Get recipe details, ingredients, tags, and ratings
- `POST /api/recipes` - Create a new recipe *(Auth required)*
- `PUT /api/recipes/:id` - Update an existing recipe *(Author only)*
- `DELETE /api/recipes/:id` - Delete a recipe *(Author only)*

### Ratings & Feedback
- `POST /api/recipes/:id/ratings` - Submit or update Taste Score (1-5) and Health Score (1-5) *(Auth required)*

### Meal Plans
- `GET /api/meal-plans?weekStart=YYYY-MM-DD` - Fetch weekly meal plan and calculated macros *(Auth required)*
- `POST /api/meal-plans/items` - Add a recipe to a specific day and meal slot *(Auth required)*
- `DELETE /api/meal-plans/items/:itemId` - Remove an item from the meal plan *(Auth required)*

### Users & Authors
- `GET /api/users/:username` - Get public author profile, bio, recipe count, and published recipes
- `PUT /api/users/profile` - Update user bio and avatar *(Auth required)*

---

## 🗄️ Database Schema Summary

The database uses relational tables managed by Prisma:
- **`User`**: Authentication credentials, profile bio, avatar image URL, timestamps.
- **`Recipe`**: Title, description, cooking time, calories, macros (protein, carbs, fat), image URL, author reference.
- **`Ingredient` & `RecipeIngredient`**: Ingredient name, quantity, unit of measurement.
- **`TasteProfile` & `RecipeTaste`**: Normalized taste tags (Sweet, Spicy, Umami, etc.).
- **`DietaryRequirement` & `RecipeDietary`**: Normalized dietary tags (Vegan, Keto, Gluten-Free, etc.).
- **`Rating`**: User reference, recipe reference, tasteScore, healthScore, review comment.
- **`MealPlan` & `MealPlanItem`**: User reference, week start date, target daily calories, slot (Breakfast, Lunch, Dinner, Snack).

---

## 🚢 Deployment on Render

This project includes a native `render.yaml` Blueprint for automated deployment:

1. Push your changes to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), select **New +** → **Blueprint**.
3. Select this repository.
4. Render automatically configures:
   - **Backend Web Service (`smart-recipe-backend`)**: Node.js runtime, `npm install && npx prisma migrate deploy`, `node src/server.js`.
   - **Frontend Static Site (`smart-recipe-frontend`)**: Static CDN, `npm install && npm run build`, publish directory `dist`.
5. Supply `DATABASE_URL` (Neon PostgreSQL) and `JWT_SECRET`.
6. Click **Apply** to deploy live!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
