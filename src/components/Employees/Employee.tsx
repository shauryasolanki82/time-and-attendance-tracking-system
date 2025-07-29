import { useState } from 'react';
import { AddEmployee } from './AddEmp'; // adjust path if needed

export const Employee = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(prev => !prev);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-blue-600 p-4 text-white">
        <div className="text-lg font-bold">Employee Section</div>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          onClick={toggleForm}
        >
          {showForm ? 'Close Form' : 'Add Employee'}
        </button>
      </nav>

      {/* Show form conditionally */}
      {showForm && <AddEmployee />}

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Employees</h2>
        <div className="border p-4 rounded shadow bg-white">
          <p className="text-gray-600">Company can see their employees here.</p>
          {/* Add employee list here */}
        </div>
      </div>
    </div>
  );
};
