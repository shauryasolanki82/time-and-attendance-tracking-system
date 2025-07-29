import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AttendanceSummary {
  total_days: number;
  present_days: number;
  absent_days: number;
  avg_hours: number;
  total_hours: number;
}

const DashboardStats: React.FC = () => {
  const { user, token } = useAuth();
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        
        const response = await fetch(
          `http://localhost:3001/api/reports/attendance-summary/${user?.id}?month=${month}&year=${year}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        }
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchSummary();
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Hours',
      value: summary?.total_hours?.toFixed(1) || '0',
      subtitle: 'This month',
      icon: Clock,
      color: 'blue',
    },
    {
      title: 'Present Days',
      value: summary?.present_days || 0,
      subtitle: `Out of ${summary?.total_days || 0} days`,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Absent Days',
      value: summary?.absent_days || 0,
      subtitle: 'This month',
      icon: XCircle,
      color: 'red',
    },
    {
      title: 'Average Hours',
      value: summary?.avg_hours?.toFixed(1) || '0',
      subtitle: 'Per day',
      icon: Calendar,
      color: 'purple',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <>
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-700">
          Role: <strong>{user?.role}</strong>
        </p>
        <p className="text-sm text-gray-700">
          Company: <strong>{user?.companyName}</strong>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-full ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DashboardStats;