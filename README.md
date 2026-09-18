# E-Voting Portal

A scalable, full-stack election management system built with the MERN stack. Designed for institutional use, it features secure JWT-based student authentication, dynamic role-based ballot rendering, and a live real-time results dashboard. This system was successfully deployed to facilitate official academic department elections, ensuring zero data discrepancies and eliminating ballot tampering.

## Features

- **Secure Authentication:** JWT-based login validating University Serial Number (USN), Year, and Section.
- **Dynamic Ballots:** Voters only see candidates eligible for their specific cohort and global roles (e.g., General Secretary).
- **Double-Voting Prevention:** Database-level tracking to ensure one vote per verified user.
- **Live Results Dashboard:** Real-time tabulation and visual progress bars for all election roles.
- **Responsive UI:** Clean, mobile-friendly interface built with React and Tailwind CSS.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose
- **Security:** JSON Web Tokens (JWT), CORS

## Local Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/UMESH-KALE0777/e-voting-portal.git
cd e-voting-portal
\`\`\`

### 2. Install Dependencies
Open two terminals to install backend and frontend packages:
\`\`\`bash
# Terminal 1 (Backend)
cd server
npm install

# Terminal 2 (Frontend)
cd client
npm install
\`\`\`

### 3. Environment Variables
Create a \`.env\` file in the `server` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
\`\`\`

### 4. Seed the Database
Populate the database with sample students and candidates:
\`\`\`bash
cd server
node utils/seed.js
\`\`\`

### 5. Run the Application
\`\`\`bash
# Backend (Terminal 1)
cd server
node server.js

# Frontend (Terminal 2)
cd client
npm run dev
\`\`\`
The application will be running at \`http://localhost:5173\`.