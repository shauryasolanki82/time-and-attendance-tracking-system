import express from 'express';
import jwt from 'jsonwebtoken';
import Employee from '../models/Employee.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';

// Login
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    
    // Find employee by employee_id
    const employee = await Employee.findOne({ employee_id: employeeId });
    
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check if employee is active
    if (!employee.is_active) {
      return res.status(401).json({ error: 'Account is deactivated' });
    }
    
    // Compare password
    const validPassword = await employee.comparePassword(password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        employeeId: employee.employee_id, 
        role: employee.role,
        id: employee._id 
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      token,
      employee: {
        id: employee.employee_id,
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        role: employee.role,
        companyName: employee.companyName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export { router, verifyToken };
