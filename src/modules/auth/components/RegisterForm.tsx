// FILE PATH: src/modules/auth/components/RegisterForm.tsx
// Module 1.1: User Authentication & Management - Registration Form Component

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { validators } from '../utils/validation';
import { UserRole } from '../types/auth.types';
import { Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onLogin }) => {
  const { register, isLoading, error } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: UserRole.TENANT,
    acceptedTerms: false
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const roleOptions = [
    { 
      value: UserRole.TENANT, 
      label: 'Tenant', 
      desc: 'Looking for a place to rent',
      icon: '🏠'
    },
    { 
      value: UserRole.LANDLORD, 
      label: 'Landlord', 
      desc: 'List and manage properties',
      icon: '🏢'
    },
    { 
      value: UserRole.AGENT, 
      label: 'Agent', 
      desc: 'Real estate professional',
      icon: '💼'
    },
    { 
      value: UserRole.PROPERTY_MANAGER, 
      label: 'Property Manager', 
      desc: 'Manage properties for owners',
      icon: '🔑'
    },
    { 
      value: UserRole.BUSINESS, 
      label: 'Business', 
      desc: 'Corporate housing solutions',
      icon: '🏛️'
    }
  ];

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!validators.name(formData.firstName)) {
      errors.firstName = 'First name must be 2-50 characters';
    }
    if (!validators.name(formData.lastName)) {
      errors.lastName = 'Last name must be 2-50 characters';
    }
    if (!validators.email(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.phone && !validators.phone(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    const passwordValidation = validators.password(formData.password);
    if (!passwordValidation.valid) {
      errors.password = passwordValidation.errors[0];
    }
    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.acceptedTerms) {
      errors.terms = 'You must accept the terms and conditions';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    if (currentStep === 1) isValid = validateStep1();
    if (currentStep === 2) isValid = validateStep2();
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) return;

    try {
      await register(formData);
      onSuccess?.();
    } catch (err) {
      // Error handled by Redux
    }
  };

  const passwordStrength = validators.getPasswordStrength(formData.password);
  const strengthColors = {
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Create Your Account
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Step {currentStep} of 3
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                } ${step !== 3 ? 'mr-2' : ''}`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {validationErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Doe"
                  />
                  {validationErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.phone}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 2: Password & Security */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1 bg-gray-200 rounded">
                        <div 
                          className={`h-full rounded transition-all ${strengthColors[passwordStrength]}`}
                          style={{ 
                            width: passwordStrength === 'weak' ? '33%' : 
                                   passwordStrength === 'medium' ? '66%' : '100%' 
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium capitalize">{passwordStrength}</span>
                    </div>
                  </div>
                )}
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Password must contain:</p>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'} />
                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-600'}>
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'} />
                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                      One uppercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'} />
                    <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                      One lowercase letter
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'} />
                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                      One number
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className={/[!@#$%^&*]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'} />
                    <span className={/[!@#$%^&*]/.test(formData.password) ? 'text-green-600' : 'text-gray-600'}>
                      One special character
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Role Selection & Terms */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a... *
                </label>
                <div className="space-y-2">
                  {roleOptions.map((role) => (
                    <label
                      key={role.value}
                      className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.role === role.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.value}
                        checked={formData.role === role.value}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                        className="mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{role.icon}</span>
                          <p className="font-medium text-gray-900">{role.label}</p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{role.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                  </span>
                </label>
                {validationErrors.terms && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.terms}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Already have an account? </span>
          <button
            type="button"
            onClick={onLogin}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};