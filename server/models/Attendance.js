import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
    default: () => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), today.getDate());
    }
  },
  clock_in: {
    type: Date,
    default: null
  },
  clock_out: {
    type: Date,
    default: null
  },
  total_hours: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late', 'half_day'],
    default: 'present'
  },
  notes: {
    type: String,
    trim: true
  },
  break_time: {
    type: Number,
    default: 0 // in minutes
  },
  overtime_hours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for employee and date
attendanceSchema.index({ employee_id: 1, date: 1 }, { unique: true });

// Calculate total hours before saving
attendanceSchema.pre('save', function(next) {
  if (this.clock_in && this.clock_out) {
    const timeDiff = this.clock_out.getTime() - this.clock_in.getTime();
    const hours = timeDiff / (1000 * 60 * 60);
    this.total_hours = Math.max(0, hours - (this.break_time / 60));
    
    // Calculate overtime (assuming 8 hours is standard)
    this.overtime_hours = Math.max(0, this.total_hours - 8);
  }
  next();
});

export default mongoose.model('Attendance', attendanceSchema);