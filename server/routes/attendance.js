import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get current attendance status
router.get('/status/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employee_id: employeeId,
      date: today
    });
    
    res.json(attendance || null);
  } catch (error) {
    console.error('Error fetching attendance status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clock in
router.post('/clock-in', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find employee
    const employee = await Employee.findOne({ employee_id: employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check if already clocked in today
    let attendance = await Attendance.findOne({
      employee_id: employeeId,
      date: today
    });
    
    if (attendance && attendance.clock_in) {
      return res.status(400).json({ error: 'Already clocked in today' });
    }
    
    if (attendance) {
      // Update existing record
      attendance.clock_in = now;
      attendance.status = 'present';
      await attendance.save();
    } else {
      // Create new record
      attendance = new Attendance({
        employee_id: employeeId,
        employee: employee._id,
        date: today,
        clock_in: now,
        status: 'present'
      });
      await attendance.save();
    }
    
    res.json({ 
      message: 'Clocked in successfully', 
      time: now.toISOString(),
      attendance: attendance
    });
  } catch (error) {
    console.error('Clock in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Clock out
router.post('/clock-out', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.body;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      employee_id: employeeId,
      date: today
    });
    
    if (!attendance || !attendance.clock_in) {
      return res.status(400).json({ error: 'Must clock in first' });
    }
    
    if (attendance.clock_out) {
      return res.status(400).json({ error: 'Already clocked out today' });
    }
    
    // Update attendance record
    attendance.clock_out = now;
    await attendance.save(); // This will trigger the pre-save middleware to calculate total_hours
    
    res.json({ 
      message: 'Clocked out successfully', 
      time: now.toISOString(),
      totalHours: attendance.total_hours.toFixed(2),
      attendance: attendance
    });
  } catch (error) {
    console.error('Clock out error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get attendance history
router.get('/history/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    // Find the requesting user to get companyName and role
    const requestingUser = await Employee.findOne({ employee_id: req.user.employeeId });
    if (!requestingUser) {
      return res.status(404).json({ error: 'Requesting user not found' });
    }

    let query = { employee_id: employeeId };

    // If the requesting user is admin, restrict to same company employees only
    if (requestingUser.role === 'admin') {
      const targetEmployee = await Employee.findOne({ employee_id: employeeId });
      if (!targetEmployee || targetEmployee.companyName !== requestingUser.companyName) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else {
      // Non-admin users can only access their own attendance
      if (requestingUser.employee_id !== employeeId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const records = await Attendance.find(query)
      .populate('employee', 'name email department position')
      .sort({ date: -1 })
      .limit(30);

    res.json(records);
  } catch (error) {
    console.error('Error fetching attendance history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;