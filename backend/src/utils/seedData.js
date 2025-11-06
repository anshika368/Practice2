require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

// Import models
const User = require('../models/User');
const Event = require('../models/Event');
const Zone = require('../models/Zone');
const LostPerson = require('../models/LostPerson');
const MedicalFacility = require('../models/MedicalFacility');
const EmergencyExit = require('../models/EmergencyExit');
const Feedback = require('../models/Feedback');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Event.deleteMany({});
    await Zone.deleteMany({});
    await LostPerson.deleteMany({});
    await MedicalFacility.deleteMany({});
    await EmergencyExit.deleteMany({});
    await Feedback.deleteMany({});

    // Create users
    console.log('Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      {
        organizerId: 'ORG001',
        password: hashedPassword,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'organizer'
      },
      {
        organizerId: 'ORG002',
        password: hashedPassword,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'organizer'
      }
    ]);

    // Create events
    console.log('Creating events...');
    const events = await Event.insertMany([
      {
        name: 'Summer Music Festival 2024',
        description: 'Annual summer music festival featuring top artists',
        date: new Date('2024-07-15'),
        location: 'Central Park, New York',
        totalCapacity: 50000,
        currentAttendance: 35000,
        status: 'ongoing',
        organizer: users[0]._id
      },
      {
        name: 'Tech Conference 2024',
        description: 'International technology conference and expo',
        date: new Date('2024-08-20'),
        location: 'Convention Center, San Francisco',
        totalCapacity: 15000,
        currentAttendance: 0,
        status: 'upcoming',
        organizer: users[0]._id
      },
      {
        name: 'Food Festival 2024',
        description: 'International food festival with cuisines from around the world',
        date: new Date('2024-09-10'),
        location: 'Downtown Square, Chicago',
        totalCapacity: 30000,
        currentAttendance: 22000,
        status: 'ongoing',
        organizer: users[1]._id
      }
    ]);

    // Create zones
    console.log('Creating zones...');
    const zones = await Zone.insertMany([
      {
        name: 'Main Stage Area',
        event: events[0]._id,
        capacity: 20000,
        area: 5000,
        currentCount: 18500,
        densityStatus: 'moderate',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3'
      },
      {
        name: 'Food Court Zone',
        event: events[0]._id,
        capacity: 10000,
        area: 2000,
        currentCount: 8500,
        densityStatus: 'moderate',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
      },
      {
        name: 'VIP Lounge',
        event: events[0]._id,
        capacity: 2000,
        area: 1000,
        currentCount: 850,
        densityStatus: 'low',
        image: 'https://images.unsplash.com/photo-1519167758481-83f29da8fdec'
      },
      {
        name: 'Exhibition Hall A',
        event: events[1]._id,
        capacity: 5000,
        area: 3000,
        currentCount: 0,
        densityStatus: 'low',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
      }
    ]);

    // Create lost person reports
    console.log('Creating lost person reports...');
    await LostPerson.insertMany([
      {
        name: 'Emily Johnson',
        age: 8,
        gender: 'female',
        photo: 'https://i.pravatar.cc/150?img=1',
        location: 'Near Main Stage',
        lastSeenTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        description: 'Wearing a pink dress with white flowers, blonde hair in pigtails',
        reporterName: 'Sarah Johnson',
        reporterContact: '+1-555-0123',
        event: events[0]._id,
        status: 'searching'
      },
      {
        name: 'Michael Brown',
        age: 65,
        gender: 'male',
        photo: 'https://i.pravatar.cc/150?img=12',
        location: 'Food Court Area',
        lastSeenTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
        description: 'Gray hair, wearing blue jacket and jeans, walks with a cane',
        reporterName: 'Linda Brown',
        reporterContact: '+1-555-0124',
        event: events[0]._id,
        status: 'found'
      },
      {
        name: 'Tommy Lee',
        age: 12,
        gender: 'male',
        photo: 'https://i.pravatar.cc/150?img=33',
        location: 'Parking Lot C',
        lastSeenTime: new Date(Date.now() - 30 * 60 * 1000),
        description: 'Red t-shirt, blue shorts, brown hair, wearing glasses',
        reporterName: 'David Lee',
        reporterContact: '+1-555-0125',
        event: events[2]._id,
        status: 'reported'
      }
    ]);

    // Create medical facilities
    console.log('Creating medical facilities...');
    await MedicalFacility.insertMany([
      {
        name: 'First Aid Station 1',
        type: 'firstaid',
        location: 'Near Main Entrance',
        contactNumber: '+1-555-FIRST1',
        availability: 'available',
        event: events[0]._id
      },
      {
        name: 'First Aid Station 2',
        type: 'firstaid',
        location: 'Food Court Area',
        contactNumber: '+1-555-FIRST2',
        availability: 'busy',
        event: events[0]._id
      },
      {
        name: 'Ambulance Unit 1',
        type: 'ambulance',
        location: 'South Parking Lot',
        contactNumber: '+1-555-AMB001',
        availability: 'available',
        event: events[0]._id
      },
      {
        name: 'Emergency Medical Center',
        type: 'emergency',
        location: 'Central Building Block A',
        contactNumber: '+1-555-EMRGNCY',
        availability: 'available',
        event: events[1]._id
      }
    ]);

    // Create emergency exits
    console.log('Creating emergency exits...');
    await EmergencyExit.insertMany([
      {
        name: 'North Exit A',
        location: 'North Side, Gate 1',
        capacity: 5000,
        currentCrowdLevel: 250,
        status: 'clear',
        event: events[0]._id
      },
      {
        name: 'South Exit B',
        location: 'South Side, Gate 2',
        capacity: 5000,
        currentCrowdLevel: 3200,
        status: 'moderate',
        event: events[0]._id
      },
      {
        name: 'East Exit C',
        location: 'East Side, Gate 3',
        capacity: 4000,
        currentCrowdLevel: 3500,
        status: 'crowded',
        event: events[0]._id
      },
      {
        name: 'West Exit D',
        location: 'West Side, Gate 4',
        capacity: 4000,
        currentCrowdLevel: 800,
        status: 'clear',
        event: events[0]._id
      },
      {
        name: 'Main Exit',
        location: 'Main Entrance',
        capacity: 3000,
        currentCrowdLevel: 0,
        status: 'clear',
        event: events[1]._id
      }
    ]);

    // Create feedback
    console.log('Creating feedback...');
    await Feedback.insertMany([
      {
        event: events[0]._id,
        userName: 'Alex Thompson',
        category: 'safety',
        rating: 5,
        comment: 'Excellent security measures and staff were very helpful',
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        event: events[0]._id,
        userName: 'Maria Garcia',
        category: 'facilities',
        rating: 4,
        comment: 'Good facilities but restrooms could be cleaner',
        submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      },
      {
        event: events[0]._id,
        userName: 'Robert Chen',
        category: 'organization',
        rating: 5,
        comment: 'Very well organized event, smooth entry and exit',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        event: events[0]._id,
        userName: 'Jennifer White',
        category: 'crowd_management',
        rating: 4,
        comment: 'Crowd management was good but some areas were too crowded',
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        event: events[0]._id,
        userName: 'David Kim',
        category: 'medical',
        rating: 5,
        comment: 'Medical staff responded quickly to an emergency',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        event: events[0]._id,
        userName: 'Lisa Anderson',
        category: 'overall',
        rating: 5,
        comment: 'Amazing experience! Will definitely attend again next year',
        submittedAt: new Date()
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\nDefault Login Credentials:');
    console.log('Organizer ID: ORG001');
    console.log('Password: password123');
    console.log('\nAlternative Login:');
    console.log('Organizer ID: ORG002');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
