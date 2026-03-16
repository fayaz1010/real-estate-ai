// PLACEHOLDER FILE: components\ApplicationWizard\EmploymentStep.tsx
// TODO: Add your implementation here
import React, { useState } from 'react';
import { Briefcase, Plus, Trash2, Home, Calendar } from 'lucide-react';
import { useApplicationForm } from '../../hooks/useApplicationForm';
import { EmploymentInfo } from '../../types/application.types';

const EmploymentStep: React.FC = () => {
  const { formData, addArrayItem, updateArrayItem, removeArrayItem } = useApplicationForm();
  const employment = formData.employment || [];
  const [editingIndex, setEditingIndex] = useState<number>(-1);

  const emptyEmployment: Partial<EmploymentInfo> = {
    employerName: '',
    jobTitle: '',
    employmentType: 'full_time',
    startDate: '',
    endDate: '',
    isCurrent: true,
    supervisorName: '',
    supervisorPhone: '',
    supervisorEmail: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
    verificationStatus: 'not_started',
  };

  const handleAdd = () => {
    addArrayItem('employment', emptyEmployment);
    setEditingIndex(employment.length);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = { ...employment[index], [field]: value };
    updateArrayItem('employment', index, updated);
  };

  const handleAddressUpdate = (index: number, field: string, value: string) => {
    const updated = {
      ...employment[index],
      address: {
        ...employment[index].address,
        [field]: value,
      },
    };
    updateArrayItem('employment', index, updated);
  };

  const handleRemove = (index: number) => {
    if (confirm('Are you sure you want to remove this employment entry?')) {
      removeArrayItem('employment', index);
      if (editingIndex === index) {
        setEditingIndex(-1);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Employment History</h2>
        <p className="text-gray-600">
          List your current and previous employment. At least one entry is required.
        </p>
      </div>

      {/* Employment List */}
      <div className="space-y-4">
        {employment.map((emp: Partial<EmploymentInfo>, index: number) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {emp.jobTitle || 'Job Title'} at {emp.employerName || 'Company Name'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {emp.employmentType?.replace('_', ' ').toUpperCase()} • {emp.isCurrent ? 'Current' : 'Past'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {editingIndex === index ? (
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employer Name *
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={emp.employerName || ''}
                        onChange={(e) => handleUpdate(index, 'employerName', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Acme Corp"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      value={emp.jobTitle || ''}
                      onChange={(e) => handleUpdate(index, 'jobTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Software Engineer"
                    />
                  </div>
                </div>

                {/* Employment Type & Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employment Type *
                    </label>
                    <select
                      value={emp.employmentType || 'full_time'}
                      onChange={(e) => handleUpdate(index, 'employmentType', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full_time">Full Time</option>
                      <option value="part_time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="self_employed">Self Employed</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emp.isCurrent || false}
                        onChange={(e) => handleUpdate(index, 'isCurrent', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        This is my current employer
                      </span>
                    </label>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={emp.startDate || ''}
                        onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {!emp.isCurrent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={emp.endDate || ''}
                        onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>

                {/* Supervisor Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Supervisor Information (Optional)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supervisor Name
                      </label>
                      <input
                        type="text"
                        value={emp.supervisorName || ''}
                        onChange={(e) => handleUpdate(index, 'supervisorName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Jane Smith"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={emp.supervisorPhone || ''}
                        onChange={(e) => handleUpdate(index, 'supervisorPhone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={emp.supervisorEmail || ''}
                        onChange={(e) => handleUpdate(index, 'supervisorEmail', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="jane@company.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Employer Address */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Employer Address</h4>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={emp.address?.street || ''}
                      onChange={(e) => handleAddressUpdate(index, 'street', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Street Address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={emp.address?.city || ''}
                        onChange={(e) => handleAddressUpdate(index, 'city', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={emp.address?.state || ''}
                        onChange={(e) => handleAddressUpdate(index, 'state', e.target.value.toUpperCase())}
                        maxLength={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="State"
                      />
                      <input
                        type="text"
                        value={emp.address?.zipCode || ''}
                        onChange={(e) => handleAddressUpdate(index, 'zipCode', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="ZIP"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setEditingIndex(-1)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Done Editing
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {emp.startDate} - {emp.isCurrent ? 'Present' : emp.endDate}
                </p>
                {emp.address?.city && emp.address?.state && (
                  <p className="text-sm text-gray-600">
                    {emp.address.city}, {emp.address.state}
                  </p>
                )}
                <button
                  onClick={() => setEditingIndex(index)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit Details
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Employment Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Employment History
      </button>

      {employment.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No employment history added yet. Click the button above to add your first entry.
        </div>
      )}
    </div>
  );
};

export default EmploymentStep;