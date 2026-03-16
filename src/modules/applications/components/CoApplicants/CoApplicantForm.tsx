// PLACEHOLDER FILE: components\CoApplicants\CoApplicantForm.tsx
// TODO: Add your implementation here

import { User, Briefcase, DollarSign, Save, CheckCircle } from "lucide-react";
import React, { useState } from "react";

import { applicationService } from "../../services/applicationService";
import {
  CoApplicant,
  PersonalInfo,
  EmploymentInfo,
  IncomeInfo,
} from "../../types/application.types";

interface CoApplicantFormProps {
  applicationId: string;
  coApplicant: CoApplicant;
  onSave?: () => void;
}

const CoApplicantForm: React.FC<CoApplicantFormProps> = ({
  applicationId,
  coApplicant,
  onSave,
}) => {
  const [activeSection, setActiveSection] = useState<
    "personal" | "employment" | "income"
  >("personal");
  const [personalInfo, setPersonalInfo] = useState<Partial<PersonalInfo>>(
    coApplicant.personalInfo || {},
  );
  const [employment, setEmployment] = useState<Partial<EmploymentInfo>[]>(
    coApplicant.employment || [{}],
  );
  const [income, setIncome] = useState<Partial<IncomeInfo>[]>(
    coApplicant.income || [{}],
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await applicationService.updateCoApplicant(
        applicationId,
        coApplicant.id,
        {
          personalInfo: personalInfo as PersonalInfo,
          employment: employment as EmploymentInfo[],
          income: income as IncomeInfo[],
        },
      );
      onSave?.();
    } catch (error) {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Co-Applicant Information
        </h2>
        <p className="text-gray-600">{coApplicant.email}</p>
      </div>

      {/* Section Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveSection("personal")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "personal"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <User className="w-5 h-5 inline mr-2" />
          Personal Info
        </button>
        <button
          onClick={() => setActiveSection("employment")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "employment"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Briefcase className="w-5 h-5 inline mr-2" />
          Employment
        </button>
        <button
          onClick={() => setActiveSection("income")}
          className={`px-6 py-3 font-medium transition-colors ${
            activeSection === "income"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <DollarSign className="w-5 h-5 inline mr-2" />
          Income
        </button>
      </div>

      {/* Personal Info Section */}
      {activeSection === "personal" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={personalInfo.firstName || ""}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    firstName: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={personalInfo.lastName || ""}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone *
              </label>
              <input
                type="tel"
                value={personalInfo.phone || ""}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                value={personalInfo.dateOfBirth || ""}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    dateOfBirth: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Employment Section */}
      {activeSection === "employment" && (
        <div className="space-y-4">
          {employment.map((emp, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employer Name *
                  </label>
                  <input
                    type="text"
                    value={emp.employerName || ""}
                    onChange={(e) => {
                      const updated = [...employment];
                      updated[index] = {
                        ...updated[index],
                        employerName: e.target.value,
                      };
                      setEmployment(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={emp.jobTitle || ""}
                    onChange={(e) => {
                      const updated = [...employment];
                      updated[index] = {
                        ...updated[index],
                        jobTitle: e.target.value,
                      };
                      setEmployment(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Income Section */}
      {activeSection === "income" && (
        <div className="space-y-4">
          {income.map((inc, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source *
                  </label>
                  <select
                    value={inc.source || "employment"}
                    onChange={(e) => {
                      const updated = [...income];
                      updated[index] = {
                        ...updated[index],
                        source: e.target.value as "employment" | "self_employment" | "investment",
                      };
                      setIncome(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="employment">Employment</option>
                    <option value="self_employment">Self Employment</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount *
                  </label>
                  <input
                    type="number"
                    value={inc.amount || ""}
                    onChange={(e) => {
                      const updated = [...income];
                      updated[index] = {
                        ...updated[index],
                        amount: parseFloat(e.target.value),
                      };
                      setIncome(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    value={inc.frequency || "monthly"}
                    onChange={(e) => {
                      const updated = [...income];
                      updated[index] = {
                        ...updated[index],
                        frequency: e.target.value as "hourly" | "weekly" | "biweekly" | "monthly" | "annually",
                      };
                      setIncome(updated);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Bi-weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5 mr-2" />
            Save Information
          </>
        )}
      </button>
    </div>
  );
};

export default CoApplicantForm;
