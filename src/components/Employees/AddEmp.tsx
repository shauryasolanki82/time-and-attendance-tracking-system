import { ChangeEvent, FormEvent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface EmployeeFormData {
  employee_id: string;
  companyName: string;
  name: string;
  email: string;
  password: string;
  department: string;
  position: string;
  role: 'employee' | 'admin';
  hire_date: string;
}

export const AddEmployee = () => {
  const [formData, setFormData] = useState<EmployeeFormData>({
    employee_id: uuidv4(),
    companyName: '',
    name: '',
    email: '',
    password: '',
    department: '',
    position: '',
    role: 'employee',
    hire_date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting employee data:', formData);

    // Reset form
    setFormData({
      employee_id: uuidv4(),
      companyName: '',
      name: '',
      email: '',
      password: '',
      department: '',
      position: '',
      role: 'employee',
      hire_date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
        <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} type="email" />
        <InputField label="Password" name="password" value={formData.password} onChange={handleChange} type="password" />
        <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
        <InputField label="Position" name="position" value={formData.position} onChange={handleChange} />

        {/* Role select */}
        <div>
          <label className="block font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* Hire date */}
        <InputField label="Hire Date" name="hire_date" value={formData.hire_date} onChange={handleChange} type="date" />

        {/* Read-only ID */}
        <div>
          <label className="block font-semibold">Employee ID (auto-generated)</label>
          <input
            type="text"
            value={formData.employee_id}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

// Reusable InputField component with proper TypeScript typing
interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
}: InputFieldProps) => (
  <div>
    <label className="block font-semibold">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);
