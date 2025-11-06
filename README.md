# Crowd Management System

A comprehensive full-stack crowd management web application for event organizers built with React, Node.js, Express, and MongoDB.

## Features

### 1. **Authentication System**
- Secure login with Organizer ID and password
- JWT-based authentication
- Session management

### 2. **Event Management Dashboard**
- Create, view, edit, and delete events
- Track event attendance and capacity
- Real-time event statistics
- Event status management (upcoming, ongoing, completed)

### 3. **Zone Management**
- Create and manage event zones
- AI-powered crowd density analysis (>200 per sq meter = crowded)
- Image upload for crowd monitoring
- Real-time capacity tracking
- Visual density indicators (low/moderate/crowded)

### 4. **Lost Person Reporting**
- Comprehensive lost person reports
- Photo upload and description
- Reporter information tracking
- Status updates (reported/searching/found)
- Statistics dashboard

### 5. **Medical Facilities Management**
- Track medical facilities and emergency contacts
- First aid stations, ambulances, hospitals
- Availability status monitoring
- Contact information management

### 6. **Emergency Exits Panel**
- Monitor emergency exit status
- Real-time crowd level tracking
- Capacity management
- Visual status indicators (clear/moderate/crowded)

### 7. **Feedback & Analytics**
- User feedback collection
- Category-based ratings
- Analytics dashboard with charts
- Average ratings by category
- Feedback distribution visualization

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Redux Toolkit** - State management
- **Axios** - API communication
- **Recharts** - Data visualization
- **React Icons** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time updates
- **bcryptjs** - Password hashing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Seed the database with dummy data:
```bash
npm run seed
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Default Login Credentials

**Organizer ID:** ORG001  
**Password:** password123

**Alternative Login:**  
**Organizer ID:** ORG002  
**Password:** password123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new organizer
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/stats` - Get event statistics

### Zones
- `GET /api/zones` - Get all zones
- `GET /api/zones/event/:eventId` - Get zones by event
- `POST /api/zones` - Create zone
- `PUT /api/zones/:id` - Update zone
- `PUT /api/zones/:id/crowd` - Update crowd count
- `DELETE /api/zones/:id` - Delete zone

### Lost Persons
- `GET /api/lost-persons` - Get all reports
- `GET /api/lost-persons/event/:eventId` - Get reports by event
- `POST /api/lost-persons` - Create report
- `PUT /api/lost-persons/:id` - Update report
- `GET /api/lost-persons/stats` - Get statistics

### Medical Facilities
- `GET /api/medical` - Get all facilities
- `GET /api/medical/event/:eventId` - Get facilities by event
- `POST /api/medical` - Create facility
- `PUT /api/medical/:id` - Update facility
- `DELETE /api/medical/:id` - Delete facility

### Emergency Exits
- `GET /api/emergency-exits` - Get all exits
- `GET /api/emergency-exits/event/:eventId` - Get exits by event
- `POST /api/emergency-exits` - Create exit
- `PUT /api/emergency-exits/:id` - Update exit
- `PUT /api/emergency-exits/:id/crowd` - Update crowd level
- `DELETE /api/emergency-exits/:id` - Delete exit

### Feedback
- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/event/:eventId` - Get feedback by event
- `POST /api/feedback` - Create feedback
- `GET /api/feedback/analytics` - Get analytics
- `GET /api/feedback/analytics/event/:eventId` - Get analytics by event

## Real-time Features

The application uses Socket.io for real-time updates:
- Zone crowd density updates
- Emergency exit status changes
- Lost person reports
- Medical emergency alerts

## Project Structure

```
crowd-management-system/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── store/           # Redux store
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   └── package.json
│
└── README.md
```

## Features Highlight

### AI Crowd Density Analysis
The system simulates AI-based crowd density analysis:
- **Low Density:** < 100 people per sq meter
- **Moderate Density:** 100-200 people per sq meter  
- **Crowded:** > 200 people per sq meter

### Professional UI
- Responsive design for all screen sizes
- Modern card-based layout
- Color-coded status indicators
- Interactive charts and graphs
- Real-time status updates

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Session management

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts server with nodemon
```

### Frontend Development
```bash
cd frontend
npm start  # Starts development server
```

### Database Seeding
```bash
cd backend
npm run seed  # Populates database with dummy data
```

## Production Build

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build  # Creates optimized production build
```

## Contributing

This is a demonstration project for a crowd management system. Feel free to extend and customize according to your needs.

## License

ISC

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository.
