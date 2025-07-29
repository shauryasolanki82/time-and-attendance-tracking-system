import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
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
  leave_type: {
    type: String,
    required: true,
    enum: ['annual_leave', 'sick_leave', 'personal_leave', 'maternity_leave', 'paternity_leave', 'emergency_leave']
  },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  days_requested: {
    type: Number,
    required: true,
    min: 0.5
  },
  reason: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  approved_by: {
    type: String,
    ref: 'Employee'
  },
  approved_date: {
    type: Date
  },
  rejection_reason: {
    type: String,
    trim: true
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }]
}, {
  timestamps: true
});

// Calculate days requested before saving
leaveRequestSchema.pre('save', function(next) {
  if (this.start_date && this.end_date) {
    const timeDiff = this.end_date.getTime() - this.start_date.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    this.days_requested = daysDiff;
  }
  next();
});

export default mongoose.model('LeaveRequest', leaveRequestSchema);