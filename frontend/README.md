# InkSphere – Blog Portfolio Web Application

InkSphere is a full-stack blog portfolio application where users can explore stories, create accounts, and interact with blog content. Admin users can publish, edit, and delete stories through a protected dashboard.

## 🚀 Features

- User Registration and Login
- Firebase Authentication
- Browse and read blog stories
- View complete story details
- Admin Dashboard
- Publish new blog stories
- Edit existing stories
- Delete unwanted stories
- Protected Admin Access
- MongoDB database integration
- Responsive design for mobile and desktop

## 🛠️ Technologies Used

**Frontend**
- React.js
- Tailwind CSS
- JavaScript
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication**
- Firebase Authentication
- Firebase Admin SDK

## 📂 Project Structure

```text
InkSphere/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── config/
│       └── App.js
│
├── backend/
│   ├── config/
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd InkSphere
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm start
```

Frontend runs at: http://localhost:3000

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd InkSphere/backend
npm install
```

Start the backend:

```bash
node index.js
```

Backend runs at: http://localhost:5000

### 4. Environment Variables

Create a `.env` file inside the backend folder.

Configure your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
ADMIN_UID=your_firebase_admin_user_uid
```

Configure Firebase Admin credentials using your own service account file.

**Important:** Never upload `.env` or Firebase service account credentials to GitHub.

## 🔐 Authentication

InkSphere uses Firebase Authentication for user registration and login. Firebase Admin SDK verifies authenticated users and protects admin-only operations.

## 📱 Responsive Design

The application supports desktop, tablet, and mobile screens.

## 👩‍💻 Author

Developed as a Full Stack Development project.

## 📄 License

This project was created for educational purposes.