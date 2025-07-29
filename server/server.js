import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/database.js';
import seedDatabase from './utils/seedData.js';

// Import routes
import attendanceRoutes from './routes/attendance.js';
import { router as authRoutes } from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import leaveRoutes from './routes/leaves.js';
import reportRoutes from './routes/reports.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Attendance API is running',
    database: 'MongoDB Atlas',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Seed database with initial data
  try {
    await seedDatabase();
    console.log('Database seeding completed.');
  } catch (error) {
    console.error('Database seeding failed:', error);
  }
});