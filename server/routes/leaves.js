import express from 'express';
import Employee from '../models/Employee.js';
import LeaveBalance from '../models/LeaveBalance.js';
import LeaveRequest from '../models/LeaveRequest.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Submit leave request
router.post('/request', verifyToken, async (req, res) => {
  try {
    const { employeeId, leaveType, startDate, endDate, reason } = req.body;
    
    // Find employee
    const employee = await Employee.findOne({ employee_id: employeeId });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Check leave balance
    const currentYear = new Date().getFullYear();
    const leaveBalance = await LeaveBalance.findOne({
      employee_id: employeeId,
      year: currentYear
    });
    
    if (!leaveBalance) {
      return res.status(400).json({ error: 'Leave balance not found' });
    }
    
    // Create leave request
    const leaveRequest = new LeaveRequest({
      employee_id: employeeId,
      employee: employee._id,
      leave_type: leaveType,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      reason: reason
    });
    
    await leaveRequest.save();
    
    res.json({ message: 'Leave request submitted successfully' });
  } catch (error) {
    console.error('Error submitting leave request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leave requests
router.get('/requests/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    const requests = await LeaveRequest.find({ employee_id: employeeId })
      .populate('employee', 'name email department position')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get leave balance
router.get('/balance/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentYear = new Date().getFullYear();
    
    let balance = await LeaveBalance.findOne({
      employee_id: employeeId,
      year: currentYear
    });
    
    if (!balance) {
      // Create balance if it doesn't exist
      const employee = await Employee.findOne({ employee_id: employeeId });
      if (employee) {
        balance = new LeaveBalance({
          employee_id: employeeId,
          employee: employee._id,
          year: currentYear
        });
        await balance.save();
      }
    }
    
    res.json(balance || { 
      annual_leave: 25, 
      sick_leave: 10, 
      personal_leave: 5,
      used_annual_leave: 0,
      used_sick_leave: 0,
      used_personal_leave: 0
    });
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Get all leave requests
router.get('/admin/requests', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const requests = await LeaveRequest.find()
      .populate('employee', 'name email department position')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching admin leave requests:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Approve/Reject leave request
router.put('/admin/requests/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { id } = req.params;
    const { status, rejection_reason } = req.body;
    
    const updateData = {
      status,
      approved_by: req.user.employeeId,
      approved_date: new Date()
    };
    
    if (status === 'rejected' && rejection_reason) {
      updateData.rejection_reason = rejection_reason;
    }
    
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('employee', 'name email department position');
    
    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }
    
    res.json({ 
      message: 'Leave request updated successfully',
      leaveRequest
    });
  } catch (error) {
    console.error('Error updating leave request:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;