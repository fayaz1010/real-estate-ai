// PLACEHOLDER FILE: components\ApplicationWizard\ReferencesStep.tsx
// TODO: Add your implementation here

import React from 'react';
import { Users, Plus, Trash2, Phone, Mail } from 'lucide-react';
import { useApplicationForm } from '../../hooks/useApplicationForm';
import { Reference } from '../../types/application.types';

const ReferencesStep: React.FC = () => {
  const { formData, addArrayItem, updateArrayItem, removeArrayItem } = useApplicationForm();
  const references = formData.references || [];

  const emptyReference: Partial<Reference> = {
    name: '',
    relationship: 'personal',
    phone: '',
    email: '',
    yearsKnown: 0,
    contacted: false,
  };

  const handleAdd = () => {
    addArrayItem('references', emptyReference);
  };

  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = { ...references[index], [field]: value };
    updateArrayItem('references', index, updated);
  };

  const handleRemove = (index: number) => {
    if (confirm('Remove this reference?')) {
      removeArrayItem('references', index);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">References</h2>
        <p className="text-gray-600">
          Provide at least 2 references who can vouch for your character and reliability.
        </p>
      </div>

      {/* References List */}
      <div className="space-y-4">
        {references.map((ref: Partial<Reference>, index: number) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {ref.name || `Reference #${index + 1}`}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {ref.relationship?.replace('_', ' ')}
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

            <div className="space-y-4">
              {/* Name & Relationship */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={ref.name || ''}
                    onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship *
                  </label>
                  <select
                    value={ref.relationship || 'personal'}
                    onChange={(e) => handleUpdate(index, 'relationship', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="employer">Employer</option>
                    <option value="personal">Personal Friend</option>
                    <option value="professional">Professional Colleague</option>
                    <option value="previous_landlord">Previous Landlord</option>
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={ref.phone || ''}
                      onChange={(e) => handleUpdate(index, 'phone', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={ref.email || ''}
                      onChange={(e) => handleUpdate(index, 'email', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Years Known */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How long have you known this person? *
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={ref.yearsKnown || ''}
                    onChange={(e) => handleUpdate(index, 'yearsKnown', parseInt(e.target.value) || 0)}
                    className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                  <span className="text-gray-600">years</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Reference Button */}
      <button
        onClick={handleAdd}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Reference
      </button>

      {references.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No references added yet. Please add at least 2 references.
        </div>
      )}

      {references.length < 2 && references.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You need at least 2 references. Please add {2 - references.length} more.
          </p>
        </div>
      )}

      {/* Reference Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Reference Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choose people who know you well and can speak to your character</li>
          <li>• Employers, supervisors, and previous landlords make excellent references</li>
          <li>• Avoid using family members as references</li>
          <li>• Inform your references that they may be contacted</li>
          <li>• Make sure contact information is current and accurate</li>
        </ul>
      </div>
    </div>
  );
};

export default ReferencesStep;