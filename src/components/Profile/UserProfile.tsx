import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Building, Briefcase, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface EmployeeProfile {
  employee_id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  hire_date: string;
}

const UserProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user, token]);

  const fetchProfile = async () => {
    if (!user || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/employees/profile/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <p className="text-gray-600">Profile not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <p className="text-blue-100">{profile.position}</p>
              <p className="text-blue-200 text-sm">ID: {profile.employee_id}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email Address</p>
                <p className="text-gray-900">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Building size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Department</p>
                <p className="text-gray-900">{profile.department}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Briefcase size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Position</p>
                <p className="text-gray-900">{profile.position}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Calendar size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Hire Date</p>
                <p className="text-gray-900">
                  {format(new Date(profile.hire_date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Status</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-700 font-medium">Active</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Role</p>
              <p className="text-sm text-gray-900 capitalize mt-1">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;