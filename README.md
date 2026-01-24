# 📋 Task & Project Management System

A full-stack task and project management application built with **Node.js**, **React (Vite)**, and **Tailwind CSS**. This system allows teams to manage projects, assign tasks, track progress, and collaborate efficiently.

## ✨ Features

- 🔐 **User Authentication & Authorization**
  - Secure login/registration system
  - Role-based access control (Admin/User/Moderator)
  - JWT-based authentication

- 📊 **Project Management**
  - Create, update, and delete projects
  - Assign team members to projects
  - Track project progress and status
  - Project dashboard with analytics

- ✅ **Task Management**
  - Create and assign tasks to team members
  - Set priorities and deadlines
  - Update task status (Open, In Progress, Resolved)

- 👥 **User Management** (Admin only)
  - View and manage all users
  - Assign roles and permissions

- 🎨 **Modern UI/UX**
  - Intuitive and clean interface
  - Real-time updates
  - Modal-based forms

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Fetch** - HTTP client
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

## 📁 Project Structure

```
project-root/
├── frontend/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Context providers
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # Backend (Node.js + Express)
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middlewares/        # Custom middleware
│   ├── config/            # Configuration files
│   ├── utils/             # utility functions
│   ├── index.js          # Entry point
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/LordsFury/InstechSol_Task.git
   cd InstechSol_Task
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Variables**

   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI={MongodbURI}
   JWT_SECRET={secretkey}
   ```

   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Run the Application**

   **Backend** (from `backend` directory):
   ```bash
   npm run dev
   ```

   **Frontend** (from `frontend` directory):
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 📝 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Projects
```
GET    /api/projects         - Get all projects
GET    /api/projects/:id     - Get project by ID
POST   /api/projects         - Create new project
PUT    /api/projects/:id     - Update project
DELETE /api/projects/:id     - Delete project
```

### Tasks
```
GET    /api/tasks            - Get all tasks
GET    /api/tasks/:id        - Get task by ID
POST   /api/tasks            - Create new task
PUT    /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
```

### Users (Admin only)
```
GET    /api/users            - Get all users
GET    /api/users/:id        - Get user by ID
PUT    /api/users/:id        - Update user
DELETE /api/users/:id        - Delete user
```

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 👨‍💻 Author

**LordsFury**
- GitHub: [@LordsFury](https://github.com/LordsFury)
