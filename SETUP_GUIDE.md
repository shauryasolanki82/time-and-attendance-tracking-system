# Quick Setup Guide for VS Code

## Prerequisites
- Node.js (v16+)
- VS Code
- Terminal access

## Quick Start (5 minutes)

### 1. Create Project
```bash
mkdir attendance-tracker
cd attendance-tracker
```

### 2. Copy Files
Copy all project files from the artifact to your local directory

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Application

**Terminal 1 (Backend):**
```bash
npm run server
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

### 5. Open Browser
Go to `http://localhost:5173`

## Demo Login
- Admin: `ADMIN001` / `admin123`
- Employee: `EMP001` / `password123`

## File Structure to Create
```
attendance-tracker/
├── server/
│   ├── routes/
│   ├── database.js
│   └── server.js
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── App.tsx
├── package.json
└── index.html
```

That's it! Your attendance tracking system should be running locally.