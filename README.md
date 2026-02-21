# CodeCollab

A real-time collaborative code editor built with React, Node.js, Socket.IO, and Monaco Editor. Create rooms, write code together, and collaborate in real-time with your team.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT
- 🏠 **Dashboard** - View and manage your code rooms
- 🚪 **Room Management** - Create public or private coding rooms
- 👥 **Real-time Collaboration** - Multiple users can edit code simultaneously
- 💻 **Monaco Editor** - Full-featured code editor (VS Code's editor)
- 🔒 **Private Rooms** - Control who can access your rooms
- 👀 **Live User Presence** - See who's currently in the room
- 🚫 **Kick Users** - Room owners can remove users
- 📱 **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router DOM
- Socket.IO Client
- Monaco Editor
- Tailwind CSS
- Lucide React (icons)
- JWT Decode

### Backend
- Node.js
- Express.js
- Socket.IO
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB installation)

## 🚀 Installation

### 1. Clone the repository

```bash
cd CodeCollab
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Server Environment Variables

Create a `.env` file in the `server` directory:

**For Development:**
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

**For Production:**
```env
PORT=5000
JWT_SECRET=your_strong_production_secret
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=https://your-frontend-app.vercel.app
```

**Environment Variables Explained:**
- `PORT` - Server port (platforms like Render/Heroku will override this automatically)
- `JWT_SECRET` - Secret key for JWT token generation
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_URL` - Frontend URL for CORS (use `http://localhost:5173` for dev, your deployed URL for production)

### Client Environment Variables

Create a `.env` file in the `client` directory:

**For Development:**
```env
VITE_API_URL=http://localhost:5000
```

**For Production:**
```env
VITE_API_URL=https://your-backend-app.render.com
```

**Environment Variables Explained:**
- `VITE_API_URL` - Backend API URL (use `http://localhost:5000` for dev, your deployed backend URL for production)

## 🏃 Running the Application

### Development Mode (Local)

1. **Start the Backend Server**

```bash
cd server
npm start
# or with nodemon for auto-reload
nodemon index.js
```

The server will run on `http://localhost:5000`

2. **Start the Frontend**

Open a new terminal:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

3. **Access the Application**

Open your browser and navigate to `http://localhost:5173`

> **Note:** After deployment, access your app via your deployed URLs (e.g., `https://your-app.vercel.app`), not localhost

## 📁 Project Structure

```
CodeCollab/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── api/           # API service functions
│   │   │   ├── auth.js    # Authentication API calls
│   │   │   └── rooms.js   # Room management API calls
│   │   ├── components/    # React components
│   │   │   ├── CreateRoomPanel.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── UserSidebar.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── AuthPage.jsx     # Login/Signup
│   │   │   └── Dashboard.jsx    # User dashboard
│   │   ├── App.jsx        # Main app component
│   │   ├── EditorPage.jsx # Code editor page
│   │   ├── socket.js      # Socket.IO client setup
│   │   └── main.jsx       # Entry point
│   ├── .env               # Environment variables
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # Database models
│   │   ├── CodeRoom.js   # Room schema
│   │   └── User.js       # User schema
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   └── rooms.js      # Room management routes
│   ├── index.js          # Server entry point
│   ├── .env              # Environment variables
│   └── package.json
│
└── README.md             # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login user

### Rooms
- `GET /rooms` - Get all rooms (owned and shared)
- `POST /rooms` - Create a new room
- `GET /rooms/:roomId` - Get specific room details
- `DELETE /rooms/:roomId` - Delete a room (owner only)

## 🔄 Socket Events

### Client → Server
- `join-room` - Join a coding room
- `code-change` - Send code updates
- `kick-user` - Remove user from room (owner only)

### Server → Client
- `code-update` - Receive code changes
- `room-users` - Update list of users in room
- `user-kicked` - Notify when user is removed

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Push your code to GitHub**
2. **Create a new web service on your platform**
3. **Set environment variables:**
   - `JWT_SECRET` - Your secure secret key
   - `MONGODB_URI` - Your MongoDB connection string
   - `CLIENT_URL` - Your deployed frontend URL (e.g., `https://your-app.vercel.app`)
   - `PORT` - The platform will set this automatically

4. **Deploy!** Your backend will be available at something like:
   - `https://your-app.render.com`
   - `https://your-app.railway.app`

### Frontend Deployment (Vercel/Netlify)

1. **Push your code to GitHub**
2. **Create a new project on Vercel/Netlify**
3. **Set build settings:**
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Set environment variables:**
   - `VITE_API_URL` - Your deployed backend URL (e.g., `https://your-backend.render.com`)

5. **Deploy!** Your frontend will be available at:
   - `https://your-app.vercel.app`
   - `https://your-app.netlify.app`

### ⚠️ Important After Deployment

**You MUST update these environment variables with your actual deployed URLs:**

**Server `.env`:**
```env
CLIENT_URL=https://your-frontend-app.vercel.app
```

**Client `.env`:**
```env
VITE_API_URL=https://your-backend-app.render.com
```

**Don't use localhost URLs in production!** They only work for local development.

## 🔒 Security Considerations

- Change `JWT_SECRET` to a strong, random string in production
- Never commit `.env` files to version control
- Always use HTTPS in production
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Consider adding email verification for signups

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built by [Sravan Venkata]

**Happy Coding! 🚀**
