import express from 'express';
import Employee from '../models/Employee.js';
import LeaveBalance from '../models/LeaveBalance.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Public registration endpoint (no authentication)
router.post('/register', async (req, res) => {
  console.log('Received registration request:', req.body);
  try {
    const { employeeId, name, email, password, department, position, companyName } = req.body;

    const missingFields = [];
    if (!employeeId) missingFields.push('employeeId');
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    if (!companyName) missingFields.push('companyName');

    if (missingFields.length > 0) {
      console.log('Missing required fields in registration:', missingFields.join(', '));
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }

    // Check if employeeId or email already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employee_id: employeeId }, { email }]
    });

    if (existingEmployee) {
      console.log('Employee ID or email already exists:', employeeId, email);
      return res.status(400).json({ error: 'Employee ID or email already exists' });
    }

    // Check if company exists (any admin with this companyName)
    const existingCompanyAdmin = await Employee.findOne({
      companyName: companyName,
      role: 'admin'
    });

    let roleToAssign = 'employee';

    if (!existingCompanyAdmin) {
      // No admin for this company, register this user as admin
      roleToAssign = 'admin';
    }

    const employee = new Employee({
      employee_id: employeeId,
      companyName,
      name,
      email,
      password,
      department,
      position,
      role: roleToAssign
    });

    await employee.save();

    // Initialize leave balance for the new employee
    const leaveBalance = new LeaveBalance({
      employee_id: employee.employee_id,
      employee: employee._id,
      year: new Date().getFullYear()
    });
    await leaveBalance.save();

    console.log(`Registration successful for employee: ${employeeId} with role: ${roleToAssign}`);

    res.json({
      message: 'Registration successful',
      employee: {
        id: employee._id,
        employeeId: employee.employee_id,
        companyName: employee.companyName,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        role: employee.role
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Employee ID or email already exists' });
    } else {
      console.error(error.stack);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Get all employees (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const employees = await Employee.find({ is_active: true })
      .select('-password')
      .sort({ name: 1 });

    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new employee (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { employeeId, name, email, password, department, position } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({
      $or: [{ employee_id: employeeId }, { email }]
    });

    if (existingEmployee) {
      return res.status(400).json({ error: 'Employee ID or email already exists' });
    }

    // Create new employee
    const employee = new Employee({
      employee_id: employeeId,
      name,
      email,
      password, // Assume hashing middleware handles this
      department,
      position,
      hire_date: new Date()
    });

    await employee.save();

    // Add leave balance for new employee
    const leaveBalance = new LeaveBalance({
      employee_id: employee._id,
      year: new Date().getFullYear()
    });
    await leaveBalance.save();

    res.json({
      message: 'Employee added successfully',
      employee: {
        id: employee._id,
        employeeId: employee.employee_id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        role: employee.role
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Employee ID or email already exists' });
    } else {
      console.error('Error adding employee:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Get employee profile
router.get('/profile/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Users can only view their own profile unless admin
    if (req.user.employeeId !== employeeId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const employee = await Employee.findOne({ employee_id: employeeId }).select('-password');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
