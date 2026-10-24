# CodeCollab

A real-time collaborative code editor built with React, Node.js, Socket.IO, and Monaco Editor. Create rooms, write code together, run JavaScript securely in Docker containers, and collaborate in real-time with your team.

## ✨ Features

- 🔐 **User Authentication** - Secure signup/login with JWT
- 🏠 **Dashboard** - View and manage your code rooms
- 🚪 **Room Management** - Create public or private coding rooms
- 👥 **Real-time Collaboration** - Multiple users can edit code simultaneously
- 💻 **Monaco Editor** - Full-featured code editor (VS Code's editor)
- ▶️ **JavaScript Code Execution** - Run JavaScript code from the editor using isolated Docker containers
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
- Docker for isolated JavaScript code execution

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or higher)
- npm or yarn
- Docker Desktop or Docker Engine
- MongoDB Atlas account (or local MongoDB installation)

Docker must be installed and running on the machine hosting the backend because JavaScript code is executed through Docker containers.

You can verify that Docker is available with:

```bash
docker --version
docker run --rm node:20-alpine node -e "console.log('Docker is working')"
```

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/sravanvenkata/code-collab.git
cd code-collab
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
- `CLIENT_URL` - Frontend URL for CORS (use `http://localhost:5173` for development and your deployed URL for production)

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

- `VITE_API_URL` - Backend API URL (use `http://localhost:5000` for development and your deployed backend URL for production)

## ▶️ Running JavaScript Code

CodeCollab uses Docker to execute JavaScript code from the Monaco Editor in an isolated container instead of running user-provided code directly on the backend host.

To run JavaScript code:

1. Start Docker Desktop or the Docker Engine.
2. Start the CodeCollab backend and frontend.
3. Open a coding room.
4. Write JavaScript in the Monaco Editor.
5. Use the **Run** action to execute the code.
6. View the program output or error message in the output panel.

Example JavaScript:

```javascript
console.log("Hello from CodeCollab!");
```

> **Important:** The backend host must have permission to communicate with the Docker daemon. Docker is required even when running the application locally.

## 🏃 Running the Application

### Development Mode (Local)

1. **Start the Backend Server**

```bash
cd server
npm start
# or with nodemon for auto-reload
nodemon index.js
```

The server will run on `http://localhost:5000`.

2. **Start the Frontend**

Open a new terminal:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`.

3. **Access the Application**

Open your browser and navigate to `http://localhost:5173`.

> **Note:** After deployment, access your app via your deployed URLs, not localhost.

## 📁 Project Structure

```
CodeCollab/
├── client/                 # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── api/            # API service functions
│   │   │   ├── auth.js     # Authentication API calls
│   │   │   └── rooms.js    # Room management API calls
│   │   ├── components/     # React components
│   │   │   ├── CreateRoomPanel.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── TopBar.jsx
│   │   │   └── UserSidebar.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── AuthPage.jsx     # Login/Signup
│   │   │   └── Dashboard.jsx    # User dashboard
│   │   ├── App.jsx         # Main app component
│   │   ├── EditorPage.jsx  # Code editor page
│   │   ├── socket.js       # Socket.IO client setup
│   │   └── main.jsx        # Entry point
│   ├── .env                # Environment variables
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── models/             # Database models
│   │   ├── CodeRoom.js     # Room schema
│   │   └── User.js         # User schema
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   └── rooms.js        # Room management API routes
│   ├── index.js            # Server entry point and Socket.IO handlers
│   ├── .env                # Environment variables
│   └── package.json
│
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/signup` - Create a new user account
- `POST /auth/login` - Login a user

### Rooms

- `GET /rooms` - Get all rooms (owned and shared)
- `POST /rooms` - Create a new room
- `GET /rooms/:roomId` - Get specific room details
- `DELETE /rooms/:roomId` - Delete a room (owner only)

## 🔄 Socket Events

### Client → Server

- `join-room` - Join a coding room
- `code-change` - Send code updates
- `run-code` - Execute JavaScript code in a Docker container
- `kick-user` - Remove a user from a room (owner only)

### Server → Client

- `code-update` - Receive code changes
- `code-output` - Receive JavaScript execution output or errors
- `room-users` - Update the list of users in a room
- `user-kicked` - Notify when a user is removed

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push your code to GitHub.
2. Create a new web service on your platform.
3. Set the following environment variables:
   - `JWT_SECRET` - Your secure secret key
   - `MONGODB_URI` - Your MongoDB connection string
   - `CLIENT_URL` - Your deployed frontend URL
   - `PORT` - The platform will set this automatically
4. Ensure the deployment environment supports Docker and allows the backend to access the Docker daemon.
5. Deploy the backend.

> **Docker hosting requirement:** JavaScript execution will not work on a backend host that does not provide Docker support or access to a Docker daemon. Confirm Docker availability with your hosting provider before deploying this feature.

### Frontend Deployment (Vercel/Netlify)

1. Push your code to GitHub.
2. Create a new project on Vercel or Netlify.
3. Set the build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set the environment variable:
   - `VITE_API_URL` - Your deployed backend URL
5. Deploy the frontend.

### ⚠️ Important After Deployment

Update these environment variables with your actual deployed URLs:

**Server `.env`:**

```env
CLIENT_URL=https://your-frontend-app.vercel.app
```

**Client `.env`:**

```env
VITE_API_URL=https://your-backend-app.render.com
```

**Don't use localhost URLs in production.** They only work for local development.

## 🔒 Security Considerations

- Run user code only inside isolated containers.
- Never commit `.env` files to version control.
- Use a strong, randomly generated `JWT_SECRET` in production.
- Always use HTTPS in production.
- Apply execution timeouts and resource limits to code runner containers.
- Do not expose the Docker daemon socket publicly.
- Implement rate limiting for API endpoints.
- Add input validation and sanitization.
- Consider adding email verification for signups.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built by [Sravan Venkata]

**Happy Coding! 🚀**
