\# InkSphere – Full Stack Blog Portfolio



InkSphere is a full-stack blog portfolio application where users can explore, read, and share stories. It includes Firebase authentication, MongoDB database integration, and admin-controlled blog management.



\## Features



\- User Signup and Login using Firebase Authentication

\- Browse and read published blogs

\- View complete blog stories

\- Admin Dashboard

\- Create, edit, and delete blog posts

\- Like blog posts

\- MongoDB Atlas database integration

\- Protected admin routes

\- Responsive design for mobile and desktop



\## Technologies Used



\*\*Frontend\*\*

\- React.js

\- React Router

\- Axios

\- Tailwind CSS

\- Firebase Authentication



\*\*Backend\*\*

\- Node.js

\- Express.js

\- MongoDB Atlas

\- Mongoose

\- Firebase Admin SDK



\## Project Structure



```text

InkSphere/

├── frontend/

│   ├── public/

│   └── src/

│       ├── components/

│       ├── config/

│       └── App.js

├── backend/

│   ├── config/

│   ├── index.js

│   └── package.json

├── .gitignore

└── README.md

```



\## Installation and Setup



\### 1. Clone the repository



```bash

git clone https://github.com/developer-raadhika/InkSphere.git

cd InkSphere

```



\### 2. Setup Backend



```bash

cd backend

npm install

```



Create a `.env` file inside the backend folder:



```env

MONGO\_URI=your\_mongodb\_connection\_string

PORT=5000

ADMIN\_UID=your\_firebase\_admin\_uid

```



Add your Firebase Admin service account file at:



`backend/config/serviceAccountKey.json`



Start the backend:



```bash

npm start

```



\### 3. Setup Frontend



Open another terminal:



```bash

cd frontend

npm install

npm start

```



Configure your Firebase web app credentials in the frontend Firebase configuration file.



\## Security



Never upload `.env` files, Firebase Admin service account credentials, or other private keys to GitHub.



\## Author



Developed as a Full Stack Development project.

