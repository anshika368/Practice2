# Quick Start Guide

## Getting Started in 5 Minutes

### Prerequisites
- Node.js (v14+)
- MongoDB (v4.4+) or MongoDB Atlas account
- npm or yarn

### Step 1: Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Practice2

# Run the automated setup script
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment

Backend `.env` file (already created from example):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crowd-management
JWT_SECRET=crowd_management_secret_key_2024
NODE_ENV=development
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
Update `MONGODB_URI` in `backend/.env` with your Atlas connection string.

### Step 4: Seed Database

```bash
cd backend
npm run seed
```

You should see:
```
✅ Database seeded successfully!

Default Login Credentials:
Organizer ID: ORG001
Password: password123
```

### Step 5: Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 6: Access Application

Open your browser and navigate to:
```
http://localhost:3000
```

Login with:
- **Organizer ID:** ORG001
- **Password:** password123

## What You'll See

1. **Login Page** - Secure authentication
2. **Dashboard** - Overview with statistics and charts
3. **Events** - Manage events with CRUD operations
4. **Zones** - Monitor crowd density with AI analysis
5. **Lost Persons** - Track and manage reports
6. **Medical** - Manage medical facilities
7. **Emergency Exits** - Real-time status monitoring
8. **Feedback** - Analytics and user feedback

## Common Issues

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the connection string in `.env`

### Port Already in Use
- Change the port in `backend/.env` (default: 5000)
- Change the port in `frontend/.env` (default: 3000)

### Dependencies Installation Failed
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## API Testing

You can test the API endpoints using:

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"organizerId":"ORG001","password":"password123"}'
```

**Get Events (requires token):**
```bash
curl http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Development Tips

### Hot Reload
Both backend (with nodemon) and frontend (with react-scripts) support hot reload.

### Database Reset
To reset the database:
```bash
cd backend
npm run seed
```

### Add New Organizer
Use the `/api/auth/register` endpoint or modify the seed script.

## Production Deployment

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Serve the build folder with a static server
```

## Support

For detailed documentation, see [README.md](README.md)
