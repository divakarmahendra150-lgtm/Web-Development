# Life RPG — Gamified Real-Life Productivity Web Application

> **Tech Zephyr 4.0 — Web Hackathon by IIT Bhubaneswar**  
> Official Round 1 Submission

---

## ⚔️ Project Overview

**Life RPG** is a full-stack, production-quality web application designed to eliminate procrastination by turning real-life productivity into an immersive Role-Playing Game (RPG). Traditional productivity and to-do applications feel like chores because rewards are delayed. Life RPG bridges this psychological gap by rewarding everyday habits, study sessions, workouts, and programming tasks with:

- **Instant Experience Points (XP)**
- **Gold Coins**
- **Non-linear Level Progression** (`100 * Level^1.8`)
- **5 Core Character Attributes** (Strength, Intellect, Discipline, Vitality, Charisma)
- **Daily Streak Multipliers**
- **Virtual Economy & Rewards Shop** (themes, titles, avatars, cosmetics)
- **Inventory & Equipment System**
- **Legendary Badges & Achievements**
- **Historical Activity Chronicles**

---

## 🏛️ System Architecture

```
                 React + Vite Frontend (JavaScript)
          [Tailwind CSS, Framer Motion, Lucide React]
                              │
                              │ Native Fetch API (NO Axios)
                              ▼
            Django REST Framework API (Python 3.14+)
    [SimpleJWT Authentication, django-cors-headers, Services]
                              │
                              │ Server-side Authoritative Business Logic
                              ▼
                    PostgreSQL Database
          [Characters, Tasks, Badges, Inventory, Ledger]
```

### Server-Side Authority
The backend is the strict source of truth for:
- XP and Gold amounts
- Level progression calculations
- Attribute gains based on quest categories
- Daily activity streaks
- User ownership and data isolation
- Reward purchases and transactions

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + Vite
- **Language**: JavaScript (ESNext)
- **Styling**: Tailwind CSS (Dark fantasy / Futuristic RPG hybrid)
- **Motion & Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router DOM v7
- **API Client**: **Strict Native `fetch()` API** (Zero Axios dependencies or imports)

### Backend
- **Framework**: Python + Django 6
- **API Engine**: Django REST Framework (DRF)
- **Authentication**: JWT (`djangorestframework-simplejwt`)
- **CORS**: `django-cors-headers`
- **Database Driver**: `psycopg` (v3)

### Database
- **Engine**: PostgreSQL 18
- **ORM**: Django ORM with atomic database transactions

---

## 📂 Project Structure

```
E:\Life-RPG\
├── backend/
│   ├── accounts/              # User model, registration, login, profile
│   ├── config/                # Django project settings, URLs, WSGI
│   ├── game/                  # Characters, Tasks, Completions, Badges, History
│   │   ├── management/        # seed_data command
│   │   └── services.py        # Core authoritative game calculation engine
│   ├── rewards/               # Virtual rewards, inventory, equip/unequip
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── test_backend.py        # Automated API integration tests
│   └── test_persistence.py    # Complete user journey & database persistence test
├── frontend/
│   ├── public/                # Favicons, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/        # Navbar, Sidebar, MobileNav, AppLayout
│   │   │   ├── quest/         # QuestCard, QuestModal
│   │   │   └── ui/            # LevelUpModal, QuestCompleteToast, ProgressBar, StatCard, BadgeCard
│   │   ├── context/           # AuthContext, GameContext
│   │   ├── hooks/             # useAuth, useGame
│   │   ├── pages/             # Landing, Login, Register, Dashboard, Quests, Character, Rewards, Inventory, History, Profile
│   │   ├── routes/            # AppRoutes (Protected and Public routes)
│   │   ├── services/          # api.js (Strict Native Fetch), authService, questService, rewardService
│   │   ├── utils/             # constants, format
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL installed and running

### 1. Database Setup
Create a PostgreSQL database for Life RPG:
```sql
CREATE DATABASE liferpg;
```

### 2. Backend Setup
```powershell
cd E:\Life-RPG\backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
python -m pip install -r requirements.txt

# Configure environment variables
Copy-Item .env.example .env
# Edit .env with your PostgreSQL credentials

# Run database migrations
python manage.py makemigrations accounts game rewards
python manage.py migrate

# Seed initial badges and rewards
python manage.py seed_data

# Start the Django development server
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend Setup
```powershell
cd E:\Life-RPG\frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Comprehensive Verification & Testing

### Automated Backend & Isolation Tests
To verify all REST endpoints, ownership protection, and data isolation:
```powershell
cd E:\Life-RPG\backend
python test_backend.py
```

### Complete User Journey & PostgreSQL Persistence Test
To test registration, quest completion, authoritative calculations, refresh persistence, and re-login:
```powershell
cd E:\Life-RPG\backend
python test_persistence.py
```

### Production Build Verification
To test frontend production bundling:
```powershell
cd E:\Life-RPG\frontend
npm run build
```

---

## 📡 Core API Reference

### Authentication
- `POST /api/auth/register/`: Register hero account
- `POST /api/auth/login/`: Obtain JWT access & refresh tokens
- `POST /api/auth/logout/`: Blacklist refresh token
- `GET /api/auth/me/`: Retrieve current authenticated profile
- `PATCH /api/auth/profile/`: Update hero avatar, title, and bio

### Game & Quests
- `GET /api/game/character/`: Retrieve character level, XP, Gold, attributes, and streak
- `GET /api/game/progression/`: Level milestones and progress curves
- `GET /api/game/tasks/`: List quests with category, difficulty, and status filters
- `POST /api/game/tasks/`: Create a new quest
- `GET/PATCH/DELETE /api/game/tasks/{id}/`: Manage specific quest
- `POST /api/game/tasks/{id}/complete/`: Authoritatively complete quest, harvest XP/Gold, update streak, check level up

### Virtual Economy & Inventory
- `GET /api/rewards/`: List shop rewards with ownership flags
- `POST /api/rewards/{id}/purchase/`: Spend Gold to acquire virtual items
- `GET /api/rewards/inventory/`: List owned items
- `POST /api/rewards/inventory/{id}/equip/`: Equip item
- `POST /api/rewards/inventory/{id}/unequip/`: Unequip item

### Chronicles
- `GET /api/game/history/`: Full historical event log
- `GET /api/game/xp-history/`: Transaction ledger for XP
- `GET /api/game/gold-history/`: Transaction ledger for Gold

---

## 🔒 Security & Data Integrity

- Passwords securely hashed with Django's Argon2/PBKDF2 algorithms.
- Full user data isolation verified: users cannot access or alter other adventurers' data.
- Database transactions (`transaction.atomic`) guarantee atomicity for quest completions and gold purchases.
- No client-side authority: all reward calculations, streaks, and level increments are computed on the backend.

---

## 🏆 Hackathon Details
- **Event**: Tech Zephyr 4.0
- **Institution**: IIT Bhubaneswar
- **Problem Statement**: Life RPG
