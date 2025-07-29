import Employee from '../models/Employee.js';
import LeaveBalance from '../models/LeaveBalance.js';

const seedDatabase = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Employee.findOne({ employee_id: 'ADMIN001' });
    
    if (!adminExists) {
      // Create admin user
      const admin = new Employee({
        employee_id: 'ADMIN001',
        name: 'System Administrator',
        email: 'admin@company.com',
        password: 'admin123', // Will be hashed by pre-save middleware
        department: 'IT',
        position: 'Administrator',
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created');

      // Create leave balance for admin
      const adminBalance = new LeaveBalance({
        employee_id: 'ADMIN001',
        employee: admin._id,
        year: new Date().getFullYear()
      });
      await adminBalance.save();
    }

    // Create sample employees
    const sampleEmployees = [
      {
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john.doe@company.com',
        password: 'password123',
        department: 'Engineering',
        position: 'Software Developer'
      },
      {
        employee_id: 'EMP002',
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        password: 'password123',
        department: 'Marketing',
        position: 'Marketing Manager'
      },
      {
        employee_id: 'EMP003',
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        password: 'password123',
        department: 'Sales',
        position: 'Sales Representative'
      }
    ];

    for (const empData of sampleEmployees) {
      const exists = await Employee.findOne({ employee_id: empData.employee_id });
      if (!exists) {
        const employee = new Employee(empData);
        await employee.save();
        
        // Create leave balance
        const balance = new LeaveBalance({
          employee_id: empData.employee_id,
          employee: employee._id,
          year: new Date().getFullYear()
        });
        await balance.save();
        
        console.log(`Employee ${empData.employee_id} created`);
      }
    }

    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedDatabase;