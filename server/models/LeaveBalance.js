import mongoose from 'mongoose';

const leaveBalanceSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    ref: 'Employee'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  year: {
    type: Number,
    required: true,
    default: () => new Date().getFullYear()
  },
  annual_leave: {
    type: Number,
    default: 25,
    min: 0
  },
  sick_leave: {
    type: Number,
    default: 10,
    min: 0
  },
  personal_leave: {
    type: Number,
    default: 5,
    min: 0
  },
  maternity_leave: {
    type: Number,
    default: 90,
    min: 0
  },
  paternity_leave: {
    type: Number,
    default: 15,
    min: 0
  },
  emergency_leave: {
    type: Number,
    default: 3,
    min: 0
  },
  used_annual_leave: {
    type: Number,
    default: 0,
    min: 0
  },
  used_sick_leave: {
    type: Number,
    default: 0,
    min: 0
  },
  used_personal_leave: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Compound index for employee and year
leaveBalanceSchema.index({ employee_id: 1, year: 1 }, { unique: true });

export default mongoose.model('LeaveBalance', leaveBalanceSchema);