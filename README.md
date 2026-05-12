#  Personal Knowledge Hub

A full-stack web application to save, organize, and search your personal knowledge resources — articles, videos, links, and more.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python) + SQLite |
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Auth | JWT (JSON Web Tokens) |
| Styling | Tailwind CSS + Google Fonts (Syne, DM Sans) |

---

##  Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

---

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# Start the server
uvicorn main:app --reload --port 8000
```

The API will be live at: **http://localhost:8000**  
Interactive docs: **http://localhost:8000/docs**

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local

# Start dev server
npm run dev
```

The app will be live at: **http://localhost:3000**

---

##  Project Structure

```
knowledge-hub/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # SQLAlchemy setup
│   ├── models.py            # DB models (User, Resource)
│   ├── schemas.py           # Pydantic request/response schemas
│   ├── auth.py              # JWT + password utilities
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py          # /api/auth/* endpoints
│       └── resources.py     # /api/resources/* endpoints
│
└── frontend/
    ├── pages/
    │   ├── _app.tsx         # App wrapper with auth context
    │   ├── _document.tsx    # Custom HTML head
    │   ├── index.tsx        # Redirect to dashboard/login
    │   ├── login.tsx        # Login page
    │   ├── signup.tsx       # Signup page
    │   └── dashboard.tsx    # Main app dashboard
    ├── components/
    │   ├── ResourceCard.tsx       # Resource display card
    │   ├── ResourceModal.tsx      # Create/Edit modal
    │   └── DeleteConfirmModal.tsx # Delete confirmation
    ├── lib/
    │   ├── api.ts           # Axios instance with interceptors
    │   └── auth.tsx         # Auth context & hooks
    ├── types/
    │   └── index.ts         # TypeScript interfaces
    └── styles/
        └── globals.css      # Global styles + Tailwind
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/me` | Get current user |

### Resources (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/resources/` | List all resources |
| GET | `/api/resources/?search=<q>` | Search by title |
| GET | `/api/resources/?tags=<t1,t2>` | Filter by tags |
| POST | `/api/resources/` | Create resource |
| GET | `/api/resources/{id}` | Get single resource |
| PUT | `/api/resources/{id}` | Update resource |
| DELETE | `/api/resources/{id}` | Delete resource |

---

##  Features

-  **JWT Authentication** — Signup, login, protected routes
-  **Full CRUD** — Create, read, update, delete resources
-  **Search** — Search resources by title (debounced)
-  **Tag Filtering** — Filter by one or multiple tags
-  **Grid / List View** — Toggle between layouts
-  **Responsive** — Works on mobile and desktop
-  **Optimistic UX** — Loading states and error handling throughout
-  **Distinctive Design** — Syne + DM Sans typography, warm paper tones

---

##  Deployment

### Backend (e.g. Railway / Render)
1. Set `SECRET_KEY` environment variable to a long random string
2. Change `DATABASE_URL` to a PostgreSQL URL for production (install `psycopg2-binary`)
3. Update CORS `allow_origins` in `main.py` to your frontend URL

### Frontend (e.g. Vercel)
1. Set `NEXT_PUBLIC_API_URL` to your deployed backend URL
2. Deploy with `vercel --prod`

---

##  Security Notes

- Change `SECRET_KEY` in `auth.py` before deploying to production
- Use PostgreSQL instead of SQLite for production
- Tokens expire after 24 hours
- Passwords are hashed with bcrypt
