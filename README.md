# 📊 Lead Management System - Backend

The Lead Management System is a full-stack web application designed to streamline the process of managing business leads. The frontend, built with ReactJS, provides a responsive and intuitive interface for users to register, log in, and perform CRUD operations on leads. With features like server-side pagination, filtering, and secure authentication, the system ensures efficient lead tracking and management. The project is fully deployed, enabling seamless end-to-end usage.



## Project Backend

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

```js
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
```

---

## ⚙️ .env Example

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/leadDB?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

---

## 🔽 Clone & Run Locally  

1. **Clone the repository**  
```bash
git clone https://github.com/Demonsatyam/erino.git
```

2. **Navigate to the backend folder**  
```bash
cd erino/backend
```

3. **Install dependencies**  
```bash
npm install
```

4. **Set up environment variables**  
Create a `.env` file in the backend folder and add:  
```env
PORT=5000
MONGO_URI=YOUR_DATABASE_CONNECTION_STRING
JWT_SECRET=satyam01303
CLIENT_URL=http://localhost:5173
```

5. **Run the development server**  
```bash
npm run dev
```

---


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

## Project Frontend

A responsive and user-friendly frontend application for managing leads, with authentication, CRUD operations, pagination, and filtering. Built using **ReactJS** and styled with CSS.

---

## ✅ Features Implemented

- User Authentication (Register, Login, Logout)
- State Management using React Context
- Secure communication with backend APIs
- Lead Management (Create, View, Update, Delete)
- Server-side Pagination & Filtering in lead list
- Responsive UI with reusable components
- Modular and structured project architecture

---

## 🗂 Folder Structure (Frontend)

```
frontend/
├── public/
│   └── vite.svg                 # Default Vite asset
│
├── src/
│   ├── assets/                  # Static assets
│   ├── components/              # Reusable UI components
│   │   ├── layout.jsx           # Layout wrapper
│   │   └── leadForm.jsx         # Lead creation/edit form
│   │
│   ├── context/
│   │   └── authContext.jsx      # Authentication state management
│   │
│   ├── pages/                   # Application pages
│   │   ├── createLead.jsx       # Lead creation page
│   │   ├── dashboard.jsx        # Leads dashboard with table
│   │   ├── editLead.jsx         # Lead update page
│   │   ├── login.jsx            # Login page
│   │   └── register.jsx         # Register page
│   │
│   ├── services/                # API service layer
│   │   ├── authService.js       # Auth-related API calls
│   │   ├── http.js              # Axios instance config
│   │   └── leadService.js       # Lead-related API calls
│   │
│   ├── styles/                  # CSS stylesheets
│   │   ├── form.css
│   │   ├── index.css
│   │   ├── layout.css
│   │   └── table.css
│   │
│   ├── utils/                   # Helper functions
│   │
│   ├── App.jsx                  # Main App entry
│   ├── config.js                # Configurations
│   ├── main.jsx                 # React DOM entry point
│   └── .env                     # Environment variables
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js               # Vite config
```

---

## 🔐 Authentication Flow

- Users register via the **Register page**
- Login via **Login page**
- JWT token is stored securely via httpOnly cookies (handled by backend)
- AuthContext manages global authentication state
- Only authenticated users can access dashboard & lead pages
- Logout clears authentication state

---

## 📊 Leads Management

- **Dashboard** displays leads in a grid/table format
- Supports **server-side pagination & filtering**
- CRUD operations available:
  - Create new lead
  - Edit existing lead
  - Delete lead
- UI updates instantly after operations

---

## ⚙️ .env Example

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🔽 Clone & Run Locally  

1. **Clone the repository**  
```bash
git clone https://github.com/Demonsatyam/erino.git
```

2. **Navigate to the frontend folder**  
```bash
cd frontend/frontend
```

3. **Install dependencies**  
```bash
npm install
```

4. **Set up environment variables**  
Create a `.env` file in the frontend folder and add:  
```env
VITE_API_BASE_URL=http://localhost:5000/
```

5. **Run the development server**  
```bash
npm run dev
```

6. **Access the app**  
Open [http://localhost:5173](http://localhost:5173) in your browser.  

---


---

## 🚀 Tech Stack

- **ReactJS** (Frontend framework)
- **Axios** (API communication)
- **React Context API** (Authentication & state management)
- **Vite** (Build tool)
- **CSS** (Styling)

---

## 🧪 Pages Overview

| Page          | Description                         |
|---------------|-------------------------------------|
| Login         | User login with email/password      |
| Register      | New user registration               |
| Dashboard     | List of leads (pagination, filters) |
| Create Lead   | Form to add a new lead              |
| Edit Lead     | Form to edit existing lead          |

---

## 🌐 Deployment

- **Frontend** deployed on Vercel (or equivalent hosting)
- Connected with backend (Render/Railway/etc.)
- Accessible publicly for evaluation

---

## 🧱 Next Steps (Improvements)

- Enhance UI with a component library (e.g., Material UI)
- Add better form validation and error messages
- Implement dark mode & accessibility features
- Add unit and integration tests (Jest/React Testing Library)

---

## 👨‍💻 Tech Used

- **ReactJS** + **Vite**
- **Axios** for API calls
- **CSS** for styling
- **React Context API** for state management