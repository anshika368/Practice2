# Project Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Crowd Management System                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │ ◄─────► │   Backend    │ ◄─────► │   Database   │
│  React App   │  HTTP   │  Express API │  CRUD   │   MongoDB    │
│              │ Socket  │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
```

## Technology Stack

### Frontend
```
React 18
  ├── React Router (Navigation)
  ├── Redux Toolkit (State Management)
  ├── Tailwind CSS (Styling)
  ├── Recharts (Data Visualization)
  ├── Axios (HTTP Client)
  ├── Socket.io Client (Real-time)
  └── React Icons (UI Icons)
```

### Backend
```
Node.js + Express
  ├── Express.js (Web Framework)
  ├── MongoDB + Mongoose (Database)
  ├── JWT (Authentication)
  ├── bcryptjs (Password Hashing)
  ├── Socket.io (Real-time Updates)
  ├── CORS (Cross-Origin)
  └── dotenv (Configuration)
```

## Project Structure

```
crowd-management-system/
│
├── backend/
│   ├── src/
│   │   ├── models/              # Data Models
│   │   │   ├── User.js
│   │   │   ├── Event.js
│   │   │   ├── Zone.js
│   │   │   ├── LostPerson.js
│   │   │   ├── MedicalFacility.js
│   │   │   ├── EmergencyExit.js
│   │   │   └── Feedback.js
│   │   │
│   │   ├── controllers/         # Business Logic
│   │   │   ├── authController.js
│   │   │   ├── eventController.js
│   │   │   ├── zoneController.js
│   │   │   ├── lostPersonController.js
│   │   │   ├── medicalController.js
│   │   │   ├── emergencyExitController.js
│   │   │   └── feedbackController.js
│   │   │
│   │   ├── routes/              # API Routes
│   │   │   ├── authRoutes.js
│   │   │   ├── eventRoutes.js
│   │   │   ├── zoneRoutes.js
│   │   │   ├── lostPersonRoutes.js
│   │   │   ├── medicalRoutes.js
│   │   │   ├── emergencyExitRoutes.js
│   │   │   └── feedbackRoutes.js
│   │   │
│   │   ├── middleware/          # Custom Middleware
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   │
│   │   ├── config/              # Configuration
│   │   │   └── database.js
│   │   │
│   │   └── utils/               # Utilities
│   │       └── seedData.js
│   │
│   ├── server.js                # Entry Point
│   ├── package.json
│   ├── .env.example
│   └── .env (not committed)
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/          # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── StatusBadge.jsx
│   │   │
│   │   ├── pages/               # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Events.jsx
│   │   │   ├── Zones.jsx
│   │   │   ├── LostPersons.jsx
│   │   │   ├── Medical.jsx
│   │   │   ├── EmergencyExits.jsx
│   │   │   └── Feedback.jsx
│   │   │
│   │   ├── services/            # API Services
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   │
│   │   ├── store/               # Redux Store
│   │   │   ├── index.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       └── eventSlice.js
│   │   │
│   │   ├── App.js               # Main App Component
│   │   ├── index.js             # Entry Point
│   │   └── index.css            # Global Styles
│   │
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── .gitignore
├── README.md
├── QUICKSTART.md
├── ARCHITECTURE.md
└── setup.sh
```

## Data Flow

### Authentication Flow
```
┌────────┐     login     ┌────────┐    verify    ┌──────────┐
│ Client │ ─────────────►│ Server │ ────────────►│ Database │
└────────┘               └────────┘              └──────────┘
    ▲                         │
    │        JWT Token        │
    └─────────────────────────┘
```

### CRUD Operations Flow
```
┌────────┐   HTTP Request   ┌────────────┐   Query   ┌──────────┐
│ Client │ ────────────────►│ Controller │ ─────────►│ Database │
└────────┘                  └────────────┘           └──────────┘
    ▲                             │                        │
    │         Response            │       Result           │
    └─────────────────────────────┴────────────────────────┘
```

### Real-time Updates Flow
```
┌────────┐   Socket Event   ┌────────────┐   Broadcast   ┌─────────┐
│ Client │ ────────────────►│ Socket.io  │ ─────────────►│ Clients │
└────────┘                  └────────────┘               └─────────┘
```

## Database Schema

### Collections

1. **Users** - Event organizers
   - organizerId (unique)
   - password (hashed)
   - name, email, role

2. **Events** - Event information
   - name, description, date, location
   - totalCapacity, currentAttendance
   - status, organizer (ref)

3. **Zones** - Event zones
   - name, capacity, area, currentCount
   - densityStatus, image, event (ref)

4. **LostPersons** - Missing person reports
   - name, age, gender, photo
   - location, lastSeenTime, description
   - reporterName, reporterContact
   - event (ref), status

5. **MedicalFacilities** - Medical resources
   - name, type, location
   - contactNumber, availability
   - event (ref)

6. **EmergencyExits** - Exit points
   - name, location, capacity
   - currentCrowdLevel, status
   - event (ref)

7. **Feedback** - User feedback
   - userName, category, rating
   - comment, submittedAt
   - event (ref)

## API Endpoints

### Authentication
- POST `/api/auth/login` - Login
- POST `/api/auth/register` - Register
- GET `/api/auth/me` - Get current user

### Events
- GET `/api/events` - List all events
- GET `/api/events/:id` - Get event details
- POST `/api/events` - Create event
- PUT `/api/events/:id` - Update event
- DELETE `/api/events/:id` - Delete event
- GET `/api/events/stats` - Get statistics

### Zones
- GET `/api/zones` - List all zones
- GET `/api/zones/event/:eventId` - Get zones by event
- POST `/api/zones` - Create zone
- PUT `/api/zones/:id` - Update zone
- PUT `/api/zones/:id/crowd` - Update crowd count
- DELETE `/api/zones/:id` - Delete zone

### Lost Persons
- GET `/api/lost-persons` - List all reports
- GET `/api/lost-persons/event/:eventId` - Get by event
- POST `/api/lost-persons` - Create report
- PUT `/api/lost-persons/:id` - Update report
- GET `/api/lost-persons/stats` - Get statistics

### Medical Facilities
- GET `/api/medical` - List all facilities
- GET `/api/medical/event/:eventId` - Get by event
- POST `/api/medical` - Create facility
- PUT `/api/medical/:id` - Update facility
- DELETE `/api/medical/:id` - Delete facility

### Emergency Exits
- GET `/api/emergency-exits` - List all exits
- GET `/api/emergency-exits/event/:eventId` - Get by event
- POST `/api/emergency-exits` - Create exit
- PUT `/api/emergency-exits/:id` - Update exit
- PUT `/api/emergency-exits/:id/crowd` - Update crowd level
- DELETE `/api/emergency-exits/:id` - Delete exit

### Feedback
- GET `/api/feedback` - List all feedback
- GET `/api/feedback/event/:eventId` - Get by event
- POST `/api/feedback` - Create feedback
- GET `/api/feedback/analytics` - Get analytics
- GET `/api/feedback/analytics/event/:eventId` - Get analytics by event

## Security

### Authentication
- JWT tokens with expiration
- bcrypt password hashing (10 rounds)
- Protected routes with auth middleware

### API Security
- CORS enabled
- Environment variables for secrets
- Input validation
- Error handling

## Features

### Core Features
1. **Authentication** - Secure login system
2. **Event Management** - Full CRUD operations
3. **Zone Management** - AI crowd density analysis
4. **Lost Persons** - Reporting and tracking
5. **Medical Facilities** - Resource management
6. **Emergency Exits** - Real-time monitoring
7. **Feedback & Analytics** - Data visualization

### Advanced Features
- Real-time updates with Socket.io
- Responsive design
- Professional UI/UX
- Data visualization with charts
- Status indicators
- Search and filter capabilities

## Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start
```

### Production
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm run build
# Serve the build folder
```

## Future Enhancements

1. **Real AI Integration** - Actual image processing
2. **Mobile App** - React Native application
3. **Push Notifications** - Alert system
4. **Advanced Analytics** - ML-based predictions
5. **Multi-language Support** - i18n
6. **Role-based Access** - Multiple user roles
7. **Export Reports** - PDF generation
8. **Map Integration** - Google Maps/Mapbox
