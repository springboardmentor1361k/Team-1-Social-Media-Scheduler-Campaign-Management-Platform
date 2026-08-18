# Team-1-Social-Media-Scheduler-Campaign-Management-Platform

# 🚀 SocialPilot

## Social Media Scheduler & Campaign Management Platform

SocialPilot is a web-based platform that helps users manage their social-media activities from one centralized dashboard.

It brings together:

- 🔐 User Authentication & User Management
- 📊 Dashboard
- 🔗 Social Account Management
- 📝 Content Management
- 📅 Content Scheduling
- 📢 Campaign Management
- 📈 Analytics
- 📄 Reports
- 🔔 Notifications
- ⚙️ Settings
- 🔎 Global Search

---

## 🌐 Live Demo

### Frontend

https://social-path.vercel.app/

### GitHub Repository

https://github.com/springboardmentor1361k/Team-1-Social-Media-Scheduler-Campaign-Management-Platform

---

# 🎯 Project Objective

Managing multiple social-media platforms separately can be time-consuming and difficult to organize.

SocialPilot provides one centralized workspace where users can:

1. Create and manage content
2. Connect social accounts
3. Schedule posts
4. Manage campaigns
5. View analytics
6. Generate reports
7. Receive notifications

The goal is to make social-media planning, scheduling and campaign management simpler and more organized.

---

# ✨ Main Features & Modules

## 1. 🔐 User Authentication & User Management

The authentication module manages user registration, login and protected access.

### Features

- User registration
- User login
- Password hashing
- JWT authentication
- Protected API routes
- User profile management
- Password management
- User-specific data access

### Workflow

Register  
↓  
Password Hashing  
↓  
Database  
↓  
Login  
↓  
Credential Verification  
↓  
JWT Token  
↓  
Protected API Requests  
↓  
User-Scoped Data

---

## 2. 📊 Dashboard

The Dashboard provides a centralized overview of the user's social-media activities.

### It displays

- Connected social accounts
- Campaign information
- Total posts
- Scheduled posts
- Post status
- Campaign summaries
- Analytics summaries
- Important statistics

The Dashboard acts as the main entry point to the SocialPilot platform.

---

## 3. 🔗 Social Account Management

This module allows users to manage their connected social-media accounts.

### Features

- View connected accounts
- Add or connect social accounts
- Disconnect accounts
- View account information
- Maintain user-specific social accounts

### Current Implementation

Social account connection currently uses a **Mock OAuth / Demo OAuth flow**.

Real OAuth integrations with platforms such as Instagram, Facebook, LinkedIn and X are planned as future scope.

### Workflow

Select Platform  
↓  
Mock OAuth / Demo Connection  
↓  
Account Information  
↓  
Save Social Account  
↓  
Database

---

## 4. 📝 Content Management

Content Management allows users to create and manage their social-media content.

### Features

- Create posts
- Edit content
- Delete content
- Manage post information
- Associate content with campaigns
- Prepare content for scheduling

### Workflow

Create Content  
↓  
React Form  
↓  
Axios  
↓  
FastAPI API  
↓  
SQLAlchemy  
↓  
Posts Database

---

## 5. 📅 Content Scheduling

The Content Scheduling module allows users to plan when their content should be posted.

### Features

- Select date and time
- Schedule posts
- View scheduled content
- Update scheduled posts
- Delete scheduled posts
- Manage scheduling status
- Calendar-based scheduling

### Workflow

Create Post  
↓  
Select Date & Time  
↓  
Schedule  
↓  
Save to Database  
↓  
View Scheduled Content

> **Note:** The current project uses a simulated publishing workflow. Posts are stored in the database but are not published to real social-media platforms yet.

---

## 6. 📢 Campaign Management

Campaign Management helps users organize related social-media content and activities into campaigns.

### Features

- Create campaigns
- View campaigns
- Update campaigns
- Delete campaigns
- Campaign objectives
- Campaign budgets
- Start and end dates
- Platform information
- Campaign status
- Performance information
- Associate posts with campaigns

### Workflow

Create Campaign  
↓  
Campaign Details  
↓  
Add / Associate Content  
↓  
Schedule Posts  
↓  
Track Performance

---

## 7. 📈 Analytics

The Analytics module helps users understand social-media and campaign performance.

### Metrics

- Likes
- Comments
- Shares
- Reach
- Impressions
- Clicks
- Engagement
- Campaign performance
- Platform performance

### Data Flow

Database  
↓  
FastAPI Analytics API  
↓  
Axios  
↓  
React  
↓  
Analytics Dashboard

Analytics data is processed by the backend and displayed through charts and summary views.

---

## 8. 📄 Reports

The Reports module provides organized performance and post information.

### Features

- View report data
- Filter information
- View post performance
- Review campaign information
- Export data as CSV

### Workflow

Database / API Data  
↓  
Reports Module  
↓  
Filter / Format  
↓  
CSV Export

---

## 9. 🔔 Notifications

The Notifications module provides users with important application activity.

### Features

- Display notifications
- Scheduling-related notifications
- Campaign/activity notifications
- Read notifications
- Mark notifications as read
- Clear notifications

### Workflow

Application Activity  
↓  
Notification API  
↓  
Notifications Database  
↓  
Notification Hub  
↓  
Read / Unread

---

## 10. ⚙️ Settings & Preferences

The Settings module manages user and application preferences.

### Features

- Profile-related settings
- Password change
- Theme selection
- Notification preferences
- Language preference where available

Theme preference is maintained on the client side.

Some preference controls may currently be client-side only and may not persist after page reload.

---

## 11. 🔎 Global Search

Global Search allows users to search across their SocialPilot workspace.

### Search Includes

- Campaigns
- Posts
- Notifications

### Workflow

Search Query  
↓  
FastAPI Search API  
↓  
User ID + Search Filter  
↓  
Database  
↓  
Grouped Search Results

Search results are restricted to the authenticated user's data.

---

# 🏗️ System Architecture

SocialPilot follows a decoupled client-server architecture.

User  
↓  
React + Vite Frontend  
↓  
Axios / REST API  
↓  
FastAPI Backend  
↓  
JWT Authentication + Business Logic  
↓  
SQLAlchemy  
↓  
Database

---

# 🔄 Frontend–Backend Data Flow

SocialPilot uses REST APIs for communication between the frontend and backend.

User Action  
↓  
React Component  
↓  
Axios Request  
↓  
FastAPI Endpoint  
↓  
JWT Verification  
↓  
Business Logic  
↓  
SQLAlchemy  
↓  
Database  
↓  
JSON Response  
↓  
React UI Update

---

# 🗄️ Database Design

SocialPilot uses a relational database structure.

### Main Entities

- User
- Social Account
- Campaign
- Post
- Analytics
- Notification

### Relationships

- One user can have multiple social accounts.
- One user can have multiple campaigns.
- One user can have multiple posts.
- One campaign can contain multiple posts.
- Posts can have associated analytics.
- One user can have multiple notifications.

### Database Technologies

- SQLite for local development
- PostgreSQL for production
- Supabase for managed PostgreSQL hosting
- SQLAlchemy for ORM/database operations

---

# 🔒 Authentication & Security

SocialPilot uses multiple security mechanisms.

### Password Security

Passwords are hashed before being stored in the database.

### JWT Authentication

JWT tokens are generated after successful login and used to protect authenticated API requests.

### User Data Isolation

Backend queries are scoped to the authenticated user's `user_id`.

This prevents one user's application data from being accessed by another user.

### Security Flow

User Login  
↓  
Credential Verification  
↓  
JWT Token Generated  
↓  
Token Stored on Client  
↓  
Axios Adds Authorization Header  
↓  
FastAPI Verifies Token  
↓  
Extract User ID  
↓  
User-Scoped Database Query

---

# 💻 Frontend

The frontend is a React-based single-page application.

### Technologies

- React.js
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Axios

### Frontend Responsibilities

- User interface
- Navigation
- Authentication pages
- Dashboard
- Social accounts
- Content management
- Content scheduling
- Campaigns
- Analytics
- Reports
- Notifications
- Settings
- Global search

---

# ⚙️ Backend

The backend is built using FastAPI.

### Technologies

- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
- JWT authentication

### Backend Responsibilities

- REST API endpoints
- Authentication
- User management
- Social account operations
- Campaign CRUD
- Post CRUD
- Scheduling operations
- Analytics
- Reports data
- Notifications
- Search
- Database operations

---

# 🛠️ Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React.js | User interface |
| Vite | Frontend development and build |
| JavaScript | Application logic |
| Tailwind CSS | UI styling |
| React Router | Page navigation |
| Axios | API communication |

## Backend

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API framework |
| Uvicorn | Application server |
| Pydantic | Data validation |
| SQLAlchemy | ORM/database operations |

## Authentication

| Technology | Purpose |
|---|---|
| JWT | Authentication and authorization |
| Password Hashing | Secure password storage |

## Database

| Technology | Purpose |
|---|---|
| SQLite | Local development |
| PostgreSQL | Production database |
| Supabase | Managed PostgreSQL hosting |

## Deployment

| Technology | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |

## Development & Collaboration

| Technology | Purpose |
|---|---|
| Git | Version control |
| GitHub | Code collaboration |
| VS Code | Development environment |

---

# 🧪 Testing & Validation

The project includes testing and validation of important workflows.

### Tested Areas

- User registration
- User login
- JWT authentication
- Protected routes
- User profile operations
- Social account linking
- Campaign CRUD
- Post CRUD
- Content scheduling
- Analytics
- Reports
- Notifications
- Global search
- Multi-user data isolation
- Frontend production build
- Backend API validation
- Database connectivity
- Deployment configuration

### Multi-User Data Isolation

Each user's data is maintained separately.

User A  
├── Campaigns  
├── Posts  
├── Social Accounts  
└── Notifications

User B  
├── Campaigns  
├── Posts  
├── Social Accounts  
└── Notifications

Actions performed by User A should not affect User B's records.

---

# 🚀 Deployment

## Frontend

The React/Vite frontend is deployed using Vercel.

### Live Application

https://social-path.vercel.app/

## Backend

The FastAPI backend is designed for deployment using Render.

## Database

Production data uses PostgreSQL/Supabase.

---

# 📁 Project Structure

Team-1-Social-Media-Scheduler-Campaign-Management-Platform/  
│  
├── README.md  
├── LICENSE  
├── .gitignore  
│  
└── frontend code/  
    │  
    ├── frontend/  
    │   ├── public/  
    │   ├── src/  
    │   │   ├── components/  
    │   │   ├── context/  
    │   │   ├── hooks/  
    │   │   ├── layouts/  
    │   │   ├── pages/  
    │   │   ├── routes/  
    │   │   ├── services/  
    │   │   └── styles/  
    │   │  
    │   ├── package.json  
    │   └── vite.config.js  
    │  
    ├── backend/  
    │   ├── app/  
    │   │   ├── models/  
    │   │   ├── routers/  
    │   │   ├── utils/  
    │   │   ├── crud.py  
    │   │   ├── database.py  
    │   │   ├── main.py  
    │   │   └── schemas.py  
    │   │  
    │   ├── requirements.txt  
    │   └── .env.example  
    │  
    ├── package.json  
    └── start-dev.ps1

---

# 👥 Team Members

| Member | Responsibility |
|---|---|
| **Vaishnavi Yerramilli** | Team Lead, Core Integration, Dashboard, Deployment & Testing |
| **Lakshmi Supriya** | Authentication, User Management & Notifications |
| **Jaya Durga** | Campaign Management, Content Management & Scheduling |
| **Sowjanya** | Social Account Management, Mock OAuth & UI/UX |
| **Susmitha** | Analytics, Reports & Visualization |

---

# 📌 Project Status

## ✅ Implemented

- User Authentication
- User Management
- Dashboard
- Social Account Management
- Content Management
- Content Scheduling
- Campaign Management
- Analytics
- Reports
- Notifications
- Settings
- Global Search
- Database Integration
- Multi-user Data Isolation
- Frontend Deployment
- Backend Deployment

## 🟡 Demo / Simulated

- Social Account OAuth connection
- Social-media publishing

## ⚠️ Current Limitations

- Social account connections currently use Mock OAuth / Demo OAuth.
- Real social-media publishing is not implemented yet.
- Real OAuth requires official platform developer accounts and API credentials.
- Some preference features may currently be client-side only.

---

# 🔮 Future Scope

Future improvements include:

- Real Instagram OAuth
- Real Facebook OAuth
- Real LinkedIn OAuth
- Real X/Twitter OAuth
- Real social-media API publishing
- Background workers for scheduled publishing
- Advanced analytics
- AI-assisted content generation
- Advanced team collaboration
- Additional report formats
- Enterprise-level permissions
- Improved notification preferences
- Persistent user preferences

---

# 🔀 GitHub Workflow

The project uses Git and GitHub for team collaboration.

### Branch Strategy

- `main` → Complete integrated project
- Individual branches → Individual team contributions

Each team member works on their own branch and pushes their assigned work there.

The `main` branch contains the complete integrated project.

---

# 📚 Project Purpose

SocialPilot was developed as a group software project to demonstrate:

- Full-stack web development
- React frontend development
- REST API development
- FastAPI backend development
- Database design
- Authentication and security
- Content management
- Content scheduling
- Campaign management
- Analytics
- Reporting
- Git/GitHub collaboration
- Deployment
- Testing
- Modular application architecture

---

# ⭐ SocialPilot

## Plan. Schedule. Manage. Analyze.

### 🌐 Live Demo

https://social-path.vercel.app/

### 💻 GitHub Repository

https://github.com/springboardmentor1361k/Team-1-Social-Media-Scheduler-Campaign-Management-Platform

---

## 👩‍💻 Developed By

### SocialPilot Team

**Vaishnavi Yerramilli**  
**Lakshmi Supriya**  
**Jaya Durga**  
**Sowjanya**  
**Susmitha**
