MERN CRUD Application

A full-stack MERN (MongoDB, Express, React, Node.js) application built as part of a practical test.
It demonstrates clean architecture, CRUD operations, search, pagination, CSV export, and responsive UI.

🚀 Tech Stack

Frontend

React + Vite + TypeScript

Material-UI (MUI) for UI components

Axios for API requests

React Router DOM for routing

React Toastify for notifications

Backend

Node.js + Express

MongoDB + Mongoose

json2csv (for CSV export)

CORS & dotenv

✨ Features

User Management (CRUD): Add, edit, delete users

Pagination: Browse users page by page

Search: Find users by name/email

Export to CSV: Download full user list

Responsive UI: Works on mobile & desktop

Error Handling: Success/failure notifications

📂 Project Structure
MERN-CRUD-APP/
├── backend/
│   ├── config/        # MongoDB connection
│   ├── controllers/   # API logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routes
│   └── server.js      # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── api/       # Axios config
│   │   ├── components/# Reusable UI components
│   │   ├── pages/     # Page-level views
│   │   └── types/     # TypeScript types
│   └── vite.config.ts

⚙️ Setup Instructions
1️⃣ Clone the Repo
git clone https://github.com/DevPratikOstwal-crypto/mern-crud-app.git
cd mern-crud-app

2️⃣ Backend Setup
cd backend
npm install


Create .env file inside backend/:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/merncrud


Run backend:

npm run dev

3️⃣ Frontend Setup
cd ../frontend
npm install


Create .env file inside frontend/:

VITE_API_URL=http://localhost:5000/api


Run frontend:

npm run dev

🌍 Deployment

Frontend: [Netlify / Vercel link here]

Backend: [Render / Heroku link here]

📸 Screenshots

👉 (Add screenshots here once UI is ready)

👤 Author

Pratik Ostwal
🔗 GitHub Profile