# Zync 🔗
### *Sync with your people*

A modern full-stack social media platform built with React and Node.js, featuring real-time messaging, notifications, and a clean, responsive UI.

---

## 📸 Preview

| Home Feed | Profile Page | Messages |
|-----------|-------------|----------|
| Create posts, like, comment, and explore your feed | View profiles, follow users, see posts | Real-time chat with your connections |

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- Email OTP verification
- Forgot & reset password via OTP
- JWT-based authentication
- Protected routes

### 📝 Posts & Feed
- Create posts with text, images, and videos
- Smart feed algorithm (your posts + following + public)
- Privacy settings (Public / Friends-only / Private)
- Like / Unlike posts
- Comments & nested replies (1 level)
- Delete posts and comments

### 👤 User Profiles
- View any user's profile
- Follow / Unfollow users
- View followers & following lists
- Edit profile (name, username, bio, phone, password)
- Upload & update profile picture
- Profile posts in grid or list view

### 💬 Real-Time Messaging
- Start conversations with people you follow
- Real-time messages via Socket.io
- Unread message counter
- Chat bubble (LinkedIn-style) on home page
- Full messages page

### 🔔 Real-Time Notifications
- Like, comment, follow, and message notifications
- Unread notification counter
- Mark as read on click
- Mark all as read

### 🔍 Search
- Search for users by name or username
- Follow / Unfollow from search results

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React + Vite | UI framework |
| Redux Toolkit | Global state management |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Socket.io Client | Real-time communication |
| Tailwind CSS | Styling |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | Server & REST API |
| Sequelize + MySQL | ORM & Database |
| Socket.io | Real-time events |
| JWT | Authentication |
| Bcrypt | Password hashing |
| Multer | File uploads |
| Nodemailer | Email (OTP) sending |
| Joi | Request validation |

---

## 📁 Project Structure

```
Zync/
├── Back-End/
│   ├── config/
│   │   └── dbConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postsController.js
│   │   ├── userController.js
│   │   ├── likeController.js
│   │   ├── commentController.js
│   │   ├── conversationController.js
│   │   └── notificationController.js
│   ├── middlewares/
│   │   ├── authMiddleWare.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── index.js
│   │   ├── userModel.js
│   │   ├── postModel.js
│   │   ├── commentModel.js
│   │   ├── likeModel.js
│   │   ├── followModel.js
│   │   ├── conversationModel.js
│   │   ├── messageModel.js
│   │   └── notificationModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── postRoutes.js
│   │   ├── userRoutes.js
│   │   ├── likeRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── conversationRoutes.js
│   │   └── notificationRoutes.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── postService.js
│   │   ├── userService.js
│   │   ├── conversationService.js
│   │   └── notificationService.js
│   ├── socket/
│   │   └── socketHandler.js
│   ├── utils/
│   │   ├── jwt.js
│   │   ├── mailer.js
│   │   ├── multer.js
│   │   ├── appError.js
│   │   └── otpGenerator.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   ├── postValidator.js
│   │   ├── userValidator.js
│   │   └── commentValidator.js
│   ├── uploads/
│   │   ├── images/
│   │   └── videos/
│   ├── app.js
│   └── server.js
│
└── Front-End/
    └── src/
        ├── components/
        │   ├── auth/
        │   ├── chat/
        │   ├── common/
        │   ├── layout/
        │   ├── post/
        │   ├── profile/
        │   └── widgets/
        ├── hooks/
        ├── pages/
        ├── services/
        ├── store/
        │   └── slices/
        └── utils/
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL
- Gmail account (for OTP emails)

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/zync.git
cd zync
```

---

### 2. Backend Setup

```bash
cd Back-End
npm install
```

Create a `.env` file in the `Back-End` folder:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=zync
DB_USER=root
DB_PASS=yourpassword

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE_TIME=1h

# OTP
OTP_LENGTH=6
OTP_EXPIRE_TIME=10

# Password Hashing
HASH_SALT=10

# Email (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-gmail-app-password
```

Start the backend:

```bash
npm run dev
```

---

### 3. Seed the Database (Optional)

```bash
node seeders/seeds.js
```

This creates 4 test users with posts, comments, likes, and follows:

| Email | Password |
|-------|----------|
| ahmed@test.com | Password123 |
| mohamed@test.com | Password123 |
| sara@test.com | Password123 |
| omar@test.com | Password123 |

---

### 4. Frontend Setup

```bash
cd Front-End
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/resend-otp` | Resend OTP |
| POST | `/auth/forgot-password` | Send reset OTP |
| POST | `/auth/reset-password` | Reset password |
| GET | `/auth/me` | Get current user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/posts/feed` | Get home feed |
| GET | `/posts/:id` | Get single post |
| POST | `/posts` | Create post |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Delete post |
| GET | `/posts/user/:userId` | Get user's posts |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/:id/profile` | Get user profile |
| PUT | `/users/me/profile` | Update my profile |
| GET | `/users/:id/followers` | Get followers |
| GET | `/users/:id/following` | Get following |
| POST | `/users/:id/follow` | Follow user |
| DELETE | `/users/:id/unfollow` | Unfollow user |
| GET | `/users/search` | Search users |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/conversations` | Get all conversations |
| POST | `/conversations/:userId` | Start conversation |
| GET | `/conversations/:id/messages` | Get messages |
| POST | `/conversations/:id/messages` | Send message |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | Get notifications |
| PUT | `/notifications/:id/read` | Mark as read |
| PUT | `/notifications/read-all` | Mark all as read |

---

## 🔴 Real-Time Events (Socket.io)

| Event | Direction | Description |
|-------|-----------|-------------|
| `notification:new` | Server → Client | New notification received |
| `message:new` | Server → Client | New message received |
| `user:online` | Server → Clients | User came online |
| `user:offline` | Server → Clients | User went offline |

---

## 📧 Gmail App Password Setup

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Security → Enable **2-Step Verification**
3. Search for **App Passwords**
4. Generate password for **Mail**
5. Copy the 16-character password to `MAIL_PASS` in `.env`

---

## 👨‍💻 Author

Built with ❤️ by **Abdelrahman Kamel**

---

## 📄 License

This project is licensed under the MIT License.
