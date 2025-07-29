import express from 'express';
import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Get attendance summary for an employee
router.get('/attendance-summary/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;
    
    let dateFilter = { employee_id: employeeId };
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      dateFilter.date = { $gte: startDate, $lte: endDate };
    }
    
    const attendanceRecords = await Attendance.find(dateFilter);
    
    const summary = {
      total_days: attendanceRecords.length,
      present_days: attendanceRecords.filter(record => record.status === 'present').length,
      absent_days: attendanceRecords.filter(record => record.status === 'absent').length,
      total_hours: attendanceRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0),
      avg_hours: attendanceRecords.length > 0 
        ? attendanceRecords.reduce((sum, record) => sum + (record.total_hours || 0), 0) / attendanceRecords.length 
        : 0
    };
    
    res.json(summary);
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get department-wise attendance report (admin only)
router.get('/department-attendance', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const { month, year } = req.query;
    let dateFilter = {};
    
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      dateFilter.date = { $gte: startDate, $lte: endDate };
    }
    
    // Get all employees grouped by department
    const employees = await Employee.find({ is_active: true });
    const departmentStats = {};
    
    for (const employee of employees) {
      if (!departmentStats[employee.department]) {
        departmentStats[employee.department] = {
          department: employee.department,
          total_employees: 0,
          total_records: 0,
          present_days: 0,
          total_hours: 0
        };
      }
      
      departmentStats[employee.department].total_employees++;
      
      // Get attendance records for this employee
      const attendanceFilter = { employee_id: employee.employee_id, ...dateFilter };
      const attendanceRecords = await Attendance.find(attendanceFilter);
      
      departmentStats[employee.department].total_records += attendanceRecords.length;
      departmentStats[employee.department].present_days += attendanceRecords.filter(r => r.status === 'present').length;
      departmentStats[employee.department].total_hours += attendanceRecords.reduce((sum, r) => sum + (r.total_hours || 0), 0);
    }
    
    // Calculate average hours
    const report = Object.values(departmentStats).map(dept => ({
      ...dept,
      avg_hours: dept.total_records > 0 ? (dept.total_hours / dept.total_records).toFixed(2) : 0
    }));
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching department attendance report:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get monthly attendance trends
router.get('/monthly-trends/:employeeId', verifyToken, async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { year } = req.query;
    const currentYear = year || new Date().getFullYear();
    
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear, 11, 31);
    
    const attendanceRecords = await Attendance.find({
      employee_id: employeeId,
      date: { $gte: startDate, $lte: endDate }
    });
    
    // Group by month
    const monthlyData = {};
    for (let month = 1; month <= 12; month++) {
      monthlyData[month] = {
        month: month.toString().padStart(2, '0'),
        total_days: 0,
        present_days: 0,
        total_hours: 0
      };
    }
    
    attendanceRecords.forEach(record => {
      const month = record.date.getMonth() + 1;
      monthlyData[month].total_days++;
      if (record.status === 'present') {
        monthlyData[month].present_days++;
      }
      monthlyData[month].total_hours += record.total_hours || 0;
    });
    
    // Calculate average hours and convert to array
    const trends = Object.values(monthlyData)
      .filter(data => data.total_days > 0)
      .map(data => ({
        ...data,
        avg_hours: data.total_days > 0 ? (data.total_hours / data.total_days).toFixed(2) : 0
      }));
    
    res.json(trends);
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;