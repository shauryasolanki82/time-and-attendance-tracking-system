import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, Play, Square, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AttendanceStatus {
  id?: number;
  date: string;
  clock_in?: string;
  clock_out?: string;
  total_hours?: number;
  status: string;
}

const TimeClock: React.FC = () => {
  const { user, token } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchAttendanceStatus();
  }, [user, token]);

  const fetchAttendanceStatus = async () => {
    if (!user || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/attendance/status/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAttendanceStatus(data);
      }
    } catch (error) {
      console.error('Error fetching attendance status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/attendance/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: user?.id }),
      });

      if (response.ok) {
        await fetchAttendanceStatus();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error clocking in:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleClockOut = async () => {
    setActionLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/attendance/clock-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ employeeId: user?.id }),
      });

      if (response.ok) {
        await fetchAttendanceStatus();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Error clocking out:', error);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isWorking = attendanceStatus?.clock_in && !attendanceStatus?.clock_out;
  const hasCompletedDay = attendanceStatus?.clock_in && attendanceStatus?.clock_out;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <Clock size={40} className="text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Time Clock</h2>
          <p className="text-gray-600">Track your work hours</p>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl font-mono font-bold text-gray-900 mb-2">
            {format(currentTime, 'HH:mm:ss')}
          </div>
          <div className="text-lg text-gray-600">
            {format(currentTime, 'EEEE, MMMM d, yyyy')}
          </div>
        </div>

        {hasCompletedDay ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle size={48} className="text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Day Completed</h3>
            <p className="text-green-700 mb-4">You have successfully completed your work day.</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-green-600 font-medium">Clock In</p>
                <p className="text-green-800">
                  {attendanceStatus.clock_in ? format(new Date(attendanceStatus.clock_in), 'HH:mm') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-green-600 font-medium">Clock Out</p>
                <p className="text-green-800">
                  {attendanceStatus.clock_out ? format(new Date(attendanceStatus.clock_out), 'HH:mm') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-green-200">
              <p className="text-green-600 font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-green-800">
                {attendanceStatus.total_hours?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        ) : isWorking ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="animate-pulse inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-3">
              <Clock size={32} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Currently Working</h3>
            <p className="text-yellow-700 mb-4">
              You clocked in at {attendanceStatus.clock_in ? format(new Date(attendanceStatus.clock_in), 'HH:mm') : 'N/A'}
            </p>
            <button
              onClick={handleClockOut}
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <Square size={20} />
              <span>{actionLoading ? 'Clocking Out...' : 'Clock Out'}</span>
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
              <Play size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Ready to Start</h3>
            <p className="text-blue-700 mb-4">Click the button below to clock in and start your work day.</p>
            <button
              onClick={handleClockIn}
              disabled={actionLoading}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Play size={20} />
              <span>{actionLoading ? 'Clocking In...' : 'Clock In'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeClock;