import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Users, 
  BarChart, 
  Shield, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  FileText,
  Zap
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Accurate clock in/out functionality with real-time monitoring and automated calculations.',
      color: 'blue'
    },
    {
      icon: Calendar,
      title: 'Leave Management',
      description: 'Streamlined leave request system with approval workflows and balance tracking.',
      color: 'green'
    },
    {
      icon: BarChart,
      title: 'Advanced Reports',
      description: 'Comprehensive analytics and reporting tools for better workforce insights.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control and data protection.',
      color: 'red'
    }
  ];

  const benefits = [
    'Reduce payroll errors by up to 90%',
    'Save 5+ hours per week on attendance management',
    'Improve employee accountability and transparency',
    'Generate compliance-ready reports instantly',
    'Mobile-friendly interface for remote teams',
    'Real-time notifications and alerts'
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8">
              <Clock size={40} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Modern Time &
              <span className="text-blue-600 block">Attendance Tracking</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline your workforce management with our comprehensive attendance tracking solution. 
              Built for modern businesses that value efficiency, accuracy, and employee satisfaction.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Free Trial
              </Link>
              <Link
                to="/login"
                className="text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors border-2 border-gray-200 hover:border-gray-300"
              >
                Employee Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Attendance
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools you need to track time, manage leaves, 
              and generate insightful reports.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose AttendanceTracker?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of businesses that have transformed their workforce management 
                with our powerful and intuitive platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Today's Overview</h3>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Users size={20} className="text-blue-600" />
                      <span className="font-medium text-gray-900">Active Employees</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">247</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock size={20} className="text-green-600" />
                      <span className="font-medium text-gray-900">Hours Tracked</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">1,976</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-purple-600" />
                      <span className="font-medium text-gray-900">Leave Requests</span>
                    </div>
                    <span className="text-2xl font-bold text-purple-600">12</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-xl mb-6">
            <Zap size={32} className="text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Attendance Management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start your free trial today. 
            No credit card required, setup in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors border-2 border-white border-opacity-30"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;