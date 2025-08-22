# 📊 Lead Management System - Backend

A fully-featured backend system for managing leads, with authentication, CRUD APIs, pagination, filtering, and MongoDB Atlas integration. Built using **Node.js**, **Express**, and **MongoDB**.

---

## ✅ Features Implemented

- User Registration, Login, Logout using **JWT** (httpOnly cookies)
- Passwords securely hashed with `bcryptjs`
- Middleware-based route protection (`isAuthenticated`)
- CRUD operations for leads with:
  - Pagination (`page`, `limit`)
  - Filtering (string, enum, number, date, boolean)
- Global error handling using custom `ErrorHandler` class
- MongoDB Atlas cloud DB integration
- Structured and modular folder architecture

---

## 🗂 Folder Structure (Backend)

```
backend/
├── config/
│   └── db.js                    # MongoDB connection
│
├── controllers/
│   └── userController.js        # All auth + lead logic
│
├── middleware/
│   ├── auth.js                  # JWT auth middleware
│   ├── catchAsync.js           # Async error wrapper
│   └── error.js                # Global error handler
│
├── models/
│   ├── user_signup_model.js    # User schema with hash method
│   ├── user_login_model.js     # Login schema (lightweight)
│   └── lead_model.js           # Full lead schema
│
├── routes/
│   ├── authRoutes.js           # /api auth routes
│   └── leadRoutes.js           # /api/leads routes
│
├── utils/
│   └── errorHandler.js         # Custom error class
│
├── .env                        # Environment variables
├── app.js                      # Express app config
├── server.js                   # App entry point
└── package.json
```

---

## 🔐 Authentication Flow

- Users register via \`POST /api/register\`
- Login with \`POST /api/login\`
- JWT token is stored in a secure \`httpOnly\` cookie
- Authenticated users can access protected routes like \`/api/me\`, \`/api/leads\`
- Logout via \`POST /api/logout\` (clears cookie)

---

## 📝 Lead Model Fields

\`\`\`js
{
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  phone: String,
  company: String,
  city: String,
  state: String,
  source: ['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other'],
  status: ['new', 'contacted', 'qualified', 'lost', 'won'],
  score: Number (0–100),
  lead_value: Number,
  last_activity_at: Date,
  is_qualified: Boolean (default: false),
  created_at, updated_at: Date
}
\`\`\`

---

## ⚙️ .env Example

\`\`\`env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leadDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
\`\`\`

---

## 🧪 API Testing (Postman)

### Auth Routes:
| Method | Endpoint         | Description           |
|--------|------------------|-----------------------|
| POST   | \`/api/register\`  | Register user         |
| POST   | \`/api/login\`     | Login user            |
| POST   | \`/api/logout\`    | Logout user           |
| GET    | \`/api/me\`        | Get current user info |

### Lead Routes (auth required):
| Method | Endpoint              | Description              |
|--------|-----------------------|--------------------------|
| POST   | \`/api/leads\`          | Create lead              |
| GET    | \`/api/leads\`          | List leads (pagination, filters) |
| GET    | \`/api/leads/:id\`      | Get lead by ID           |
| PUT    | \`/api/leads/:id\`      | Update lead              |
| DELETE | \`/api/leads/:id\`      | Delete lead              |

---

## 🔍 Sample Query Params for GET \`/api/leads\`

\`\`\`http
?page=2&limit=10&city=mumbai&score_gt=50&status=new&is_qualified=true
\`\`\`

---

## ✅ Middleware Summary

- \`auth.js\`: JWT auth middleware
- \`catchAsync.js\`: Wrapper to handle async errors
- \`error.js\`: Central error handler
- \`errorHandler.js\`: Custom error response class

---

## 🧱 Tech Stack

- **Node.js** + **Express**
- **MongoDB Atlas** with **Mongoose**
- **JWT** for auth
- **bcryptjs** for password hashing
- **CORS** + **httpOnly cookies** for secure client-server communication

---

## 🚀 Next Steps (Frontend)

- React setup with pages:
  - Login/Register
  - Leads Table (with server-side pagination & filters)
  - Create/Edit Form
- Use AG Grid or equivalent